from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import SessionDep, get_current_active_user
from app.models import User, Stock, AddToWatchlistRequest

router = APIRouter(prefix="/watchlists", tags=["watchlists"])


@router.get("/")
async def get_watchlist(current_user: Annotated[User, Depends(get_current_active_user)]) -> list[Stock]:
    return current_user.watched_stocks


@router.post("/")
async def add_to_watchlist(request: AddToWatchlistRequest, session: SessionDep,
                           current_user: Annotated[User, Depends(get_current_active_user)]) -> list[Stock]:
    stock = session.get(Stock, request.stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    current_user.watched_stocks.append(stock)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user.watched_stocks


@router.delete("/{stock_id}")
async def delete_from_watchlist(stock_id: int, session: SessionDep,
                                current_user: Annotated[User, Depends(get_current_active_user)]) -> list[Stock]:
    stock = session.get(Stock, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    if stock not in current_user.watched_stocks:
        raise HTTPException(status_code=400, detail="Stock not in watchlist")
    current_user.watched_stocks.remove(stock)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user.watched_stocks
