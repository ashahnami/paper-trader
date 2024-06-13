from flask import Blueprint, jsonify, session, request

from app.models.stock import Stock, Position
from app.models.user import User, Transaction, WatchlistItem
from app.extensions import db

bp = Blueprint('users', __name__, url_prefix='/users')


@bp.route("/balance", methods=["GET"])
def get_balance():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    return jsonify({
        "balance": user.balance
    }), 200
