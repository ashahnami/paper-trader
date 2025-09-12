"""Watchlist-related routes."""

from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user

from app.models.stock import Stock
from app.models.user import WatchlistItem
from app.extensions import db

bp = Blueprint('watchlist', __name__, url_prefix='/watchlist')


@bp.route("/", methods=["GET"])
@login_required
def get_watchlist():
    """Gets a user's watchlist."""
    watchlist = []
    for watchlistItem in current_user.watchlist:
        symbol = Stock.query.filter_by(id=watchlistItem.stockId).first()
        watchlist.append({'symbol': symbol.ticker})
    return jsonify({'watchlist': watchlist}), 200


@bp.route("/<int:stock_id>", methods=["GET"])
@login_required
def check_in_watchlist(stock_id):
    """Checks whether a stock is in the user's watchlist."""
    watchlist_item = WatchlistItem.query.filter_by(stockId=stock_id, user_id=current_user.id).first()
    if watchlist_item:
        return jsonify({"inWatchlist": True}), 200
    return jsonify({"inWatchlist": False}), 200


@bp.route("/<int:stock_id>", methods=["POST"])
@login_required
def add_to_watchlist(stock_id):
    """Adds a stock to the user's watchlist."""
    stock = Stock.query.filter_by(id=stock_id).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = WatchlistItem.query.filter_by(stockId=stock.id, user_id=current_user.id).first()
    if watchlist_item:
        return jsonify({"error": "Stock already exists in watchlist"})

    new_watchlist_item = WatchlistItem(stockId=stock.id, user_id=current_user.id)
    db.session.add(new_watchlist_item)
    db.session.commit()

    return jsonify({"message": 'Successfully added to watchlist'}), 200


@bp.route("/<int:stock_id>", methods=["DELETE"])
@login_required
def remove_from_watchlist(stock_id):
    """Remove a stock from the user's watchlist."""
    stock = Stock.query.filter_by(id=stock_id).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    watchlist_item = WatchlistItem.query.filter_by(stockId=stock.id, user_id=current_user.id).first()
    if watchlist_item is None:
        return jsonify({"error": "Stock not found in watchlist"}), 404

    db.session.delete(watchlist_item)
    db.session.commit()

    return jsonify({'message': 'Successfully removed from watchlist'}), 200
