from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
    get_jwt,
)
from models import db, User, FaceEmbedding, Event, Photo, UserEvent, FamilyMember
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
    import traceback

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

        print(f"[UPLOAD-FACES] User {current_user_id} uploading faces")

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

        print(f"[UPLOAD-FACES] Processing {len(files)} files")

        # Get or resolve target Circle Member (defaults to user's 'Me' profile)
        target_member_id = request.form.get("member_id", type=int)
        member = None
        if target_member_id:
            member = FamilyMember.query.filter_by(
                id=target_member_id, user_id=user.id
            ).first()

        if not member:
            member = FamilyMember.query.filter_by(
                user_id=user.id, is_self=True
            ).first()
            if not member:
                member = FamilyMember(
                    user_id=user.id,
                    name=f"{user.first_name} (Me)",
                    relationship="Self",
                    is_self=True,
                )
                db.session.add(member)
                db.session.flush()

        angle_slot = request.form.get("angle_slot", "front")

        uploaded_faces = []
        errors = []

        for idx, file in enumerate(files):
            try:
                if not file.filename:
                    continue

                print(f"[UPLOAD-FACES] Processing file: {file.filename}")

                # Check file type
                if not storage_service.allowed_file(file.filename):
                    errors.append(f"File {file.filename}: Invalid file type")
                    continue

                # Save file temporarily to process
                temp_path = storage_service.save_face_image(file, user.id)
                full_path = storage_service.get_full_path(temp_path)

                print(f"[UPLOAD-FACES] Saved to: {full_path}")

                # Extract face embedding
                embeddings = face_service.extract_face_embedding(full_path)

                if not embeddings:
                    errors.append(f"File {file.filename}: No face detected")
                    storage_service.delete_file(temp_path)
                    continue

                print(f"[UPLOAD-FACES] Extracted {len(embeddings)} embeddings")

                # Use the first detected face embedding
                embedding_data = embeddings[0]

                # Check if this should be primary (first face or user choice)
                is_primary = request.form.get("is_primary", "false").lower() == "true"
                if idx == 0 and member.face_embeddings.count() == 0:
                    is_primary = True

                # If setting as primary, unset others for this member
                if is_primary:
                    FaceEmbedding.query.filter_by(
                        user_id=user.id, member_id=member.id
                    ).update({"is_primary": False})

                # Save face embedding to database with member_id and angle_slot
                face_embedding = FaceEmbedding(
                    user_id=user.id,
                    member_id=member.id,
                    embedding=embedding_data["embedding"],
                    image_path=temp_path,
                    angle_slot=angle_slot,
                    quality_score=round(float(embedding_data.get("confidence", 1.0)), 3),
                    is_primary=is_primary,
                )

                db.session.add(face_embedding)

                # Set member avatar if not already set
                if not member.avatar_path or is_primary:
                    member.avatar_path = temp_path

                uploaded_faces.append(
                    {
                        "image_path": temp_path,
                        "member_id": member.id,
                        "member_name": member.name,
                        "angle_slot": angle_slot,
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
                "message": f"Successfully uploaded {len(uploaded_faces)} face(s) for {member.name}",
                "data": {
                    "uploaded_faces": uploaded_faces,
                    "member": member.to_dict(),
                    "total_faces": user.face_embeddings.count(),
                    "errors": errors,
                },
            }
        ), 200 if uploaded_faces else 400

    except Exception as e:
        import traceback

        db.session.rollback()
        error_details = traceback.format_exc()
        print(f"[UPLOAD-FACES] ERROR: {str(e)}")
        print(f"[UPLOAD-FACES] Traceback: {error_details}")
        return jsonify(
            {
                "success": False,
                "message": f"Face upload failed: {str(e)}",
                "details": str(e),
            }
        ), 500


