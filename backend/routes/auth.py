from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from models import db, User
from app import jwt
import bcrypt
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

# Blacklist for revoked tokens (in production, use Redis)
blacklist = set()


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["email", "password", "first_name", "last_name"]
        for field in required_fields:
            if not data.get(field):
                return jsonify(
                    {"success": False, "message": f"{field} is required"}
                ), 400

        # Check if email already exists
        if User.query.filter_by(email=data["email"].lower()).first():
            return jsonify(
                {"success": False, "message": "Email already registered"}
            ), 409

        # Validate password length
        if len(data["password"]) < 6:
            return jsonify(
                {
                    "success": False,
                    "message": "Password must be at least 6 characters long",
                }
            ), 400

        # Hash password
        password_hash = bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt(rounds=10)
        ).decode("utf-8")

        # Create new user
        new_user = User(
            email=data["email"].lower().strip(),
            password_hash=password_hash,
            first_name=data["first_name"].strip(),
            last_name=data["last_name"].strip(),
            role="user",
        )

        db.session.add(new_user)
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=new_user.id)
        refresh_token = create_refresh_token(identity=new_user.id)

        return jsonify(
            {
                "success": True,
                "message": "User registered successfully",
                "data": {
                    "user": new_user.to_dict(),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                },
            }
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Registration failed: {str(e)}"}
        ), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """User login"""
    try:
        data = request.get_json()

        # Validate input
        if not data.get("email") or not data.get("password"):
            return jsonify(
                {"success": False, "message": "Email and password are required"}
            ), 400

        # Find user
        user = User.query.filter_by(email=data["email"].lower()).first()

        if not user:
            return jsonify(
                {"success": False, "message": "Invalid email or password"}
            ), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({"success": False, "message": "Account is deactivated"}), 403

        # Verify password
        if not bcrypt.checkpw(
            data["password"].encode("utf-8"), user.password_hash.encode("utf-8")
        ):
            return jsonify(
                {"success": False, "message": "Invalid email or password"}
            ), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify(
            {
                "success": True,
                "message": "Login successful",
                "data": {
                    "user": user.to_dict(),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()

        # Check if user still exists and is active
        user = User.query.get(current_user_id)
        if not user or not user.is_active:
            return jsonify(
                {"success": False, "message": "User not found or inactive"}
            ), 401

        # Create new access token
        new_access_token = create_access_token(identity=current_user_id)

        return jsonify(
            {
                "success": True,
                "message": "Token refreshed",
                "data": {"access_token": new_access_token},
            }
        ), 200

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Token refresh failed: {str(e)}"}
        ), 500


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Get face embeddings count
        face_count = user.face_embeddings.count()

        profile = user.to_dict()
        profile["face_embeddings_count"] = face_count

        return jsonify({"success": True, "data": profile}), 200

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Failed to get profile: {str(e)}"}
        ), 500


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json()

        # Update allowed fields
        if "first_name" in data:
            user.first_name = data["first_name"].strip()
        if "last_name" in data:
            user.last_name = data["last_name"].strip()

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Profile updated successfully",
                "data": user.to_dict(),
            }
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to update profile: {str(e)}"}
        ), 500


@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json()

        # Validate required fields
        if not data.get("current_password") or not data.get("new_password"):
            return jsonify(
                {
                    "success": False,
                    "message": "Current password and new password are required",
                }
            ), 400

        # Verify current password
        if not bcrypt.checkpw(
            data["current_password"].encode("utf-8"), user.password_hash.encode("utf-8")
        ):
            return jsonify(
                {"success": False, "message": "Current password is incorrect"}
            ), 401

        # Validate new password length
        if len(data["new_password"]) < 6:
            return jsonify(
                {
                    "success": False,
                    "message": "New password must be at least 6 characters long",
                }
            ), 400

        # Hash and save new password
        new_password_hash = bcrypt.hashpw(
            data["new_password"].encode("utf-8"), bcrypt.gensalt(rounds=10)
        ).decode("utf-8")

        user.password_hash = new_password_hash
        db.session.commit()

        return jsonify(
            {"success": True, "message": "Password changed successfully"}
        ), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": f"Failed to change password: {str(e)}"}
        ), 500


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logout user (revoke token)"""
    try:
        jti = get_jwt()["jti"]
        blacklist.add(jti)

        return jsonify({"success": True, "message": "Logged out successfully"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Logout failed: {str(e)}"}), 500


# Token blacklist check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in blacklist
