"""Configuration settings for the Flask application."""

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

def read_secret(path):
    """Reads a secret from a file."""

    if path and path.startswith("/"):
        try:
            with open(path, encoding="utf-8") as f:
                return f.read().strip()
        except FileNotFoundError:
            return ""
    return path

class Config:
    """Config class for the application."""

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = read_secret(os.getenv("DATABASE_URI"))

    REMEMBER_COOKIE_DURATION=timedelta(minutes=30)

    SECRET_KEY = read_secret(os.getenv("SECRET_KEY"))
