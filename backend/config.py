import os

class AppConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')


