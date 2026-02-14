from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from models import db, User, Event, EventType, Photo
from services.face_recognition import get_face_service
from utils.storage import get_storage_service
from utils.image_metadata import (
    get_image_metadata,
    calculate_image_quality,
    detect_photo_type,
)
from sqlalchemy import func
import os

admin_bp = Blueprint("admin", __name__)


def admin_required(fn):
    """Decorator to require admin role"""

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user or user.role != "admin":
            return jsonify({"success": False, "message": "Admin access required"}), 403

        return fn(*args, **kwargs)

    return wrapper


# Statistics
@admin_bp.route("/stats", methods=["GET"])
@admin_required
def get_stats():
    """Get system statistics"""
    try:
        stats = {
            "total_users": User.query.count(),
            "active_users": User.query.filter_by(is_active=True).count(),
            "total_events": Event.query.count(),
            "active_events": Event.query.filter_by(is_active=True).count(),
            "total_photos": Photo.query.count(),
            "processed_photos": Photo.query.filter_by(processed=True).count(),
            "total_face_embeddings": db.session.query(func.count(User.id))
            .select_from(User)
            .join(User.face_embeddings)
            .scalar()
            or 0,
            "recent_events": [
                e.to_dict()
                for e in Event.query.order_by(Event.created_at.desc()).limit(5).all()
            ],
        }

        return jsonify({"success": True, "data": stats}), 200

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Failed to get stats: {str(e)}"}
        ), 500


