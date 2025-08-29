import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

def read_secret(path):
    if path and path.startswith("/"):
        try: 
            with open(path) as f:
                return f.read().strip()
        except Exception:
            return ""
    return path

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = read_secret(os.getenv("DATABASE_URI"))

    REMEMBER_COOKIE_DURATION=timedelta(minutes=30)

    SECRET_KEY = read_secret(os.getenv("SECRET_KEY"))
