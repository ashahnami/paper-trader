from typing import Annotated, Any

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select

from app.dependencies import SessionDep, get_current_active_user
from app.models import User, Position, Transaction, Stock, Order
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
async def get_users(session: SessionDep) -> Any:
    users = session.exec(select(User)).all()
    return users


@router.post("/")
async def create_user(user: User, session: SessionDep) -> User:
    user.password = get_password_hash(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user


@router.get("/{id}", response_model=User)
async def get_user(id: int, session: SessionDep) -> Any:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{id}/positions")
async def get_user_positions(id: int, session: SessionDep) -> list[Position]:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.positions


@router.get("/{id}/transactions")
async def get_user_transactions(id: int, session: SessionDep) -> list[Transaction]:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.transactions


@router.post("/{id}/transactions")
async def create_user_transaction(id: int, order: Order, session: SessionDep) -> Transaction:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    stock = session.get(Stock, order.stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    total_price = order.price * order.quantity
    if total_price < user.balance:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    transaction = Transaction(price=order.price, quantity=order.quantity, order_type=order.order_type,
                              stock_id=order.stock_id, user_id=id)
    session.add(transaction)

    statement = select(Position).where(Position.stock_id == order.stock_id and Position.type == order.order_type)
    position = session.exec(statement).first()
    if not position:
        position = Position(quantity=order.quantity,
                            average_price=order.price,
                            order_type=order.order_type,
                            stock_id=order.stock_id)
    else:
        position.quantity += order.quantity
        position.average_price = ((position.average_price * position.quantity) + (order.price * order.quantity) / (
                    position.quantity + order.quantity))

    session.add(position)
    session.commit()
    session.refresh(transaction)
    return transaction


@router.get("/{id}/watched_stocks")
async def get_watchlist(id: int, session: SessionDep) -> list[Stock]:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.watched_stocks


@router.post("/{id}/watched_stocks/{stock_id}")
async def add_to_watchlist(id: int, stock_id: int, session: SessionDep) -> list[Stock]:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    stock = session.get(Stock, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    user.watched_stocks.append(stock)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user.watched_stocks


@router.delete("/{id}/watched_stocks/{stock_id}")
async def remove_from_watchlist(id: int, stock_id: int, session: SessionDep) -> list[Stock]:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    stock = session.get(Stock, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    if stock not in user.watched_stocks:
        raise HTTPException(status_code=400, detail="Stock not in watchlist")
    user.watched_stocks.remove(stock)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user.watched_stocks
