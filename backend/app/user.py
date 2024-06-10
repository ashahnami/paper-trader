from flask import Blueprint, jsonify, session, request
import yfinance as yf

from app.models.stock import Stock, Position
from app.models.user import User, Transaction, WatchlistItem
from app.extensions import db

bp = Blueprint('users', __name__, url_prefix='/users')


@bp.route("/closeposition/<ticker>", methods=["POST"])
def close_position(ticker):
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"error": "Unauthorised not logged in"}), 401

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    position = Position.query.filter_by(user_id=user_id, stockId=stock.id).first()
    if position is None:
        return jsonify({"error": "User does not hold this stock"}), 401

    stock = yf.Ticker(stock.ticker)
    price = position.quantity * stock.info['currentPrice']
    user.balance += price

    db.session.delete(position)
    db.session.commit()
    return jsonify({'message': 'Successfully closed position'}), 200


@bp.route("/transactions/<ticker>", methods=["GET"])
def get_transactions(ticker):
    user_id = session.get("user_id")

    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"error": "Unauthorised"})

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"})

    transactions = []

    purchases = user.transactions.order_by(Transaction.id.desc()).limit(9).all()

    for purchase in purchases:
        transactions.append({
            "symbol": stock.ticker,
            "name": stock.name,
            "price": purchase.price,
            "shares": purchase.shares
        })

    return jsonify({'transactions': transactions}), 200


@bp.route("/positions", methods=["GET"])
def get_positions():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    return jsonify({'positions': user.positions}), 200


@bp.route("/balance", methods=["GET"])
def get_balance():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    return jsonify({
        "balance": user.balance
    }), 200


@bp.route("/watchlist", methods=["GET"])
def get_watchlist():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401

    return jsonify({'watchlist': user.watchlist}), 200


@bp.route("/addwatchlist", methods=["POST"])
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


@bp.route("/removewatchlist", methods=["POST"])
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
