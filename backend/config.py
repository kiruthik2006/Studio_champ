import os
from datetime import timedelta


class Config:
    # Use fixed secret keys to ensure consistency
    SECRET_KEY = "facerec-secret-key-2026-fixed"

    # Database configuration
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL")
        or "sqlite:///facerec.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    }

    # JWT configuration - Use fixed secret key for consistency
    JWT_SECRET_KEY = "facerec-jwt-secret-2026-fixed"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Increased from 1 hour to 24 hours
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # File upload configuration
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "static", "uploads"
    )
    FACES_FOLDER = os.path.join(UPLOAD_FOLDER, "faces")
    EVENTS_FOLDER = os.path.join(UPLOAD_FOLDER, "events")
    ANNOTATED_FOLDER = os.path.join(UPLOAD_FOLDER, "annotated")

    # Allowed file extensions
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "webp"}

    # Face recognition configuration
    FACE_DETECTION_MODEL = "mtcnn"  # Options: mtcnn, opencv, dlib, retinaface
    FACE_RECOGNITION_MODEL = "Facenet512"  # Options: VGG-Face, Facenet, Facenet512, OpenFace, DeepFace, DeepID, ArcFace, Dlib
    FACE_DETECTION_CONFIDENCE = 0.85
    FACE_MATCH_THRESHOLD = 0.65  # Cosine similarity threshold
    EMBEDDING_DIMENSION = 512

    # Photo processing
    MAX_IMAGE_DIMENSION = 2048
    THUMBNAIL_SIZE = (300, 300)
    JPEG_QUALITY = 85

    # Security
    BCRYPT_ROUNDS = 10
    CORS_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
    ]

    # Pagination
    PHOTOS_PER_PAGE = 20
    EVENTS_PER_PAGE = 10


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    # Use SQLite for easy testing (no MySQL required)
    SQLALCHEMY_DATABASE_URI = "sqlite:///facerec.db"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

    # In production, these must be set via environment variables
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
