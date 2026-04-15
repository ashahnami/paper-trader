from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "b64d6c3ff43daf4a13368615328b6b5c5fb733f018e527e52e342da0c9d8f5bf"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///database.db"
    FINNHUB_API_KEY: str = "cft82n9r01qokdd04o00cft82n9r01qokdd04o0g"


settings = Settings()
