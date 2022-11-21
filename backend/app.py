import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask
from config import AppConfig
from models import db

load_dotenv()

app = Flask(__name__)
connection = psycopg2.connect(os.getenv("DATABASE_URI"))

with app.app_context():
    db.create_all()

@app.route("/")
def hello_world():
    return "Hello world!"

if __name__ == "__main__":
    app.run(debug=True)