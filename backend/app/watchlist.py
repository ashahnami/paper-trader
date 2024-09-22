from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user

from app.models.stock import Stock
from app.models.user import WatchlistItem
from app.extensions import db

bp = Blueprint('watchlist', __name__, url_prefix='/watchlist')


@bp.route("/", methods=["GET"])
@login_required
def get_watchlist():
    return jsonify({'watchlist': current_user.watchlist}), 200


@bp.route("/add", methods=["POST"])
@login_required
def add_to_watchlist():
    ticker = request.json["ticker"]

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = WatchlistItem.query.filter_by(stockId=stock.id).first()
    if watchlist_item:
        return jsonify({"error": "Stock already exists in watchlist"})

    new_watchlist_item = WatchlistItem(stockId=stock.id, user_id=current_user.id)
    db.session.add(new_watchlist_item)
    db.session.commit()

    return jsonify({"message": 'Successfully added to watchlist'}), 200


@bp.route("/remove", methods=["POST"])
@login_required
def remove_from_watchlist():
    ticker = request.json["ticker"]

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = current_user.watchlist.query.filter_by(stockId=stock.id).first()
    db.session.delete(watchlist_item)
    db.session.commit()

    return jsonify({'message': 'Successfully removed from watchlist'}), 200
