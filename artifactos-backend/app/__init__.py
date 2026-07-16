from flask import Flask, jsonify
from .config import Config
from .extensions import bcrypt, cors, db, jwt, migrate
from .routes.artifact import artifacts_bp

def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)
    db.init_app(app); migrate.init_app(app, db); bcrypt.init_app(app); jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})
    from .models import Artifact, Project, Tag, User  # noqa: F401
    from .routes.auth import auth_bp
    from .routes.health import health_bp
    from .routes.projects import projects_bp
    app.register_blueprint(health_bp)
    app.register_blueprint(artifacts_bp,url_prefix="/api/artifacts")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    @app.errorhandler(404)
    def not_found(_): return jsonify({"error":"Resource not found"}),404

    return app

