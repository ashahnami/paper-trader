"""Flask application factory for the application backend."""

from flask import Flask
from config import Config
from app.extensions import db, migrate, login_manager
from app import auth, user, stock, position, watchlist, transaction

def create_app(config_class=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    login_manager.login_message_category = "warning"

    app.register_blueprint(auth.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(stock.bp)
    app.register_blueprint(position.bp)
    app.register_blueprint(watchlist.bp)
    app.register_blueprint(transaction.bp)

    @app.route('/')
    def test():
        """Test route."""
        return 'test'

    return app
