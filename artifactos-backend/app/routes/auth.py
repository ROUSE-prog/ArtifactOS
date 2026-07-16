from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models import User
auth_bp=Blueprint("auth",__name__)
@auth_bp.post("/register")
def register():
    data=request.get_json(silent=True) or {}; email=str(data.get("email","")).strip().lower(); password=str(data.get("password",""))
    if "@" not in email or len(password)<8: return jsonify({"error":"Valid email and 8+ character password required."}),422
    user=User(email=email); user.set_password(password); db.session.add(user)
    try: db.session.commit()
    except IntegrityError: db.session.rollback(); return jsonify({"error":"Email already registered."}),409
    return jsonify({"user":user.to_dict(),"access_token":create_access_token(identity=str(user.id))}),201
@auth_bp.post("/login")
def login():
    data=request.get_json(silent=True) or {}; email=str(data.get("email","")).strip().lower(); password=str(data.get("password",""))
    user=db.session.execute(db.select(User).where(User.email==email)).scalar_one_or_none()
    if not user or not user.check_password(password): return jsonify({"error":"Invalid email or password."}),401
    return jsonify({"user":user.to_dict(),"access_token":create_access_token(identity=str(user.id))})
@auth_bp.get("/me")
@jwt_required()
def me():
    user=db.session.get(User,int(get_jwt_identity()))
    return (jsonify({"user":user.to_dict()}),200) if user else (jsonify({"error":"User not found."}),404)
