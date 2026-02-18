import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config
from models import db
from utils.storage import init_storage_service

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

try:
    from flask_migrate import Migrate

    migrate = Migrate()
except ImportError:
    Migrate = None
    migrate = None

jwt = JWTManager()


def create_app(config_name="default"):
    app = Flask(__name__, static_folder="static", template_folder="templates")

    # Load configuration
    app.config.from_object(config[config_name])

    # Ensure upload directories exist
    upload_dirs = [
        app.config["UPLOAD_FOLDER"],
        app.config["FACES_FOLDER"],
        app.config["EVENTS_FOLDER"],
        app.config["ANNOTATED_FOLDER"],
    ]
    for directory in upload_dirs:
        os.makedirs(directory, exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Initialize storage service singleton so get_storage_service() can be used safely.
    # If initialization fails, log the error but continue so the app can start for debugging.
    try:
        init_storage_service(app.config)
    except Exception as e:
        app.logger.error(f"Failed to initialize storage service: {e}")

    # Initialize migration if flask_migrate is available
    if migrate is not None:
        migrate.init_app(app, db)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"success": False, "message": "Token has expired"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        app.logger.error(f"JWT Invalid token error: {error}")
        return {"success": False, "message": f"Invalid token: {error}"}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"success": False, "message": "Authorization token is required"}, 401

    # Disable caching for static files
    @app.after_request
    def add_no_cache_headers(response):
        if response.content_type and (
            "css" in response.content_type or "javascript" in response.content_type
        ):
            response.headers["Cache-Control"] = (
                "no-cache, no-store, must-revalidate, public, max-age=0"
            )
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

    # Register blueprints
    from routes.auth import auth_bp
    from routes.photos import photos_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(photos_bp, url_prefix="/api/photos")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {"success": False, "message": "Resource not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {"success": False, "message": "Internal server error"}, 500

    # Health check endpoint
    @app.route("/api/health")
    def health_check():
        return {"success": True, "message": "Server is running"}, 200

    return app


if __name__ == "__main__":
    app = create_app("development")
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001, debug=True)
