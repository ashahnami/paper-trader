from app.extensions import db


stock_portfolio = db.Table("stock_portfolio",
    db.Column("stock_id", db.Integer, db.ForeignKey("Stocks.id")),
    db.Column("portfolio_id", db.Integer, db.ForeignKey("Portfolios.id"))
)


class Position(db.Model):
    __tablename__ = "position"
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    averagePrice = db.Column(db.Float, nullable=False)
    stockId = db.Column(db.Integer, index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Stock(db.Model):
    __tablename__ = "stock"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(128), index=True, nullable=False)
    description = db.Column(db.String(128), index=True, nullable=False)
    exchange_id = db.Column(db.Integer, db.ForeignKey("exchange.id"))

    portfolios = db.relationship("Position", secondary=stock_portfolio, backref="stock", lazy=True)
    transactions = db.relationship("Transaction", backref="stock", lazy=True)


class Exchange(db.Model):
    __tablename__ = "exchange"
    id = db.Column(db.Integer, primary_key=True)
    abbrev = db.Column(db.String(32), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    city = db.Column(db.String(128), nullable=True)
    country = db.Column(db.String(128), nullable=True)

    stocks = db.relationship("Stock", backref="exchange", lazy=True)
