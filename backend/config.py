import os
import redis
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=20)
    SESSION_USE_SIGNER = True
    SECRET_KEY = os.getenv("SECRET_KEY")
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
