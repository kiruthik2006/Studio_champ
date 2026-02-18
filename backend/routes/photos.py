from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
    get_jwt,
)
from models import db, User, FaceEmbedding, Event, Photo, UserEvent
from services.face_recognition import get_face_service
from utils.storage import get_storage_service
from utils.image_metadata import (
    get_image_metadata,
    calculate_image_quality,
    detect_photo_type,
)
from sqlalchemy import and_, or_
import os
from datetime import datetime

photos_bp = Blueprint("photos", __name__)


@photos_bp.route("/upload-faces", methods=["POST"])
def upload_faces():
    """Upload face images for user registration"""
    try:
        # Try to verify JWT from standard locations (headers). If missing/invalid,
        # allow token passed in form or query param as 'access_token' or 'token'.
        try:
            verify_jwt_in_request()
        except Exception:
            # Look for token in form data or query string
            token = (
                request.form.get("access_token")
                or request.form.get("token")
                or request.args.get("access_token")
                or request.args.get("token")
            )
            if token:
                # Inject Authorization header into the WSGI environ so JWT lib can find it
                request.environ["HTTP_AUTHORIZATION"] = f"Bearer {token}"
                try:
                    verify_jwt_in_request()
                except Exception as e:
                    return jsonify(
                        {"success": False, "message": f"Invalid token: {str(e)}"}
                    ), 401
            else:
                return jsonify(
                    {"success": False, "message": "Authorization token is required"}
                ), 401

        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Check if files were uploaded
        if "faces" not in request.files:
            return jsonify({"success": False, "message": "No files provided"}), 400

        files = request.files.getlist("faces")

        # Validate number of files (3-5 recommended)
        if len(files) < 1:
            return jsonify(
                {"success": False, "message": "At least one face image is required"}
            ), 400

        if len(files) > 10:
            return jsonify(
                {"success": False, "message": "Maximum 10 face images allowed"}
            ), 400

        face_service = get_face_service()
        storage_service = get_storage_service()

        uploaded_faces = []
        errors = []

        for idx, file in enumerate(files):
            try:
                if not file.filename:
                    continue

                # Check file type
                if not storage_service.allowed_file(file.filename):
                    errors.append(f"File {file.filename}: Invalid file type")
                    continue

                # Save file temporarily to process
                temp_path = storage_service.save_face_image(file, user.id)
                full_path = storage_service.get_full_path(temp_path)

                # Extract face embedding
                embeddings = face_service.extract_face_embedding(full_path)

                if not embeddings:
                    errors.append(f"File {file.filename}: No face detected")
                    storage_service.delete_file(temp_path)
                    continue

                # Use the first detected face embedding
                embedding_data = embeddings[0]

                # Check if this should be primary (first face or user choice)
                is_primary = request.form.get("is_primary", "false").lower() == "true"
                if idx == 0 and user.face_embeddings.count() == 0:
                    is_primary = True

                # If setting as primary, unset others
                if is_primary:
                    FaceEmbedding.query.filter_by(user_id=user.id).update(
                        {"is_primary": False}
                    )

                # Save face embedding to database
                face_embedding = FaceEmbedding(
                    user_id=user.id,
                    embedding=embedding_data["embedding"],
                    image_path=temp_path,
                    is_primary=is_primary,
                )

                db.session.add(face_embedding)

                uploaded_faces.append(
                    {
                        "image_path": temp_path,
                        "is_primary": is_primary,
                        "confidence": embedding_data.get("confidence", 1.0),
                    }
                )

            except Exception as e:
                errors.append(f"File {file.filename}: {str(e)}")

        if uploaded_faces:
            db.session.commit()

        return jsonify(
            {
                "success": len(errors) == 0 or len(uploaded_faces) > 0,
                "message": f"Successfully uploaded {len(uploaded_faces)} face(s)",
                "data": {
                    "uploaded_faces": uploaded_faces,
                    "total_faces": user.face_embeddings.count(),
                    "errors": errors,
                },
            }
        ), 200 if uploaded_faces else 400

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Face upload failed: {str(e)}"}
        ), 500