# Event Types
@admin_bp.route("/event-types", methods=["GET"])
@admin_required
def get_event_types():
    """Get all event types"""
    try:
        types = EventType.query.all()
        return jsonify({"success": True, "data": [t.to_dict() for t in types]}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route("/event-types", methods=["POST"])
@admin_required
def create_event_type():
    """Create a new event type"""
    try:
        data = request.get_json()

        if not data.get("name"):
            return jsonify(
                {"success": False, "message": "Event type name is required"}
            ), 400

        if EventType.query.filter_by(name=data["name"]).first():
            return jsonify(
                {"success": False, "message": "Event type already exists"}
            ), 409

        event_type = EventType(
            name=data["name"],
            description=data.get("description"),
            created_by=get_jwt_identity(),
        )

        db.session.add(event_type)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Event type created",
                "data": event_type.to_dict(),
            }
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# Events
@admin_bp.route("/events", methods=["GET"])
@admin_required
def get_events():
    """Get all events (including inactive)"""
    try:
        page = request.args.get("page", 1, type=int)
        per_page = current_app.config.get("EVENTS_PER_PAGE", 10)

        events = Event.query.order_by(Event.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify(
            {
                "success": True,
                "data": {
                    "events": [event.to_dict() for event in events.items],
                    "total": events.total,
                    "pages": events.pages,
                    "current_page": page,
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route("/events", methods=["POST"])
@admin_required
def create_event():
    """Create a new event"""
    try:
        data = request.get_json()

        if not data.get("name"):
            return jsonify({"success": False, "message": "Event name is required"}), 400

        from datetime import datetime

        event_date = None
        if data.get("event_date"):
            try:
                event_date = datetime.fromisoformat(data["event_date"])
            except:
                pass

        event = Event(
            name=data["name"],
            description=data.get("description"),
            location=data.get("location"),
            event_date=event_date,
            event_type_id=data.get("event_type_id"),
            is_active=data.get("is_active", True),
            created_by=get_jwt_identity(),
        )

        db.session.add(event)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Event created successfully",
                "data": event.to_dict(),
            }
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route("/events/<int:event_id>", methods=["PUT"])
@admin_required
def update_event(event_id):
    """Update an event"""
    try:
        event = Event.query.get(event_id)

        if not event:
            return jsonify({"success": False, "message": "Event not found"}), 404

        data = request.get_json()

        if "name" in data:
            event.name = data["name"]
        if "description" in data:
            event.description = data["description"]
        if "location" in data:
            event.location = data["location"]
        if "event_type_id" in data:
            event.event_type_id = data["event_type_id"]
        if "is_active" in data:
            event.is_active = data["is_active"]
        if "event_date" in data:
            from datetime import datetime

            try:
                event.event_date = datetime.fromisoformat(data["event_date"])
            except:
                pass

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Event updated successfully",
                "data": event.to_dict(),
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route("/events/<int:event_id>", methods=["DELETE"])
@admin_required
def delete_event(event_id):
    """Delete an event"""
    try:
        event = Event.query.get(event_id)

        if not event:
            return jsonify({"success": False, "message": "Event not found"}), 404

        # Delete associated photos and files
        storage_service = get_storage_service()
        for photo in event.photos:
            storage_service.delete_file(photo.file_path)

        db.session.delete(event)
        db.session.commit()

        return jsonify({"success": True, "message": "Event deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# Users
@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    """Get all users"""
    try:
        page = request.args.get("page", 1, type=int)
        per_page = 20

        users = User.query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify(
            {
                "success": True,
                "data": {
                    "users": [user.to_dict() for user in users.items],
                    "total": users.total,
                    "pages": users.pages,
                    "current_page": page,
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    """Update user (activate/deactivate, change role)"""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json()

        if "is_active" in data:
            user.is_active = data["is_active"]
        if "role" in data and data["role"] in ["admin", "user"]:
            user.role = data["role"]

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "User updated successfully",
                "data": user.to_dict(),
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# Photo Upload for Events
@admin_bp.route("/upload-event-photos/<int:event_id>", methods=["POST"])
@admin_required
def upload_event_photos(event_id):
    """Upload photos to an event"""
    try:
        event = Event.query.get(event_id)

        if not event:
            return jsonify({"success": False, "message": "Event not found"}), 404

        if "photos" not in request.files:
            return jsonify({"success": False, "message": "No photos provided"}), 400

        files = request.files.getlist("photos")

        if len(files) == 0:
            return jsonify({"success": False, "message": "No photos provided"}), 400

        face_service = get_face_service()
        storage_service = get_storage_service()

        uploaded_photos = []
        errors = []

        for file in files:
            try:
                if not file.filename:
                    continue

                if not storage_service.allowed_file(file.filename):
                    errors.append(f"{file.filename}: Invalid file type")
                    continue

                # Save file
                relative_path = storage_service.save_event_photo(file, event_id)
                full_path = storage_service.get_full_path(relative_path)

                # Extract metadata
                metadata = get_image_metadata(full_path)

                # Calculate quality scores
                quality = calculate_image_quality(full_path)

                # Process faces
                face_data = face_service.process_photo_for_faces(full_path)

                # Detect photo type
                photo_type = detect_photo_type(full_path, face_data["face_count"])

                # Create photo record
                photo = Photo(
                    event_id=event_id,
                    file_path=relative_path,
                    file_name=file.filename,
                    file_size=storage_service.get_file_size(relative_path),
                    mime_type=storage_service.get_mime_type(file.filename),
                    capture_date=metadata.get("capture_date"),
                    camera_model=metadata.get("camera_model"),
                    lens_model=metadata.get("lens_model"),
                    iso=metadata.get("iso"),
                    aperture=metadata.get("aperture"),
                    shutter_speed=metadata.get("shutter_speed"),
                    focal_length=metadata.get("focal_length"),
                    gps_latitude=metadata.get("gps_latitude"),
                    gps_longitude=metadata.get("gps_longitude"),
                    photo_type=photo_type,
                    face_count=face_data["face_count"],
                    clarity_score=quality.get("clarity_score"),
                    sharpness_score=quality.get("sharpness_score"),
                    lighting_score=quality.get("lighting_score"),
                    blur_score=quality.get("blur_score"),
                    overall_quality_score=quality.get("overall_quality_score"),
                    face_embeddings=face_data.get("embeddings"),
                    detected_faces=face_data.get("detected_faces"),
                    processed=True,
                    processed_at=func.now(),
                )

                db.session.add(photo)
                db.session.flush()  # Get the photo ID

                uploaded_photos.append(
                    {
                        "id": photo.id,
                        "file_name": photo.file_name,
                        "face_count": photo.face_count,
                        "quality_score": photo.overall_quality_score,
                    }
                )

            except Exception as e:
                errors.append(f"{file.filename}: {str(e)}")

        db.session.commit()

        return jsonify(
            {
                "success": len(uploaded_photos) > 0,
                "message": f"Uploaded {len(uploaded_photos)} photos",
                "data": {"uploaded": uploaded_photos, "errors": errors},
            }
        ), 200 if uploaded_photos else 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# Re-process photos
@admin_bp.route("/reprocess-photo/<int:photo_id>", methods=["POST"])
@admin_required
def reprocess_photo(photo_id):
    """Re-process a photo to extract faces and metadata"""
    try:
        photo = Photo.query.get(photo_id)

        if not photo:
            return jsonify({"success": False, "message": "Photo not found"}), 404

        storage_service = get_storage_service()
        face_service = get_face_service()

        full_path = storage_service.get_full_path(photo.file_path)

        if not os.path.exists(full_path):
            return jsonify({"success": False, "message": "Photo file not found"}), 404

        # Re-extract metadata
        metadata = get_image_metadata(full_path)

        # Re-calculate quality
        quality = calculate_image_quality(full_path)

        # Re-process faces
        face_data = face_service.process_photo_for_faces(full_path)

        # Update photo record
        photo.capture_date = metadata.get("capture_date")
        photo.camera_model = metadata.get("camera_model")
        photo.iso = metadata.get("iso")
        photo.aperture = metadata.get("aperture")
        photo.face_count = face_data["face_count"]
        photo.clarity_score = quality.get("clarity_score")
        photo.sharpness_score = quality.get("sharpness_score")
        photo.lighting_score = quality.get("lighting_score")
        photo.blur_score = quality.get("blur_score")
        photo.overall_quality_score = quality.get("overall_quality_score")
        photo.face_embeddings = face_data.get("embeddings")
        photo.detected_faces = face_data.get("detected_faces")
        photo.processed = True
        photo.processed_at = func.now()

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Photo re-processed successfully",
                "data": photo.to_dict(),
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
