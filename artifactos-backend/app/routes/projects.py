from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..extensions import db
from ..models import Project
projects_bp=Blueprint("projects",__name__)
def uid(): return int(get_jwt_identity())
def owned(pid): return db.session.execute(db.select(Project).where(Project.id==pid,Project.user_id==uid())).scalar_one_or_none()
@projects_bp.get("")
@jwt_required()
def index():
    items=db.session.execute(db.select(Project).where(Project.user_id==uid()).order_by(Project.updated_at.desc())).scalars().all()
    return jsonify({"projects":[p.to_dict() for p in items]})
@projects_bp.post("")
@jwt_required()
def create():
    data=request.get_json(silent=True) or {}; title=str(data.get("title","")).strip()
    if not title: return jsonify({"error":"Title is required."}),422
    p=Project(title=title,description=data.get("description"),user_id=uid()); db.session.add(p); db.session.commit(); return jsonify({"project":p.to_dict()}),201
@projects_bp.get("/<int:pid>")
@jwt_required()
def show(pid):
    p=owned(pid); return jsonify({"project":p.to_dict(include_artifacts=True)}) if p else (jsonify({"error":"Project not found."}),404)
@projects_bp.patch("/<int:pid>")
@jwt_required()
def update(pid):
    p=owned(pid)
    if not p: return jsonify({"error":"Project not found."}),404
    data=request.get_json(silent=True) or {}
    if "title" in data: p.title=str(data["title"]).strip()
    if "description" in data: p.description=data["description"]
    db.session.commit(); return jsonify({"project":p.to_dict()})
@projects_bp.delete("/<int:pid>")
@jwt_required()
def destroy(pid):
    p=owned(pid)
    if not p: return jsonify({"error":"Project not found."}),404
    db.session.delete(p); db.session.commit(); return "",204
