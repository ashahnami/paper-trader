from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
import yfinance as yf

from app.models.stock import Stock, Position
from app.models.user import Transaction
from app.extensions import db

bp = Blueprint('positions', __name__, url_prefix='/positions')


@bp.route("/", methods=["GET"])
@login_required
def get_positions():
    """Get all positions for the current user."""
    positions = []
    for position in current_user.positions:
        symbol = Stock.query.filter_by(id=position.stockId).first()
        positions.append({
            'id': position.id,
            'symbol': symbol.ticker,
            'quantity': position.quantity,
            'averagePrice': position.averagePrice,
        })
    return jsonify({'positions': positions}), 200


@bp.route("/<int:stock_id>/close", methods=["DELETE"])
@login_required
def close_position(stock_id):
    """Close a position for the current user."""
    stock = Stock.query.filter_by(id=stock_id).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    position = Position.query.filter_by(user_id=current_user.id, stock_id=stock.id).first()
    if position is None:
        return jsonify({"error": "User does not hold this stock"}), 401

    stock = yf.Ticker(stock.ticker)
    price = position.quantity * stock.info['currentPrice']
    current_user.balance += price

    db.session.delete(position)
    db.session.commit()
    return jsonify({'message': 'Successfully closed position'}), 200


@bp.route("/<ticker>/transactions", methods=["GET"])
@login_required
def get_transactions(ticker):
    """Get transactions for a given stock ticker."""
    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"}), 404

    transactions = []
    purchases = current_user.transactions.order_by(Transaction.id.desc()).limit(9).all()

    for purchase in purchases:
        transactions.append({
            "symbol": stock.ticker,
            "name": stock.name,
            "price": purchase.price,
            "shares": purchase.shares
        })

    return jsonify({'transactions': transactions}), 200
