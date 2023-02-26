from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User, Transaction, Stock, PortfolioItem
from config import AppConfig

app = Flask(__name__)
app.config.from_object(AppConfig)
CORS(app, supports_credentials=True, resources={r'/*': {"origins": 'http://localhost:3000/*'}})

bcrypt = Bcrypt(app)
Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route("/@me")
def get_user():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "username": user.username,
        "email": user.email,
        "balance": user.balance
    })
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    email =  request.json["email"]
    password = request.json["password"]
    
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "User already exists"}), 409

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "User already exists"}), 409
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=password_hash)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })
    
@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Unauthorised"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorised"}), 401
    
    session["user_id"] = user.id
    
    return jsonify({
        "id": user.id,
        "username": user.username,
    })
    
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"

@app.route("/stock/<ticker>", methods=["GET"])
def get_stock_info(ticker):
    stock = Stock.query.filter_by(ticker=ticker).first()
    
    if not stock:
        return jsonify({"error": "Stock not found"}), 404
    
    return jsonify({
        "ticker": ticker,
        "name": stock.name,
        "market": stock.market,
    })
    

@app.route("/buy", methods=["POST"])
def buy_stock():
    ticker = request.json["ticker"]
    price = float(request.json["price"])
    quantity = float(request.json["quantity"])
    
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    
    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    balance = user.balance
    if balance <  (price * quantity):
        return jsonify({"Error": "Insufficient balance"})
    
    # find stock
    stock = Stock.query.filter_by(ticker=ticker).first()

    # add transaction
    new_transaction = Transaction(stock_id=stock.id, price=price, shares=quantity, user_id=user_id)
    db.session.add(new_transaction)

    # update balance
    user.balance = balance-(price*quantity)

    # update portfolio 
    portfolioItem = PortfolioItem.query.filter_by(stockId=stock.id).first()
    if(portfolioItem):
        portfolioItem.averagePrice = (portfolioItem.averagePrice*portfolioItem.quantity + price*quantity) / (portfolioItem.quantity+quantity)
        portfolioItem.quantity += quantity
    else:
        newPortfolioItem = PortfolioItem(quantity=quantity, averagePrice=price, stockId=stock.id, user_id=user_id)
        db.session.add(newPortfolioItem)
    
    db.session.commit()
    return "200"

@app.route("/transactions", methods=["GET"])
def get_transactions():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    transactions = []

    purchases = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.id.desc()).limit(9).all()

    for purchase in purchases:
        stock = Stock.query.filter_by(id=purchase.stock_id).first()
        transactions.append({
            "stockSymbol": stock.ticker,
            "stockName": stock.name,
            "price": purchase.price,
            "shares": purchase.shares
        })
        
    return transactions

@app.route("/positions", methods=["GET"])
def get_positions():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    
    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    positions = []
    positionRows = PortfolioItem.query.filter_by(user_id=user_id)
    
    for p in positionRows:
        stock = Stock.query.filter_by(id=p.stockId).first()
        positions.append({
            "stockSymbol": stock.ticker,
            "shares": p.quantity,
            "averagePrice": p.averagePrice
        })

    return positions

if __name__ == "__main__":
    app.run(debug=True)
    