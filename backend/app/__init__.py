from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate


def create_app(config_class=Config):
    app = Flask(__name__)
    cors = CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    from app import auth
    app.register_blueprint(auth.bp)

    from app import user
    app.register_blueprint(user.bp)

    from app import stock
    app.register_blueprint(stock.bp)

    from app import position
    app.register_blueprint(position.bp)

    from app import watchlist
    app.register_blueprint(watchlist.bp) 

    @app.route('/')
    def test():
        return 'test'

    return app
