from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User
from config import AppConfig

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route("/register")
def register_user():
    email = request.json["email"]
    username = request.json["username"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    password = request.json["password"]
    
    if((User.query.filter_by(email=email).first() is not None) and (User.query.filter_by(username=username).first() is not None)):
        return jsonify({"error": "User already exists"})
    
    passwordHash = bcrypt.generate_password_hash(password)
    new_user = User(email=email, username=username, first_name=first_name, last_name=last_name, password=passwordHash)
    db.session.add(new_user)
    db.session.commit()
    
@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Incorrect details. Please try again."})
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect details. Please try again."})
    
    return jsonify({
        "id": user.id,
        "username": user.username
    })

if __name__ == "__main__":
    app.run(debug=True)