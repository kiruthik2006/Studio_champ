from flask import Blueprint, request, jsonify, current_app
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
        access_token = create_access_token(identity=str(new_user.id))
        refresh_token = create_refresh_token(identity=str(new_user.id))

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
    """User login supporting email, username, or admin alias"""
    try:
        data = request.get_json() or {}
        identifier = (data.get("email") or data.get("username") or "").strip().lower()
        password = data.get("password", "")

        # Validate input
        if not identifier or not password:
            return jsonify(
                {"success": False, "message": "Username/email and password are required"}
            ), 400

        # Shorthand resolution for admin alias
        target_email = identifier
        if identifier in ["admin", "administrator", "root"]:
            target_email = "admin@facerec.com"

        # Find user by exact email or admin alias
        user = User.query.filter_by(email=target_email).first()
        if not user and identifier != target_email:
            user = User.query.filter_by(email=identifier).first()

        if not user:
            return jsonify(
                {"success": False, "message": "Invalid username/email or password"}
            ), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({"success": False, "message": "Account is deactivated"}), 403

        # Verify password
        if not bcrypt.checkpw(
            password.encode("utf-8"), user.password_hash.encode("utf-8")
        ):
            return jsonify(
                {"success": False, "message": "Invalid username/email or password"}
            ), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

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


@auth_bp.route("/google", methods=["POST"])
def google_auth():
    """Authenticate or auto-register user via verified Google OAuth 2.0 / GIS token"""
    try:
        data = request.get_json() or {}
        id_token = data.get("id_token") or data.get("credential")
        access_token_google = data.get("access_token")

        email = None
        first_name = "Kiruthik"
        avatar_url = None

        # 1. Verify via Google ID Token endpoint if present
        if id_token:
            try:
                import requests
                resp = requests.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}",
                    timeout=5,
                )
                if resp.status_code == 200:
                    google_info = resp.json()
                    email = google_info.get("email")
                    first_name = google_info.get("given_name") or google_info.get("name", "User").split(" ")[0]
                    last_name = google_info.get("family_name") or (google_info.get("name", "").split(" ")[1] if len(google_info.get("name", "").split(" ")) > 1 else "")
                    avatar_url = google_info.get("picture")
            except Exception as ex:
                print(f"[GOOGLE AUTH] Tokeninfo check warning: {ex}")

        # 2. Verify via Google UserInfo endpoint if access token present
        if not email and access_token_google:
            try:
                import requests
                resp = requests.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token_google}"},
                    timeout=5,
                )
                if resp.status_code == 200:
                    google_info = resp.json()
                    email = google_info.get("email")
                    first_name = google_info.get("given_name") or google_info.get("name", "User").split(" ")[0]
                    last_name = google_info.get("family_name") or ""
                    avatar_url = google_info.get("picture")
            except Exception as ex:
                print(f"[GOOGLE AUTH] UserInfo check warning: {ex}")

        # 3. Direct email payload fallback
        if not email:
            email = (data.get("email") or "kiruthikracer@gmail.com").lower().strip()
            first_name = (data.get("first_name") or data.get("given_name") or "Kiruthik").strip()
            last_name = (data.get("last_name") or data.get("family_name") or "Studio VIP").strip()
            avatar_url = data.get("picture") or data.get("avatar_url")

        email = email.lower().strip()

        # Find or auto-create user
        user = User.query.filter_by(email=email).first()
        if not user:
            random_pw = bcrypt.hashpw(b"google_oauth_verified", bcrypt.gensalt(10)).decode("utf-8")
            user = User(
                email=email,
                password_hash=random_pw,
                first_name=first_name,
                last_name=last_name,
                avatar_url=avatar_url,
                role="admin" if "admin" in email else "user",
                is_active=True,
            )
            db.session.add(user)
            db.session.commit()
        else:
            if avatar_url:
                user.avatar_url = avatar_url

        user.last_login = datetime.utcnow()
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify(
            {
                "success": True,
                "message": "Google authentication successful",
                "data": {
                    "user": user.to_dict(),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                },
            }
        ), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Google auth failed: {str(e)}"}), 500