@photos_bp.route("/my-faces", methods=["GET"])
@jwt_required()
def get_my_faces():
    """Get face embeddings for current user, optionally filtered by member_id"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        member_id = request.args.get("member_id", type=int)
        query = user.face_embeddings

        if member_id:
            query = query.filter_by(member_id=member_id)

        faces = query.order_by(FaceEmbedding.created_at.desc()).all()

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


# =========================================================================
# FAMILY & FRIENDS CIRCLES (MULTI-PERSON BIOMETRICS & MATCHING)
# =========================================================================

@photos_bp.route("/circle/members", methods=["GET"])
@jwt_required()
def get_circle_members():
    """Get all circle members for current user, auto-creating default 'Me' profile if none exist"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Ensure default 'Me' profile exists
        self_member = user.family_members.filter_by(is_self=True).first()
        if not self_member:
            self_member = FamilyMember(
                user_id=user.id,
                name=f"{user.first_name} (Me)",
                relationship="Self",
                is_self=True,
            )
            db.session.add(self_member)
            db.session.commit()

            # Attach any unlinked user face embeddings to 'Me'
            user.face_embeddings.filter(FaceEmbedding.member_id.is_(None)).update(
                {"member_id": self_member.id}
            )
            db.session.commit()

        members = user.family_members.order_by(
            FamilyMember.is_self.desc(), FamilyMember.created_at.asc()
        ).all()

        members_data = []
        for m in members:
            m_dict = m.to_dict()
            m_dict["faces"] = [f.to_dict() for f in m.face_embeddings.all()]
            members_data.append(m_dict)

        return jsonify({"success": True, "data": members_data}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to get circle members: {str(e)}"}
        ), 500


