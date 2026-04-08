from datetime import datetime, timezone
from enum import Enum

from pydantic import computed_field, BaseModel
from sqlmodel import Field, SQLModel, Relationship


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)

class OrderType(Enum):
    BUY = "BUY"
    SELL = "SELL"

class Order(BaseModel):
    stock_id: int
    price: int
    quantity: int
    order_type: OrderType

class UserStockLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    stock_id: int = Field(default=None, foreign_key="stock.id", primary_key=True)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True)
    password: str = Field()
    balance: int = Field(default=0)

    transactions: list["Transaction"] = Relationship(back_populates="user")
    positions: list["Position"] = Relationship(back_populates="user")
    watched_stocks: list["Stock"] = Relationship(back_populates="users", link_model=UserStockLink)

class Stock(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    ticker: str = Field(index=True)
    description: str = Field(default=None)
    exchange: str = Field(index=True)

    users: list["User"] = Relationship(back_populates="watched_stocks", link_model=UserStockLink)

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    price: int = Field(default=0)
    quantity: int = Field(default=1)
    timestamp: datetime = Field(default_factory=get_datetime_utc)
    order_type: OrderType = Field(default=OrderType.BUY)

    stock_id: int = Field(default=None, foreign_key="stock.id")

    user_id: int = Field(default=None, foreign_key="user.id")
    user: User | None = Relationship(back_populates="transactions")

class Position(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    quantity: int = Field(default=1)
    average_price: int = Field(default=0)
    type: OrderType = Field(default=OrderType.BUY)

    stock_id: int = Field(default=None, foreign_key="stock.id")

    user_id: int = Field(default=None, foreign_key="user.id")
    user: User | None = Relationship(back_populates="positions")