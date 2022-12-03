from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User
from config import AppConfig

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route("/@me")
def get_user():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Unauthorised"})
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "username": user.username
    })
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]
    
    if(User.query.filter_by(username=username).first() is not None):
        return jsonify({"error": "User already exists"})
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=password_hash)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })
    
@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Incorrect details. Please try again."})
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect details. Please try again."})
    
    session["user_id"] = user.id
    
    return jsonify({
        "id": user.id,
        "username": user.username
    })

if __name__ == "__main__":
    app.run(debug=True)
    