@photos_bp.route("/my-faces", methods=["GET"])
@jwt_required()
def get_my_faces():
    """Get all face embeddings for current user"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        faces = user.face_embeddings.all()

        return jsonify(
            {"success": True, "data": [face.to_dict() for face in faces]}
        ), 200

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Failed to get faces: {str(e)}"}
        ), 500


@photos_bp.route("/delete-face/<int:face_id>", methods=["DELETE"])
@jwt_required()
def delete_face(face_id):
    """Delete a face embedding"""
    try:
        current_user_id = int(get_jwt_identity())

        face = FaceEmbedding.query.filter_by(
            id=face_id, user_id=current_user_id
        ).first()

        if not face:
            return jsonify({"success": False, "message": "Face not found"}), 404

        # Delete file
        storage_service = get_storage_service()
        storage_service.delete_file(face.image_path)

        # Delete from database
        db.session.delete(face)
        db.session.commit()

        return jsonify({"success": True, "message": "Face deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to delete face: {str(e)}"}
        ), 500


@photos_bp.route("/events", methods=["GET"])
@jwt_required()
def get_events():
    """Get all active events"""
    try:
        page = request.args.get("page", 1, type=int)
        per_page = current_app.config.get("EVENTS_PER_PAGE", 10)

        events = (
            Event.query.filter_by(is_active=True)
            .order_by(Event.event_date.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
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
        return jsonify(
            {"success": False, "message": f"Failed to get events: {str(e)}"}
        ), 500


@photos_bp.route("/match", methods=["POST"])
@jwt_required()
def match_faces():
    """Find photos containing the user's face in a specific event"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Check if user has face embeddings
        if user.face_embeddings.count() == 0:
            return jsonify(
                {"success": False, "message": "Please register your face first"}
            ), 400

        data = request.get_json()
        event_id = data.get("event_id")

        if not event_id:
            return jsonify({"success": False, "message": "Event ID is required"}), 400

        # Verify event exists
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"success": False, "message": "Event not found"}), 404

        # Get user's primary face embedding or first available
        primary_face = user.face_embeddings.filter_by(is_primary=True).first()
        if not primary_face:
            primary_face = user.face_embeddings.first()

        user_embedding = primary_face.get_embedding_array()

        # Get all photos from the event
        photos = Photo.query.filter_by(event_id=event_id).all()

        if not photos:
            return jsonify(
                {
                    "success": True,
                    "message": "No photos found in this event",
                    "data": {"matches": [], "total_photos": 0, "matched_photos": 0},
                }
            ), 200

        # Prepare photo embeddings for matching
        photo_embeddings_list = []
        for photo in photos:
            if photo.face_embeddings:
                photo_embeddings_list.append(
                    {"photo_id": photo.id, "embeddings": photo.get_face_embeddings()}
                )

        if not photo_embeddings_list:
            return jsonify(
                {
                    "success": True,
                    "message": "No faces detected in event photos yet",
                    "data": {
                        "matches": [],
                        "total_photos": len(photos),
                        "matched_photos": 0,
                    },
                }
            ), 200

        # Find matching faces
        face_service = get_face_service()
        matches = face_service.find_matching_faces(
            user_embedding, photo_embeddings_list
        )

        # Get full photo data for matches
        matched_photos = []
        for match in matches:
            photo = Photo.query.get(match["photo_id"])
            if photo:
                photo_dict = photo.to_dict()
                photo_dict["match_confidence"] = round(match["confidence"] * 100, 2)
                photo_dict["matched_face_index"] = match["matched_face_index"]
                matched_photos.append(photo_dict)

        # Register user to event if not already
        existing_registration = UserEvent.query.filter_by(
            user_id=current_user_id, event_id=event_id
        ).first()

        if not existing_registration:
            user_event = UserEvent(user_id=current_user_id, event_id=event_id)
            db.session.add(user_event)
            db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": f"Found {len(matched_photos)} matching photos",
                "data": {
                    "matches": matched_photos,
                    "total_photos": len(photos),
                    "matched_photos": len(matched_photos),
                    "event": event.to_dict(),
                },
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Face matching failed: {str(e)}"}
        ), 500


@photos_bp.route("/event/<int:event_id>", methods=["GET"])
@jwt_required()
def get_event_photos(event_id):
    """Get all photos for an event with optional filters"""
    try:
        page = request.args.get("page", 1, type=int)
        per_page = current_app.config.get("PHOTOS_PER_PAGE", 20)

        # Filters
        camera_model = request.args.get("camera_model")
        min_quality = request.args.get("min_quality", type=float)
        photo_type = request.args.get("photo_type")
        date_from = request.args.get("date_from")
        date_to = request.args.get("date_to")

        # Build query
        query = Photo.query.filter_by(event_id=event_id)

        if camera_model:
            query = query.filter(Photo.camera_model.ilike(f"%{camera_model}%"))

        if min_quality:
            query = query.filter(Photo.overall_quality_score >= min_quality)

        if photo_type:
            query = query.filter_by(photo_type=photo_type)

        if date_from:
            try:
                from_date = datetime.fromisoformat(date_from)
                query = query.filter(Photo.capture_date >= from_date)
            except:
                pass

        if date_to:
            try:
                to_date = datetime.fromisoformat(date_to)
                query = query.filter(Photo.capture_date <= to_date)
            except:
                pass

        # Order by quality score descending
        photos = query.order_by(
            Photo.overall_quality_score.desc().nullslast()
        ).paginate(page=page, per_page=per_page, error_out=False)

        return jsonify(
            {
                "success": True,
                "data": {
                    "photos": [photo.to_dict() for photo in photos.items],
                    "total": photos.total,
                    "pages": photos.pages,
                    "current_page": page,
                },
            }
        ), 200

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Failed to get photos: {str(e)}"}
        ), 500


@photos_bp.route("/download/<int:photo_id>", methods=["GET"])
@jwt_required()
def download_photo(photo_id):
    """Download a specific photo"""
    try:
        photo = Photo.query.get(photo_id)

        if not photo:
            return jsonify({"success": False, "message": "Photo not found"}), 404

        storage_service = get_storage_service()
        file_path = storage_service.get_full_path(photo.file_path)

        if not os.path.exists(file_path):
            return jsonify({"success": False, "message": "Photo file not found"}), 404

        return send_file(
            file_path,
            mimetype=photo.mime_type or "image/jpeg",
            as_attachment=True,
            download_name=photo.file_name,
        )

    except Exception as e:
        return jsonify({"success": False, "message": f"Download failed: {str(e)}"}), 500