@photos_bp.route("/circle/members", methods=["POST"])
@jwt_required()
def create_circle_member():
    """Create a new circle member profile"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json() or {}
        name = (data.get("name") or "").strip()
        relationship = (data.get("relationship") or "Family").strip()
        notes = (data.get("notes") or "").strip()

        if not name:
            return jsonify({"success": False, "message": "Member name is required"}), 400

        member = FamilyMember(
            user_id=user.id,
            name=name,
            relationship=relationship,
            is_self=False,
            notes=notes if notes else None,
        )
        db.session.add(member)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": f"Added {name} to your circle",
                "data": member.to_dict(),
            }
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to create circle member: {str(e)}"}
        ), 500


@photos_bp.route("/circle/members/<int:member_id>", methods=["PUT"])
@jwt_required()
def update_circle_member(member_id):
    """Update a circle member profile"""
    try:
        current_user_id = int(get_jwt_identity())
        member = FamilyMember.query.filter_by(
            id=member_id, user_id=current_user_id
        ).first()

        if not member:
            return jsonify({"success": False, "message": "Member not found"}), 404

        data = request.get_json() or {}
        if "name" in data and data["name"].strip():
            member.name = data["name"].strip()
        if "relationship" in data:
            member.relationship = data["relationship"].strip()
        if "notes" in data:
            member.notes = data["notes"].strip()

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": f"Updated profile for {member.name}",
                "data": member.to_dict(),
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to update member: {str(e)}"}
        ), 500


@photos_bp.route("/circle/members/<int:member_id>", methods=["DELETE"])
@jwt_required()
def delete_circle_member(member_id):
    """Delete a circle member profile and all associated face embeddings"""
    try:
        current_user_id = int(get_jwt_identity())
        member = FamilyMember.query.filter_by(
            id=member_id, user_id=current_user_id
        ).first()

        if not member:
            return jsonify({"success": False, "message": "Member not found"}), 404

        if member.is_self:
            return jsonify(
                {"success": False, "message": "Cannot delete your primary 'Me' profile"}
            ), 400

        storage_service = get_storage_service()
        # Delete image files
        for face in member.face_embeddings:
            storage_service.delete_file(face.image_path)

        member_name = member.name
        db.session.delete(member)
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": f"Removed {member_name} from your circle",
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to delete member: {str(e)}"}
        ), 500


@photos_bp.route("/circle/match", methods=["POST"])
@jwt_required()
def match_circle_faces():
    """
    Multi-Person Boolean Matching Engine.
    Filters event photos containing combinations of circle members:
    - match_mode: 'ALL' (AND - all selected members together in same photo)
    - match_mode: 'ANY' (OR - any of the selected members)
    - match_mode: 'SOLO' (Only that specific person)
    """
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json() or {}
        event_id = data.get("event_id")
        member_ids = data.get("member_ids") or []
        match_mode = data.get("match_mode", "ANY").upper()  # ALL, ANY, SOLO
        threshold = float(data.get("threshold", 0.50))

        if not event_id:
            return jsonify({"success": False, "message": "Event ID is required"}), 400

        event = Event.query.get(event_id)
        if not event:
            return jsonify({"success": False, "message": "Event not found"}), 404

        # If no specific member_ids passed, default to all members that have embeddings
        if not member_ids:
            members = user.family_members.all()
        else:
            members = user.family_members.filter(FamilyMember.id.in_(member_ids)).all()

        # Build members data with their face embeddings
        members_data = []
        for m in members:
            embs = [f.get_embedding_array() for f in m.face_embeddings.all()]
            if embs:
                members_data.append(
                    {
                        "id": m.id,
                        "name": m.name,
                        "relationship": m.relationship,
                        "is_self": m.is_self,
                        "avatar_path": m.avatar_path,
                        "embeddings": embs,
                    }
                )

        if not members_data:
            return jsonify(
                {
                    "success": False,
                    "message": "Selected circle members do not have registered face photos yet. Please capture face photos for them first.",
                }
            ), 400

        # Get all photos in the event
        photos = Photo.query.filter_by(event_id=event_id).all()
        if not photos:
            return jsonify(
                {
                    "success": True,
                    "message": "No photos found in this event",
                    "data": {
                        "matches": [],
                        "total_photos": 0,
                        "matched_photos": 0,
                        "members": [
                            {"id": m["id"], "name": m["name"], "relationship": m["relationship"]}
                            for m in members_data
                        ],
                    },
                }
            ), 200

        # Prepare photo embeddings list
        photo_embeddings_list = []
        for photo in photos:
            if photo.face_embeddings:
                photo_embeddings_list.append(
                    {
                        "photo_id": photo.id,
                        "embeddings": photo.get_face_embeddings(),
                        "detected_faces": photo.get_detected_faces(),
                    }
                )

        face_service = get_face_service()
        match_results = face_service.find_multi_person_matches(
            members_data=members_data,
            photo_embeddings_list=photo_embeddings_list,
            match_mode=match_mode,
            threshold=threshold,
        )

        # Assemble full photo payloads with detection metadata
        matched_photos = []
        for res in match_results:
            photo = Photo.query.get(res["photo_id"])
            if photo:
                photo_dict = photo.to_dict()
                photo_dict["match_confidence"] = round(res["confidence"] * 100, 2)
                photo_dict["matched_members"] = res["matched_members"]
                photo_dict["matched_member_count"] = res["matched_member_count"]
                photo_dict["total_photo_faces"] = res["total_photo_faces"]
                photo_dict["is_group_portrait"] = res["matched_member_count"] >= 2
                photo_dict["ai_curation_badge"] = (
                    "Best Shot" if (photo.overall_quality_score or 0) >= 0.85
                    else "High Quality" if (photo.overall_quality_score or 0) >= 0.70
                    else "Standard"
                )
                matched_photos.append(photo_dict)

        # Auto-register user to event
        existing_registration = UserEvent.query.filter_by(
            user_id=current_user_id, event_id=event_id
        ).first()
        if not existing_registration:
            db.session.add(UserEvent(user_id=current_user_id, event_id=event_id))
            db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": f"Found {len(matched_photos)} photo(s) matching your circle constraints ({match_mode})",
                "data": {
                    "matches": matched_photos,
                    "total_photos": len(photos),
                    "matched_photos": len(matched_photos),
                    "match_mode": match_mode,
                    "event": event.to_dict(),
                    "queried_members": [
                        {"id": m["id"], "name": m["name"], "relationship": m["relationship"]}
                        for m in members_data
                    ],
                },
            }
        ), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Circle matching failed: {str(e)}"}
        ), 500