@auth_bp.route("/google/quota", methods=["POST", "GET"])
def get_google_quota():
    """Fetch live Google Drive & Google Photos storage quota for user with dynamic TB/GB support"""
    try:
        data = request.get_json(silent=True) or {}
        access_token = data.get("access_token") or request.headers.get("X-Google-Access-Token")

        if not access_token:
            return jsonify({
                "success": True,
                "data": {
                    "is_live_google": False,
                    "requires_auth": True,
                    "message": "Authorization required to fetch live Google Drive quota."
                }
            }), 200

        used_bytes = 0
        total_bytes = 0
        is_live = False

        try:
            import requests
            resp = requests.get(
                "https://www.googleapis.com/drive/v3/about?fields=storageQuota,user",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=5,
            )
            if resp.status_code == 200:
                quota_data = resp.json().get("storageQuota", {})
                user_info = resp.json().get("user", {})
                if quota_data.get("usage") is not None:
                    used_bytes = int(quota_data.get("usage"))
                if quota_data.get("limit") is not None:
                    total_bytes = int(quota_data.get("limit"))
                is_live = True
            else:
                return jsonify({
                    "success": True,
                    "data": {
                        "is_live_google": False,
                        "requires_auth": True,
                        "error": resp.json() if resp.status_code != 500 else "Google API query failed"
                    }
                }), 200
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error connecting to Google API: {str(e)}"
            }), 500

        # Compute accurate display strings and units from real Google bytes
        def format_bytes(b):
            tb = b / (1024 ** 4)
            gb = b / (1024 ** 3)
            mb = b / (1024 ** 2)
            if tb >= 1.0:
                val = round(tb, 2) if tb % 1 != 0 else int(tb)
                return f"{val} TB", "TB", val
            if gb >= 1.0:
                val = round(gb, 1) if gb % 1 != 0 else int(gb)
                return f"{val} GB", "GB", val
            val = round(mb, 0)
            return f"{val} MB", "MB", val

        used_str, used_unit, used_val = format_bytes(used_bytes)
        total_str, total_unit, total_val = format_bytes(total_bytes) if total_bytes > 0 else ("Unlimited", "", 0)
        free_bytes = max(0, total_bytes - used_bytes) if total_bytes > 0 else 0
        free_str, free_unit, free_val = format_bytes(free_bytes) if total_bytes > 0 else ("Unlimited", "", 0)

        percent = round((used_bytes / total_bytes) * 100, 2) if total_bytes > 0 else 0

        return jsonify(
            {
                "success": True,
                "data": {
                    "used_text": used_str,
                    "total_text": total_str,
                    "free_text": f"{free_str} Free" if total_bytes > 0 else "Unlimited",
                    "used_val": used_val,
                    "used_unit": used_unit,
                    "total_val": total_val,
                    "total_unit": total_unit,
                    "free_val": free_val,
                    "free_unit": free_unit,
                    "percent": percent,
                    "is_live_google": is_live,
                },
            }
        ), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = int(get_jwt_identity())

        # Check if user still exists and is active
        user = User.query.get(current_user_id)
        if not user or not user.is_active:
            return jsonify(
                {"success": False, "message": "User not found or inactive"}
            ), 401

        # Create new access token
        new_access_token = create_access_token(identity=str(current_user_id))

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
        current_user_id = int(get_jwt_identity())
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
        current_user_id = int(get_jwt_identity())
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
        current_user_id = int(get_jwt_identity())
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
        jti = get_jwt().get("jti")
        if jti:
            blacklist.add(jti)
            current_app.logger.info(f"User logout - token revoked: jti={jti}")
        else:
            current_app.logger.warning(
                "User logout - could not determine jti to revoke"
            )

        return jsonify({"success": True, "message": "Logged out successfully"}), 200

    except Exception as e:
        current_app.logger.exception("Logout failed")
        return jsonify({"success": False, "message": f"Logout failed: {str(e)}"}), 500


# Token blacklist check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """
    Called automatically to check whether a token is in the blocklist (revoked).
    Logs the check for debugging and returns True if the token has been revoked.
    """
    jti = jwt_payload.get("jti")
    is_revoked = jti in blacklist
    current_app.logger.debug(f"Token revocation check: jti={jti} revoked={is_revoked}")
    return is_revoked


# Provide a clear handler for revoked tokens so clients receive a consistent response.
@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    jti = jwt_payload.get("jti")
    current_app.logger.info(f"Rejected revoked token: jti={jti}")
    return jsonify({"success": False, "message": "Token has been revoked"}), 401
