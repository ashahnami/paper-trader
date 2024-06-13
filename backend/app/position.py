from flask import Blueprint, jsonify, session, request
import yfinance as yf

from app.models.stock import Stock, Position
from app.models.user import User, Transaction
from app.extensions import db

bp = Blueprint('positions', __name__, url_prefix='/positions')


@bp.route("/", methods=["GET", "POST"])
def get_positions():
    if request.method == "GET":
        user_id = session.get("user_id")
        user = User.query.filter_by(id=user_id).first()

        if user is None:
            return jsonify({"error": "Unauthorised"}), 401

        return jsonify({'positions': user.positions}), 200
    else:
        ticker = request.json["ticker"]
        price = float(request.json["price"])
        quantity = float(request.json["quantity"])

        user_id = session.get("user_id")
        user = User.query.filter_by(id=user_id).first()

        if user is None:
            return jsonify({"error": "Unauthorised"}), 401

        balance = user.balance
        if balance < (price * quantity):
            return jsonify({"Error": "Insufficient balance"})

        stock = Stock.query.filter_by(ticker=ticker).first()

        new_transaction = Transaction(stock_id=stock.id, price=price, shares=quantity, user_id=user_id)
        db.session.add(new_transaction)

        user.balance = balance - (price * quantity)

        portfolio_item = Position.query.filter_by(stockId=stock.id).first()
        if portfolio_item:
            portfolio_item.averagePrice = (portfolio_item.averagePrice * portfolio_item.quantity + price * quantity) / (
                        portfolio_item.quantity + quantity)
            portfolio_item.quantity += quantity
        else:
            portfolio_item = Position(quantity=quantity, averagePrice=price, stockId=stock.id, user_id=user_id)
            db.session.add(portfolio_item)

        db.session.commit()
        return jsonify({'message': 'Successfully purchased'}), 200

@bp.route("/<ticker>/close", methods=["DELETE"])
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


@bp.route("/<ticker>/transactions", methods=["GET"])
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
