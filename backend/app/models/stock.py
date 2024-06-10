from app.extensions import db
from app.models.user import Position


class Stock(db.Model):
    __tablename__ = "stock"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(128), index=True, nullable=False)
    description = db.Column(db.String(128), index=True, nullable=False)
    exchange_id = db.Column(db.Integer, db.ForeignKey("exchange.id"))


class Exchange(db.Model):
    __tablename__ = "exchange"
    id = db.Column(db.Integer, primary_key=True)
    abbrev = db.Column(db.String(32), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    city = db.Column(db.String(128), nullable=True)
    country = db.Column(db.String(128), nullable=True)

    stocks = db.relationship("Stock", backref="exchange", lazy=True)
