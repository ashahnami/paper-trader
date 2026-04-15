from typing import Any, Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Query
from sqlmodel import select

from app.dependencies import SessionDep, RequestClientDep
from app.models import Stock, StockPublic
from app.request_client_models import CompanyProfile, Quote
from app.core.config import settings

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/", response_model=list[StockPublic])
async def get_stocks(session: SessionDep) -> Any:
    stocks = session.exec(select(Stock)).all()
    return stocks


@router.post("/")
async def create_stock(stock: Stock, session: SessionDep) -> Stock:
    session.add(stock)
    session.commit()
    session.refresh(stock)
    return stock


@router.get("/{id}", response_model=Stock)
async def get_stock(id: int, session: SessionDep) -> Any:
    stock = session.get(Stock, id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock


@router.get("/{id}/profile", response_model=CompanyProfile)
async def get_stock_profile(id: int, session: SessionDep, request_client: RequestClientDep):
    stock = session.get(Stock, id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    response = await request_client.get(f"https://finnhub.io/api/v1/stock/profile2?symbol={stock.ticker}&token={settings.FINNHUB_API_KEY}")
    return response.json()


@router.get("/{id}/quote", response_model=Quote)
async def get_stock_quote(id: int, session: SessionDep, request_client: RequestClientDep):
    stock = session.get(Stock, id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    response = await request_client.get(f"https://finnhub.io/api/v1/quote?symbol={stock.ticker}&token={settings.FINNHUB_API_KEY}")
    return response.json()


@router.get("/quote/", response_model=list[Quote])
async def get_stocks_quotes(session: SessionDep, request_client: RequestClientDep, id: Annotated[list[int], Query()] = []):
    quotes = [None for _ in range(len(id))]
    for i, stock_id in enumerate(id):
        stock = session.get(Stock, stock_id)
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        response = await request_client.get(f"https://finnhub.io/api/v1/quote?symbol={stock.ticker}&token={settings.FINNHUB_API_KEY}")
        quotes[i] = response.json()
    return quotes

