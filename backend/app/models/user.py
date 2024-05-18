from app.extensions import db


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    balance = db.Column(db.Numeric(precision=10, scale=2), default=10000.00, nullable=False)

    transactions = db.relationship("Transaction", backref="user", lazy=True)
    positions = db.relationship("Position", backref="user", lazy=True)
    watchlist = db.relationship("WatchlistItem", backref="user", lazy=True)
