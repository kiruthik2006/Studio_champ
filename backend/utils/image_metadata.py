import os
import piexif
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from datetime import datetime
import cv2
import numpy as np


def get_image_metadata(image_path):
    """
    Extract EXIF metadata from an image
    Returns: dict with metadata
    """
    metadata = {
        "capture_date": None,
        "camera_model": None,
        "lens_model": None,
        "iso": None,
        "aperture": None,
        "shutter_speed": None,
        "focal_length": None,
        "gps_latitude": None,
        "gps_longitude": None,
    }

    try:
        image = Image.open(image_path)

        # Get EXIF data
        exif_data = image._getexif()
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)

                if tag == "DateTimeOriginal":
                    try:
                        metadata["capture_date"] = datetime.strptime(
                            value, "%Y:%m:%d %H:%M:%S"
                        )
                    except:
                        pass

                elif tag == "Model":
                    metadata["camera_model"] = str(value).strip()

                elif tag == "LensModel":
                    metadata["lens_model"] = str(value).strip()

                elif tag == "ISOSpeedRatings":
                    metadata["iso"] = (
                        int(value) if isinstance(value, (int, str)) else None
                    )

                elif tag == "FNumber":
                    metadata["aperture"] = f"f/{value}"

                elif tag == "ExposureTime":
                    if isinstance(value, tuple) and len(value) == 2:
                        metadata["shutter_speed"] = f"{value[0]}/{value[1]}"
                    else:
                        metadata["shutter_speed"] = str(value)

                elif tag == "FocalLength":
                    if isinstance(value, tuple) and len(value) == 2:
                        metadata["focal_length"] = f"{value[0] / value[1]:.1f}mm"
                    else:
                        metadata["focal_length"] = f"{value}mm"

                elif tag == "GPSInfo":
                    gps_data = {}
                    for key in value.keys():
                        decode = GPSTAGS.get(key, key)
                        gps_data[decode] = value[key]

                    # Convert GPS coordinates
                    lat = gps_data.get("GPSLatitude")
                    lat_ref = gps_data.get("GPSLatitudeRef")
                    lon = gps_data.get("GPSLongitude")
                    lon_ref = gps_data.get("GPSLongitudeRef")

                    if lat and lat_ref and lon and lon_ref:
                        metadata["gps_latitude"] = convert_gps_coords(lat, lat_ref)
                        metadata["gps_longitude"] = convert_gps_coords(lon, lon_ref)
    except Exception as e:
        print(f"Error extracting metadata: {str(e)}")

    return metadata


def convert_gps_coords(coords, ref):
    """Convert GPS coordinates from degrees/minutes/seconds to decimal"""
    try:
        degrees = coords[0][0] / coords[0][1]
        minutes = coords[1][0] / coords[1][1]
        seconds = coords[2][0] / coords[2][1]

        decimal = degrees + minutes / 60 + seconds / 3600

        if ref in ["S", "W"]:
            decimal = -decimal

        return decimal
    except:
        return None


def calculate_image_quality(image_path):
    """
    Calculate various quality metrics for an image
    Returns: dict with quality scores
    """
    try:
        # Load image with OpenCV
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not load image")

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. Sharpness (using Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Normalize to 0-100 scale (typical values range from 0 to 500+)
        sharpness_score = min(100, (laplacian_var / 500) * 100)

        # 2. Clarity (using standard deviation of pixel values)
        std_dev = np.std(gray)
        clarity_score = min(100, (std_dev / 80) * 100)

        # 3. Lighting quality (mean brightness assessment)
        mean_brightness = np.mean(gray)
        # Ideal brightness is around 128 (middle of 0-255)
        lighting_score = 100 - abs(mean_brightness - 128) / 128 * 100

        # 4. Blur detection (lower variance indicates blur)
        blur_score = min(100, laplacian_var / 10)  # Higher = less blur

        # 5. Overall quality (weighted average)
        overall_score = (
            sharpness_score * 0.35
            + clarity_score * 0.25
            + lighting_score * 0.20
            + blur_score * 0.20
        )

        return {
            "clarity_score": round(clarity_score, 2),
            "sharpness_score": round(sharpness_score, 2),
            "lighting_score": round(lighting_score, 2),
            "blur_score": round(blur_score, 2),
            "overall_quality_score": round(overall_score, 2),
        }
    except Exception as e:
        print(f"Error calculating quality: {str(e)}")
        return {
            "clarity_score": None,
            "sharpness_score": None,
            "lighting_score": None,
            "blur_score": None,
            "overall_quality_score": None,
        }


def detect_photo_type(image_path, face_count=0):
    """
    Automatically detect photo type based on content
    Returns: string ('landscape', 'portrait', 'group', 'candid', 'other')
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return "other"

        height, width = img.shape[:2]
        aspect_ratio = width / height

        # If faces detected
        if face_count > 0:
            if face_count >= 3:
                return "group"
            elif face_count == 1:
                # Check if it's a portrait (tall aspect ratio) or candid
                if aspect_ratio < 0.8:
                    return "portrait"
                else:
                    return "candid"
            else:
                return "candid"
        else:
            # No faces detected - check if landscape
            if aspect_ratio > 1.5:
                return "landscape"
            else:
                return "other"
    except Exception as e:
        print(f"Error detecting photo type: {str(e)}")
        return "other"


def create_thumbnail(image_path, output_path, size=(300, 300)):
    """Create a thumbnail of the image"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Create thumbnail
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(output_path, "JPEG", quality=85)
            return True
    except Exception as e:
        print(f"Error creating thumbnail: {str(e)}")
        return False


def resize_image(image_path, output_path, max_dimension=2048, quality=85):
    """
    Resize image if it exceeds max_dimension while maintaining aspect ratio
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != "RGB":
                img = img.convert("RGB")

            width, height = img.size

            # Check if resizing is needed
            if max(width, height) > max_dimension:
                ratio = max_dimension / max(width, height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Save with quality setting
            img.save(output_path, "JPEG", quality=quality, optimize=True)
            return True
    except Exception as e:
        print(f"Error resizing image: {str(e)}")
        return False


def get_image_dimensions(image_path):
    """Get image width and height"""
    try:
        with Image.open(image_path) as img:
            return img.size
    except:
        return None, None
