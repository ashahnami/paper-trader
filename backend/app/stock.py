from flask import Blueprint, jsonify, session, request

from app.extensions import db
from app.models.stock import Stock, Position
from app.models.transaction import Transaction
from app.models.user import User

bp = Blueprint('stocks', __name__, url_prefix='/stocks')


@bp.route("/stock/<ticker>", methods=["GET"])
def get_stock_info(ticker):
    stock = Stock.query.filter_by(ticker=ticker).first()

    if not stock:
        return jsonify({"error": "Stock not found"}), 404

    return jsonify({
        "ticker": ticker,
        "name": stock.name,
        "market": stock.market,
    })


@bp.route("/buy", methods=["POST"])
def buy_stock():
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
