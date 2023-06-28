from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User, Transaction, Stock, PortfolioItem, WatchlistItem
from config import AppConfig
import yfinance as yf

app = Flask(__name__)
app.config.from_object(AppConfig)
CORS(app, supports_credentials=True, resources={r'/*': {"origins": 'http://localhost:3000/*'}})

bcrypt = Bcrypt(app)
Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/checklogin")
def is_logged_in():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"logged_in": False})
    return jsonify({"logged_in": True})
    
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
    
    stock = Stock.query.filter_by(ticker=ticker).first()

    new_transaction = Transaction(stock_id=stock.id, price=price, shares=quantity, user_id=user_id)
    db.session.add(new_transaction)

    user.balance = balance-(price*quantity)

    portfolioItem = PortfolioItem.query.filter_by(stockId=stock.id).first()
    if(portfolioItem):
        portfolioItem.averagePrice = (portfolioItem.averagePrice*portfolioItem.quantity + price*quantity) / (portfolioItem.quantity+quantity)
        portfolioItem.quantity += quantity
    else:
        newPortfolioItem = PortfolioItem(quantity=quantity, averagePrice=price, stockId=stock.id, user_id=user_id)
        db.session.add(newPortfolioItem)
    
    db.session.commit()
    return "200"

@app.route("/closeposition/<ticker>", methods=["POST"])
def close_position(ticker):
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"error": "Unauthorised not logged in"})

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"})

    position = PortfolioItem.query.filter_by(user_id=user_id, stockId=stock.id).first()
    if position is None:
        return jsonify({"error": "User does not hold this stock"})

    stock = yf.Ticker(stock.ticker)
    price = position.quantity * stock.info['currentPrice']
    user.balance += price

    db.session.delete(position)
    db.session.commit()
    return "200"
    

@app.route("/transactions/<ticker>", methods=["GET"])
def get_transactions(ticker):
    user_id = session.get("user_id")

    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"error": "Unauthorised"})

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"})
    
    transactions = []

    purchases = Transaction.query.filter_by(user_id=user_id, stock_id=stock.id).order_by(Transaction.id.desc()).limit(9).all()

    for purchase in purchases:
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

@app.route("/balance", methods=["GET"])
def get_balance():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    return jsonify({
        "balance": user.balance
    })

@app.route("/watchlist", methods=["GET"])
def get_watchlist():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    watchlist = []
    watchlistRows = WatchlistItem.query.filter_by(user_id=user_id)

    for w in watchlistRows:
        stock = Stock.query.filter_by(id=w.stockId).first()
        watchlist.append({
            "stockSymbol": stock.ticker
        })
    
    return watchlist

@app.route("/addwatchlist", methods=["POST"])
def add_to_watchlist():
    ticker = request.json["ticker"]

    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"})

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return  jsonify({"error": "Stock not found"})

    watchlistItem = WatchlistItem.query.filter_by(stockId=stock.id).first()
    if watchlistItem:
        return jsonify({"error": "Stock already exists in watchlist"})

    new_watchlist_item = WatchlistItem(stockId=stock.id, user_id=user_id)
    db.session.add(new_watchlist_item)
    db.session.commit()

    return "200"
    
@app.route("/removewatchlist", methods=["POST"])
def remove_from_watchlist():
    ticker = request.json["ticker"]

    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": "Unauthorised"})

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock is None:
        return jsonify({"error": "Stock not found"})
    
    watchlistItem = WatchlistItem.query.filter_by(stockId=stock.id)
    db.session.delete(watchlistItem)
    db.session.commit()

    return "200"

if __name__ == "__main__":
    app.run(debug=True)
    