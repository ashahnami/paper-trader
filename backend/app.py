from flask import Flask, request
from models import db, User
from config import AppConfig

app = Flask(__name__)
app.config.from_object(AppConfig)

db.init_app(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)