from flask import Blueprint, jsonify
from flask_login import login_required, current_user

bp = Blueprint('users', __name__, url_prefix='/users')


@bp.route("/balance", methods=["GET"])
@login_required
def get_balance():
    return jsonify({
        "balance": current_user.balance
    }), 200
