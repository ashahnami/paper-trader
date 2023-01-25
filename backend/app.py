from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User, Transaction
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
        "id": user.id,
        "username": user.username
    })
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]
    
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "User already exists"})
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=password_hash)
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

@app.route("/buy", methods=["POST"])
def buy_stock():
    ticker = request.json["ticker"]
    # stock_name = request.json["stock_name"]
    price = float(request.json["price"])
    quantity = float(request.json["quantity"])
    
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    
    if user is None:
        return jsonify({"error": "Unauthorised"})
    
    balance = user.balance
    if balance <  (price * quantity):
        return jsonify({"Error": "Insufficient balance"})

    # add transaction
    new_transaction = Transaction(stockSymbol=ticker, stockName="test", price=price, shares=quantity, user_id=user_id)
    db.session.add(new_transaction)
    db.session.commit()

    # update balance
    user.balance = balance-(price*quantity)
    db.session.commit()
    
    return "200"


if __name__ == "__main__":
    app.run(debug=True)
    