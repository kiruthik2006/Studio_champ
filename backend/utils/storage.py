import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime


class StorageService:
    def __init__(self, app_config):
        self.config = app_config
        self.upload_folder = app_config.get("UPLOAD_FOLDER")
        self.faces_folder = app_config.get("FACES_FOLDER")
        self.events_folder = app_config.get("EVENTS_FOLDER")
        self.annotated_folder = app_config.get("ANNOTATED_FOLDER")
        self.allowed_extensions = app_config.get(
            "ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg", "gif"}
        )

    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return (
            "." in filename
            and filename.rsplit(".", 1)[1].lower() in self.allowed_extensions
        )

    def generate_unique_filename(self, original_filename, prefix=""):
        """Generate a unique filename with timestamp and UUID"""
        ext = (
            original_filename.rsplit(".", 1)[1].lower()
            if "." in original_filename
            else "jpg"
        )
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]

        if prefix:
            return f"{prefix}_{timestamp}_{unique_id}.{ext}"
        return f"{timestamp}_{unique_id}.{ext}"

    def save_face_image(self, file_obj, user_id):
        """
        Save a face registration image
        Returns: relative path to saved file
        """
        if not file_obj or not self.allowed_file(file_obj.filename):
            raise ValueError("Invalid file or file type not allowed")

        # Generate unique filename
        filename = self.generate_unique_filename(file_obj.filename, f"user_{user_id}")
        filepath = os.path.join(self.faces_folder, filename)

        # Save file
        file_obj.save(filepath)

        # Return relative path
        return os.path.join("faces", filename)

    def save_event_photo(self, file_obj, event_id):
        """
        Save an event photo
        Returns: relative path to saved file
        """
        if not file_obj or not self.allowed_file(file_obj.filename):
            raise ValueError("Invalid file or file type not allowed")

        # Create event subfolder
        event_folder = os.path.join(self.events_folder, f"event_{event_id}")
        os.makedirs(event_folder, exist_ok=True)

        # Generate unique filename
        filename = self.generate_unique_filename(file_obj.filename, f"event_{event_id}")
        filepath = os.path.join(event_folder, filename)

        # Save file
        file_obj.save(filepath)

        # Return relative path
        return os.path.join("events", f"event_{event_id}", filename)

    def save_annotated_photo(self, source_path, filename):
        """
        Save an annotated photo (with face boxes)
        Returns: full path to saved file
        """
        filepath = os.path.join(self.annotated_folder, filename)
        return filepath

    def get_full_path(self, relative_path):
        """Convert relative path to full path"""
        return os.path.join(self.upload_folder, relative_path)

    def get_file_size(self, relative_path):
        """Get file size in bytes"""
        try:
            full_path = self.get_full_path(relative_path)
            return os.path.getsize(full_path)
        except:
            return 0

    def get_mime_type(self, filename):
        """Get MIME type based on file extension"""
        ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        mime_types = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "gif": "image/gif",
            "bmp": "image/bmp",
            "webp": "image/webp",
        }
        return mime_types.get(ext, "application/octet-stream")

    def delete_file(self, relative_path):
        """Delete a file from storage"""
        try:
            full_path = self.get_full_path(relative_path)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
        return False

    def file_exists(self, relative_path):
        """Check if file exists"""
        full_path = self.get_full_path(relative_path)
        return os.path.exists(full_path)

    def get_file_url(self, relative_path):
        """Get URL path for a file"""
        return f"/uploads/{relative_path.replace(os.sep, '/')}"


# Singleton instance
storage_service = None


def init_storage_service(app_config):
    """Initialize the storage service singleton"""
    global storage_service
    storage_service = StorageService(app_config)
    return storage_service


def get_storage_service():
    """Get the storage service instance"""
    global storage_service
    if storage_service is None:
        raise RuntimeError("Storage service not initialized")
    return storage_service
