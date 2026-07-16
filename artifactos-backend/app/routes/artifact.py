from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Artifact, Project

artifacts_bp = Blueprint("artifacts", __name__)


def get_owned_artifact(artifact_id, user_id):
    return db.session.execute(
        db.select(Artifact)
        .join(Project)
        .where(
            Artifact.id == artifact_id,
            Project.user_id == user_id,
        )
    ).scalar_one_or_none()


@artifacts_bp.get("")
@jwt_required()
def index():
    user_id = int(get_jwt_identity())

    artifacts = db.session.execute(
        db.select(Artifact)
        .join(Project)
        .where(Project.user_id == user_id)
        .order_by(Artifact.created_at.desc())
    ).scalars().all()

    return jsonify({
        "artifacts": [artifact.to_dict() for artifact in artifacts]
    })


@artifacts_bp.get("/<int:artifact_id>")
@jwt_required()
def show(artifact_id):
    user_id = int(get_jwt_identity())
    artifact = get_owned_artifact(artifact_id, user_id)

    if artifact is None:
        return jsonify({"error": "Artifact not found"}), 404

    return jsonify({"artifact": artifact.to_dict()})


@artifacts_bp.post("")
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    title = str(data.get("title", "")).strip()
    artifact_type = str(data.get("artifact_type", "")).strip()
    project_id = data.get("project_id")

    if not title or not artifact_type or not project_id:
        return jsonify({
            "error": "title, artifact_type, and project_id are required"
        }), 422

    project = db.session.execute(
        db.select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id,
        )
    ).scalar_one_or_none()

    if project is None:
        return jsonify({"error": "Project not found"}), 404

    artifact = Artifact(
        title=title,
        description=data.get("description"),
        artifact_type=artifact_type,
        filename=data.get("filename"),
        file_url=data.get("file_url"),
        text_content=data.get("text_content"),
        project_id=project.id,
    )

    db.session.add(artifact)
    db.session.commit()

    return jsonify({"artifact": artifact.to_dict()}), 201


@artifacts_bp.patch("/<int:artifact_id>")
@jwt_required()
def update(artifact_id):
    user_id = int(get_jwt_identity())
    artifact = get_owned_artifact(artifact_id, user_id)

    if artifact is None:
        return jsonify({"error": "Artifact not found"}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        title = str(data["title"]).strip()
        if not title:
            return jsonify({"error": "Title cannot be blank"}), 422
        artifact.title = title

    if "description" in data:
        artifact.description = data["description"]

    if "artifact_type" in data:
        artifact_type = str(data["artifact_type"]).strip()
        if not artifact_type:
            return jsonify({"error": "Artifact type cannot be blank"}), 422
        artifact.artifact_type = artifact_type

    if "filename" in data:
        artifact.filename = data["filename"]

    if "file_url" in data:
        artifact.file_url = data["file_url"]

    if "text_content" in data:
        artifact.text_content = data["text_content"]

    db.session.commit()

    return jsonify({"artifact": artifact.to_dict()})


@artifacts_bp.delete("/<int:artifact_id>")
@jwt_required()
def destroy(artifact_id):
    user_id = int(get_jwt_identity())
    artifact = get_owned_artifact(artifact_id, user_id)

    if artifact is None:
        return jsonify({"error": "Artifact not found"}), 404

    db.session.delete(artifact)
    db.session.commit()

    return "", 204