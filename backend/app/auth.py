from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user

from app.extensions import db, login_manager
from app.models.user import User

bp = Blueprint('auth', __name__, url_prefix='/auth')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@bp.route('/checklogin', methods=['GET'])
def is_logged_in():
    if not current_user.id:
        return jsonify({"logged_in": False}), 200
    return jsonify({"logged_in": True}), 200


@bp.route("/@me")
@login_required
def get_user():
    return jsonify({
        "username": current_user.username,
        "email": current_user.email,
        "balance": current_user.balance
    }), 200


@bp.route("/register", methods=["POST"])
def register():
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
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect login details"}), 401

    login_user(user)

    return jsonify({
        "id": user.id,
        "username": user.username,
    }), 200


@bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Successfully logged out'}), 200
