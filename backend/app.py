from flask import Flask
from config import AppConfig
from models import db

app = Flask(__name__)
app.config.from_object(AppConfig)
db.init_app(app)

@app.route("/")
def hello_world():
    return "Hello world!"

if __name__ == "__main__":
    app.run(debug=True)