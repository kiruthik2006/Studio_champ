import cv2
import numpy as np
from PIL import Image
import os
import json
import warnings

warnings.filterwarnings("ignore")

# Try to import deepface, but provide fallback if not available
try:
    from deepface import DeepFace
    from scipy.spatial.distance import cosine

    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
    print("Warning: DeepFace not available. Face recognition will use simplified mode.")


class FaceRecognitionService:
    def __init__(self, app_config):
        self.config = app_config
        self.detection_model = app_config.get("FACE_DETECTION_MODEL", "opencv")
        self.recognition_model = app_config.get("FACE_RECOGNITION_MODEL", "opencv")
        self.confidence_threshold = app_config.get("FACE_DETECTION_CONFIDENCE", 0.85)
        self.match_threshold = app_config.get("FACE_MATCH_THRESHOLD", 0.65)
        self.max_dimension = app_config.get("MAX_IMAGE_DIMENSION", 2048)

        # Load OpenCV face detector
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def load_image(self, image_path):
        """Load and preprocess image for face recognition"""
        try:
            # Load with PIL first for better format support
            pil_image = Image.open(image_path)

            # Convert to RGB if necessary
            if pil_image.mode != "RGB":
                pil_image = pil_image.convert("RGB")

            # Convert to numpy array
            img_array = np.array(pil_image)

            # Resize if too large (to save memory and processing time)
            height, width = img_array.shape[:2]
            if max(height, width) > self.max_dimension:
                scale = self.max_dimension / max(height, width)
                new_width = int(width * scale)
                new_height = int(height * scale)
                img_array = cv2.resize(img_array, (new_width, new_height))

            return img_array
        except Exception as e:
            raise ValueError(f"Error loading image: {str(e)}")

    def detect_faces(self, image_path):
        """
        Detect faces in an image using OpenCV
        Returns: List of dicts with keys: box, confidence
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                return []

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
            )

            detected_faces = []
            for x, y, w, h in faces:
                detected_faces.append(
                    {
                        "box": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
                        "confidence": 0.9,  # OpenCV doesn't provide confidence, use default
                    }
                )

            return detected_faces
        except Exception as e:
            print(f"Face detection error: {str(e)}")
            return []

    def extract_face_embedding(self, image_path, enforce_detection=True):
        """
        Extract face embedding from an image
        Returns: dict with embedding array and face info
        """
        if DEEPFACE_AVAILABLE:
            try:
                embeddings = DeepFace.represent(
                    img_path=image_path,
                    model_name=self.recognition_model,
                    detector_backend=self.detection_model,
                    enforce_detection=enforce_detection,
                    align=True,
                )

                results = []
                for emb in embeddings:
                    results.append(
                        {
                            "embedding": emb["embedding"],
                            "facial_area": emb.get("facial_area", {}),
                            "confidence": emb.get("confidence", 1.0),
                        }
                    )

                return results
            except Exception as e:
                print(f"DeepFace embedding extraction error: {str(e)}")
                return []
        else:
            # Simplified embedding using face histogram
            try:
                img = cv2.imread(image_path)
                if img is None:
                    return []

                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 5)

                results = []
                for x, y, w, h in faces:
                    face_roi = gray[y : y + h, x : x + w]
                    # Resize to fixed size for consistent embedding
                    face_roi = cv2.resize(face_roi, (100, 100))
                    # Flatten as simple embedding
                    embedding = face_roi.flatten().tolist()
                    # Normalize
                    embedding = [float(e) / 255.0 for e in embedding]

                    results.append(
                        {
                            "embedding": embedding,
                            "facial_area": {
                                "x": int(x),
                                "y": int(y),
                                "w": int(w),
                                "h": int(h),
                            },
                            "confidence": 0.9,
                        }
                    )

                return results
            except Exception as e:
                print(f"Simplified embedding error: {str(e)}")
                return []

    def compare_faces(self, embedding1, embedding2):
        """
        Compare two face embeddings
        Returns: similarity score (0-1, higher = more similar)
        """
        try:
            if DEEPFACE_AVAILABLE and len(embedding1) == 512:
                # Use cosine similarity for DeepFace embeddings
                if isinstance(embedding1, list):
                    embedding1 = np.array(embedding1)
                if isinstance(embedding2, list):
                    embedding2 = np.array(embedding2)

                distance = cosine(embedding1, embedding2)
                return float(1 - distance)
            else:
                # Use correlation for simple embeddings
                if isinstance(embedding1, list):
                    embedding1 = np.array(embedding1)
                if isinstance(embedding2, list):
                    embedding2 = np.array(embedding2)

                # Ensure same length
                min_len = min(len(embedding1), len(embedding2))
                embedding1 = embedding1[:min_len]
                embedding2 = embedding2[:min_len]

                # Calculate correlation
                correlation = np.corrcoef(embedding1, embedding2)[0, 1]
                if np.isnan(correlation):
                    return 0.0

                # Convert to 0-1 scale
                similarity = (correlation + 1) / 2
                return float(similarity)
        except Exception as e:
            print(f"Face comparison error: {str(e)}")
            return 0.0

    def find_matching_faces(
        self, user_embedding, photo_embeddings_list, threshold=None
    ):
        """
        Find all photos where user face matches above threshold
        Returns: List of dicts with photo_id, confidence, matched_face_index
        """
        if threshold is None:
            threshold = self.match_threshold

        matches = []

        for photo_data in photo_embeddings_list:
            photo_id = photo_data.get("photo_id")
            embeddings = photo_data.get("embeddings", [])

            if not embeddings:
                continue

            best_match = None
            best_confidence = 0

            for idx, face_embedding in enumerate(embeddings):
                confidence = self.compare_faces(user_embedding, face_embedding)

                if confidence > best_confidence:
                    best_confidence = confidence
                    best_match = idx

            if best_confidence >= threshold:
                matches.append(
                    {
                        "photo_id": photo_id,
                        "confidence": best_confidence,
                        "matched_face_index": best_match,
                    }
                )

        matches.sort(key=lambda x: x["confidence"], reverse=True)
        return matches

    def process_photo_for_faces(self, image_path):
        """
        Process a photo to detect all faces and extract embeddings
        Returns: dict with face_count, embeddings, detected_faces
        """
        try:
            detected_faces = self.detect_faces(image_path)

            if not detected_faces:
                return {"face_count": 0, "embeddings": [], "detected_faces": []}

            embeddings = []
            face_data = []

            # Extract embeddings for all faces
            face_embeddings = self.extract_face_embedding(
                image_path, enforce_detection=False
            )

            for idx, face_info in enumerate(detected_faces):
                if idx < len(face_embeddings):
                    embeddings.append(face_embeddings[idx]["embedding"])
                    face_data.append(
                        {
                            "index": idx,
                            "box": face_info["box"],
                            "confidence": face_info["confidence"],
                        }
                    )

            return {
                "face_count": len(embeddings),
                "embeddings": embeddings,
                "detected_faces": face_data,
            }
        except Exception as e:
            print(f"Photo processing error: {str(e)}")
            return {
                "face_count": 0,
                "embeddings": [],
                "detected_faces": [],
                "error": str(e),
            }

    def annotate_image_with_faces(self, image_path, faces, output_path):
        """
        Draw bounding boxes around detected faces
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not load image")

            for face in faces:
                box = face.get("box", {})
                x = box.get("x", 0)
                y = box.get("y", 0)
                w = box.get("w", 0)
                h = box.get("h", 0)
                confidence = face.get("confidence", 0)

                # Draw rectangle
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Draw confidence text
                label = f"{confidence:.2%}"
                cv2.putText(
                    img,
                    label,
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2,
                )

            # Save annotated image
            cv2.imwrite(output_path, img)
            return True
        except Exception as e:
            print(f"Annotation error: {str(e)}")
            return False

    def verify_face_match(self, image1_path, image2_path):
        """
        Verify if two images contain the same person
        Returns: dict with verified (bool), similarity
        """
        try:
            if DEEPFACE_AVAILABLE:
                result = DeepFace.verify(
                    img1_path=image1_path,
                    img2_path=image2_path,
                    model_name=self.recognition_model,
                    detector_backend=self.detection_model,
                    distance_metric="cosine",
                )

                return {
                    "verified": result["verified"],
                    "distance": float(result["distance"]),
                    "threshold": float(result["threshold"]),
                    "model": self.recognition_model,
                    "similarity": 1 - float(result["distance"]),
                }
            else:
                # Simplified verification
                emb1 = self.extract_face_embedding(image1_path)
                emb2 = self.extract_face_embedding(image2_path)

                if not emb1 or not emb2:
                    return {"verified": False, "error": "Could not extract embeddings"}

                similarity = self.compare_faces(
                    emb1[0]["embedding"], emb2[0]["embedding"]
                )

                return {
                    "verified": similarity >= self.match_threshold,
                    "similarity": similarity,
                    "threshold": self.match_threshold,
                    "model": "opencv_simplified",
                }
        except Exception as e:
            print(f"Face verification error: {str(e)}")
            return {"verified": False, "error": str(e)}


# Singleton instance
face_service = None


def init_face_service(app_config):
    """Initialize the face recognition service singleton"""
    global face_service
    face_service = FaceRecognitionService(app_config)
    return face_service


def get_face_service():
    """Get the face recognition service instance"""
    global face_service
    if face_service is None:
        raise RuntimeError("Face recognition service not initialized")
    return face_service
