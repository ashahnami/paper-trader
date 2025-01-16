from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user

from app.models.stock import Stock, Position
from app.models.user import User, Transaction
from app.extensions import db

bp = Blueprint('transactions', __name__, url_prefix='/transactions')


@bp.route("/<int:stock_id>", methods=["POST"])
@login_required
def buy(stock_id):
    quantity = int(request.json.get("quantity"))

    stock = Stock.query.filter_by(id=stock_id).first()
    if stock is None:
        return jsonify({"error": "Stock not found"})

    #  TEMP PRICE
    price = 100

    if current_user.balance < (price * quantity):
        return jsonify({"Error": "Insufficient balance"})

    new_transaction = Transaction(stock_id=stock.id, price=price, shares=quantity, user_id=current_user.id)
    db.session.add(new_transaction)

    current_user.balance -= (price * quantity)

    portfolio_item = Position.query.filter_by(stockId=stock.id).first()
    if portfolio_item:
        portfolio_item.averagePrice = (portfolio_item.averagePrice * portfolio_item.quantity + price * quantity) / (
                portfolio_item.quantity + quantity)
        portfolio_item.quantity += quantity
    else:
        portfolio_item = Position(quantity=quantity, averagePrice=price, stockId=stock.id, user_id=current_user.id)
        db.session.add(portfolio_item)

    db.session.commit()
    return jsonify({'message': 'Successfully purchased'}), 200