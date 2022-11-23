from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=uuid4().hex)
    email = db.Column(db.String(150), unique=True)
    username = db.Column(db.String(150), unique=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    password = db.Column(db.String(60), nullable=False)