from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

stock_portfolio = db.Table("stock_portfolio",
    db.Column("stock_id", db.Integer, db.ForeignKey("Stocks.id")),
    db.Column("portfolio_id", db.Integer, db.ForeignKey("Portfolios.id"))
)

class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    balance = db.Column(db.Float, default=10000.00, nullable=False)
    transactions = db.relationship("Transaction", backref="user")
    portfolio_item = db.relationship("PortfolioItem", backref="user")

class Transaction(db.Model):
    __tablename__ = "Transactions"
    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey("Stocks.id"))
    price = db.Column(db.Float, nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"))

class Stock(db.Model):
    __tablename__ = "Stocks"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(128), index=True, nullable=False)
    name = db.Column(db.String(128), index=True, nullable=False)
    market = db.Column(db.String(128), nullable=False)
    exchange_id = db.Column(db.Integer, db.ForeignKey("Exchanges.id"))
    portfolios = db.relationship("PortfolioItem", secondary=stock_portfolio, backref="stocks")
    transactions = db.relationship("Transaction", backref="stock")

class Exchange(db.Model):
    __tablename__ = "Exchanges"
    id = db.Column(db.Integer, primary_key=True)
    abbrev = db.Column(db.String(32), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    city = db.Column(db.String(128), nullable=True)
    country = db.Column(db.String(128), nullable=True)
    stocks = db.relationship("Stock", backref="exchange")

class PortfolioItem(db.Model):
    __tablename__ = "Portfolios"
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    averagePrice = db.Column(db.Float, nullable=False)
    stockId = db.Column(db.Integer, index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"))