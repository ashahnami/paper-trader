from flask import Flask
from config import Config
from app.extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    from app import auth
    app.register_blueprint(auth.bp)

    from app import user
    app.register_blueprint(user.bp)

    from app import stock
    app.register_blueprint(stock.bp)

    @app.route('/')
    def test():
        return 'test'

    return app
