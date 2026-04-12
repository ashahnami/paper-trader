from typing import Any, Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select

from app.dependencies import SessionDep, get_current_active_user
from app.models import Transaction, User, Order, Stock, Position

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[Transaction])
async def get_transactions(current_user: Annotated[User, Depends(get_current_active_user)]) -> list[Transaction]:
    return current_user.transactions


@router.post("/")
async def create_transaction(order: Order,
                             session: SessionDep,
                             current_user: Annotated[User, Depends(get_current_active_user)]) -> Transaction:
    stock = session.get(Stock, order.stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    total_price = order.price * order.quantity
    if total_price < current_user.balance:
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
