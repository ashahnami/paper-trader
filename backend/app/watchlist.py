from flask import Blueprint, jsonify, session, request

from app.models.stock import Stock
from app.models.user import User, WatchlistItem
from app.extensions import db

bp = Blueprint('watchlist', __name__, url_prefix='/watchlist')


@bp.route("/", methods=["GET"])
def get_watchlist():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    return "watchlist: okay"

    # if user is None:
    #     return jsonify({"error": "Unauthorised"}), 401

    # return jsonify({'watchlist': user.watchlist}), 200


@bp.route("/add", methods=["POST"])
def add_to_watchlist():
    ticker = request.json["ticker"]

    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = WatchlistItem.query.filter_by(stockId=stock.id).first()
    if watchlist_item:
        return jsonify({"error": "Stock already exists in watchlist"})

    new_watchlist_item = WatchlistItem(stockId=stock.id, user_id=user_id)
    db.session.add(new_watchlist_item)
    db.session.commit()

    return jsonify({"message": 'Successfully added to watchlist'}), 200


@bp.route("/remove", methods=["DELETE"])
def remove_from_watchlist():
    ticker = request.json["ticker"]

    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = WatchlistItem.query.filter_by(stockId=stock.id).first()
    db.session.delete(watchlist_item)
    db.session.commit()

    return jsonify({'message': 'Successfully removed from watchlist'}), 200
