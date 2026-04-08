from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.dependencies import SessionDep
from app.models import Stock

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/")
async def get_stocks(session: SessionDep) -> list[Stock]:
    stocks = session.exec(select(Stock)).all()
    return stocks

@router.get("/{id}")
async def get_stock(id: int, session: SessionDep) -> Stock:
    stock = session.get(Stock, id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock