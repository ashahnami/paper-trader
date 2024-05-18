from flask import Blueprint, jsonify, session, request
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from app.models.user import User

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/checklogin', methods=['GET'])
def is_logged_in():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"logged_in": False}), 200
    return jsonify({"logged_in": True}), 200


@bp.route("/@me")
def get_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "username": user.username,
        "email": user.email,
        "balance": user.balance
    }), 200


@bp.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "User already exists"}), 409

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(username=username, email=email, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    }), 200


@bp.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorised"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "username": user.username,
    }), 200


@bp.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({'message': 'Successfully logged out'}), 200
