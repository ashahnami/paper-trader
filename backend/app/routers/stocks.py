from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.dependencies import SessionDep
from app.models import Stock

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/", response_model=list[Stock])
async def get_stocks(session: SessionDep) -> Any:
    stocks = session.exec(select(Stock)).all()
    return stocks


@router.get("/{id}", response_model=Stock)
async def get_stock(id: int, session: SessionDep) -> Any:
    stock = session.get(Stock, id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock
