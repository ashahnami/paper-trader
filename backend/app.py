from flask import Flask, request, jsonify
from flask_jwt import JWT, current_identity
from flask_bcrypt import Bcrypt
from models import db, User
from config import AppConfig

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
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
    
    return jsonify({
        "id": user.id,
        "username": user.username
    })

if __name__ == "__main__":
    app.run(debug=True)
    