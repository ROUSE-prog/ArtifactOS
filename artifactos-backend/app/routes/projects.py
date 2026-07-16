from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Project

projects_bp = Blueprint("projects", __name__)


def current_user_id():
    return int(get_jwt_identity())


def owned_project(project_id):
    return db.session.execute(
        db.select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user_id(),
        )
    ).scalar_one_or_none()


@projects_bp.get("")
@jwt_required()
def index():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 6, type=int)
    per_page = max(1, min(per_page, 50))

    pagination = db.paginate(
        db.select(Project)
        .where(Project.user_id == current_user_id())
        .order_by(Project.updated_at.desc()),
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "projects": [project.to_dict() for project in pagination.items],
        "pagination": {
            "page": pagination.page,
            "pages": pagination.pages,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        },
    })


@projects_bp.get("/<int:project_id>")
@jwt_required()
def show(project_id):
    project = owned_project(project_id)

    if project is None:
        return jsonify({"error": "Project not found."}), 404

    return jsonify({
        "project": project.to_dict(include_artifacts=True)
    })


@projects_bp.post("")
@jwt_required()
def create():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title", "")).strip()

    if not title:
        return jsonify({"error": "Title is required."}), 422

    project = Project(
        title=title,
        description=data.get("description"),
        user_id=current_user_id(),
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({"project": project.to_dict()}), 201


@projects_bp.patch("/<int:project_id>")
@jwt_required()
def update(project_id):
    project = owned_project(project_id)

    if project is None:
        return jsonify({"error": "Project not found."}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        title = str(data["title"]).strip()
        if not title:
            return jsonify({"error": "Title cannot be blank."}), 422
        project.title = title

    if "description" in data:
        project.description = data["description"]

    db.session.commit()
    return jsonify({"project": project.to_dict()})


@projects_bp.delete("/<int:project_id>")
@jwt_required()
def destroy(project_id):
    project = owned_project(project_id)

    if project is None:
        return jsonify({"error": "Project not found."}), 404

    db.session.delete(project)
    db.session.commit()
    return "", 204
