from typing import Annotated, Any

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select

from app.dependencies import SessionDep, get_current_active_user
from app.models import User, Position, Transaction, Stock, Order, UserPublic
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserPublic])
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


@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]) -> Any:
    return current_user


@router.get("/me/watching/{stock_id}")
async def check_in_watchlist(stock_id: int, session: SessionDep, current_user: Annotated[User, Depends(get_current_active_user)]) -> Any:
    stock = session.get(Stock, stock_id);
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    if stock not in current_user.watched_stocks:
        return { 'inWatchlist': False }
    return { 'inWatchlist': True }


@router.get("/{id}", response_model=UserPublic)
async def get_user(id: int, session: SessionDep) -> Any:
    user = session.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
