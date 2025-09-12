"""Database models for user, transaction, position, and watchlist."""

from datetime import datetime, timezone
from app.extensions import db


class User(db.Model):
    """User model."""
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    balance = db.Column(db.Numeric(precision=10, scale=2), default=10000.00, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)

    transactions = db.relationship("Transaction", backref="user", lazy=True)
    positions = db.relationship("Position", backref="user", lazy=True)
    watchlist = db.relationship("WatchlistItem", backref="user", lazy=True)

    def is_authenticated(self):
        """Return True if user is authenticated."""
        return True

    def is_active(self):
        """Return True if user is active."""
        return self.active

    def is_anonymous(self):
        """Return False as user is not anonymous."""
        return False

    def get_id(self):
        """Return user id."""
        return self.id


class Transaction(db.Model):
    """Transaction model."""
    __tablename__ = "transaction"
    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey("stock.id"))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Position(db.Model):
    """Position model."""
    __tablename__ = "position"
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    averagePrice = db.Column(db.Numeric(10, 2), nullable=False)
    stockId = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class WatchlistItem(db.Model):
    """Watchlist item model."""
    __tablename__ = "watchlist"
    id = db.Column(db.Integer, primary_key=True)
    stockId = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
