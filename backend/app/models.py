from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel
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


class UserBase(SQLModel):
    username: str = Field(index=True)
    email: str = Field(index=True)
    balance: float = Field(default=0)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str = Field()
    is_active: bool = Field(default=True)

    transactions: list["Transaction"] = Relationship(back_populates="user")
    positions: list["Position"] = Relationship(back_populates="user")
    watched_stocks: list["Stock"] = Relationship(back_populates="users", link_model=UserStockLink)


class UserPublic(UserBase):
    pass


class Stock(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    ticker: str = Field(index=True)
    description: str = Field(default=None)
    exchange: str = Field(index=True)

    users: list["User"] = Relationship(back_populates="watched_stocks", link_model=UserStockLink)


class StockPublic(SQLModel):
    id: int
    ticker: str
    description: str
    exchange: str


class WatchedStockPublic(SQLModel):
    id: int
    ticker: str


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
    average_price: float = Field(default=0)
    type: OrderType = Field(default=OrderType.BUY)

    stock_id: int = Field(default=None, foreign_key="stock.id")

    user_id: int = Field(default=None, foreign_key="user.id")
    user: User | None = Relationship(back_populates="positions")


class PositionPublic(SQLModel):
    id: int
    symbol: str
    quantity: int
    average_price: float
    current_value: float;
    type: OrderType
    stock_id: int


class PositionsPublic(SQLModel):
    data: list[Position]
    count: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class AddToWatchlistRequest(BaseModel):
    stock_id: int
