from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

# Create db instance here - will be initialized in app.py
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(
        db.Enum("admin", "user", name="user_role"), default="user", nullable=False
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    last_login = db.Column(db.DateTime, nullable=True)

    # Relationships
    family_members = db.relationship(
        "FamilyMember", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )
    face_embeddings = db.relationship(
        "FaceEmbedding", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )
    user_events = db.relationship(
        "UserEvent", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )
    feedbacks = db.relationship(
        "UserFeedback", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": f"{self.first_name} {self.last_name}",
            "role": self.role,
            "is_active": self.is_active,
            "circle_members_count": self.family_members.count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }


class FamilyMember(db.Model):
    __tablename__ = "family_members"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    name = db.Column(db.String(100), nullable=False)
    relationship = db.Column(db.String(50), default="Family", nullable=False)
    is_self = db.Column(db.Boolean, default=False, nullable=False)
    avatar_path = db.Column(db.String(500), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    face_embeddings = db.relationship(
        "FaceEmbedding", backref="family_member", lazy="dynamic", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "relationship": self.relationship,
            "is_self": self.is_self,
            "avatar_path": self.avatar_path,
            "notes": self.notes,
            "face_count": self.face_embeddings.count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class FaceEmbedding(db.Model):
    __tablename__ = "face_embeddings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    member_id = db.Column(
        db.Integer, db.ForeignKey("family_members.id"), nullable=True, index=True
    )
    embedding = db.Column(
        db.JSON, nullable=False
    )  # 512-dimensional vector as JSON array
    image_path = db.Column(db.String(500), nullable=False)
    angle_slot = db.Column(db.String(30), default="front", nullable=True)
    quality_score = db.Column(db.Float, default=1.0, nullable=True)
    is_primary = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def get_embedding_array(self):
        """Convert JSON embedding to numpy array"""
        if isinstance(self.embedding, str):
            return json.loads(self.embedding)
        return self.embedding

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "member_id": self.member_id,
            "member_name": self.family_member.name if self.family_member else None,
            "image_path": self.image_path,
            "angle_slot": self.angle_slot,
            "quality_score": self.quality_score,
            "is_primary": self.is_primary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class EventType(db.Model):
    __tablename__ = "event_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    events = db.relationship("Event", backref="event_type", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    event_type_id = db.Column(
        db.Integer, db.ForeignKey("event_types.id"), nullable=True
    )
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    event_date = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    photos = db.relationship(
        "Photo", backref="event", lazy="dynamic", cascade="all, delete-orphan"
    )
    user_events = db.relationship(
        "UserEvent", backref="event", lazy="dynamic", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "event_type_id": self.event_type_id,
            "event_type": self.event_type.name if self.event_type else None,
            "name": self.name,
            "description": self.description,
            "location": self.location,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "photo_count": self.photos.count(),
        }


class Photo(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(
        db.Integer, db.ForeignKey("events.id"), nullable=False, index=True
    )
    file_path = db.Column(db.String(500), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, nullable=True)  # in bytes
    mime_type = db.Column(db.String(50), nullable=True)

    # EXIF metadata
    capture_date = db.Column(db.DateTime, nullable=True)
    camera_model = db.Column(db.String(100), nullable=True)
    lens_model = db.Column(db.String(100), nullable=True)
    iso = db.Column(db.Integer, nullable=True)
    aperture = db.Column(db.String(20), nullable=True)
    shutter_speed = db.Column(db.String(20), nullable=True)
    focal_length = db.Column(db.String(20), nullable=True)
    gps_latitude = db.Column(db.Float, nullable=True)
    gps_longitude = db.Column(db.Float, nullable=True)

    # Photo type and quality
    photo_type = db.Column(
        db.Enum("landscape", "portrait", "group", "candid", "other", name="photo_type"),
        default="other",
        nullable=True,
    )
    face_count = db.Column(db.Integer, default=0, nullable=False)
    clarity_score = db.Column(db.Float, nullable=True)  # 0-100
    sharpness_score = db.Column(db.Float, nullable=True)  # 0-100
    lighting_score = db.Column(db.Float, nullable=True)  # 0-100
    blur_score = db.Column(db.Float, nullable=True)  # 0-100 (higher = more blur)
    overall_quality_score = db.Column(db.Float, nullable=True)  # 0-100

    # Face recognition data
    face_embeddings = db.Column(
        db.JSON, nullable=True
    )  # Array of face embeddings detected
    detected_faces = db.Column(
        db.JSON, nullable=True
    )  # Bounding boxes and confidence scores

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    processed_at = db.Column(db.DateTime, nullable=True)
    processed = db.Column(db.Boolean, default=False, nullable=False)

    # Relationships
    feedbacks = db.relationship(
        "UserFeedback", backref="photo", lazy="dynamic", cascade="all, delete-orphan"
    )

    def get_face_embeddings(self):
        """Get face embeddings as list"""
        if self.face_embeddings:
            if isinstance(self.face_embeddings, str):
                return json.loads(self.face_embeddings)
            return self.face_embeddings
        return []

    def get_detected_faces(self):
        """Get detected faces data"""
        if self.detected_faces:
            if isinstance(self.detected_faces, str):
                return json.loads(self.detected_faces)
            return self.detected_faces
        return []

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "file_path": self.file_path,
            "file_name": self.file_name,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "capture_date": self.capture_date.isoformat()
            if self.capture_date
            else None,
            "camera_model": self.camera_model,
            "photo_type": self.photo_type,
            "face_count": self.face_count,
            "quality_score": self.overall_quality_score,
            "clarity_score": self.clarity_score,
            "sharpness_score": self.sharpness_score,
            "lighting_score": self.lighting_score,
            "processed": self.processed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class UserEvent(db.Model):
    __tablename__ = "user_events"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    event_id = db.Column(
        db.Integer, db.ForeignKey("events.id"), nullable=False, index=True
    )
    registration_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "event_id", name="unique_user_event"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "event": self.event.to_dict() if self.event else None,
            "registration_date": self.registration_date.isoformat()
            if self.registration_date
            else None,
        }


class UserFeedback(db.Model):
    __tablename__ = "user_feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    photo_id = db.Column(
        db.Integer, db.ForeignKey("photos.id"), nullable=False, index=True
    )
    is_correct = db.Column(db.Boolean, nullable=False)  # True if the match is correct
    feedback_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "photo_id": self.photo_id,
            "is_correct": self.is_correct,
            "feedback_date": self.feedback_date.isoformat()
            if self.feedback_date
            else None,
            "notes": self.notes,
        }
