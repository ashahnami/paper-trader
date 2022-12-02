from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)