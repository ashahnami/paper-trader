import os
import redis
from dotenv import load_dotenv
load_dotenv()

class AppConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SECRET_KEY = os.getenv("SECRET_KEY")
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")