import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=20)
    SECRET_KEY = os.getenv("SECRET_KEY")
