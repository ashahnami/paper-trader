from typing import Any, Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select, join

from app.core.config import settings
from app.dependencies import RequestClientDep, SessionDep, get_current_active_user
from app.models import Position, User, PositionsPublic, PositionPublic, Stock

router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("/",  response_model=list[PositionPublic])
async def get_positions(session: SessionDep, current_user: Annotated[User, Depends(get_current_active_user)], request_client: RequestClientDep) -> Any:
    res: list[PositionPublic] = []
    for position in current_user.positions:
        stock = session.get(Stock, position.stock_id)

        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        response = await request_client.get(f"https://finnhub.io/api/v1/quote?symbol={stock.ticker}&token={settings.FINNHUB_API_KEY}")
        data = response.json()
        pc = round(((data["c"] - position.average_price) / position.average_price) * 100, 2)

        res.append({
            "id": position.id,
            "symbol": stock.ticker,
            "quantity": position.quantity,
            "average_price": position.average_price,
            "current_value": data["c"] * position.quantity,
            "pc": pc,
            "type": position.type,
            "stock_id": stock.id
            })

    return res


@router.post("/")
async def create_position(position: Position, session: SessionDep) -> Position:
    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.get("/{id}", response_model=PositionPublic)
async def get_position(id: int, session: SessionDep, current_user: Annotated[User, Depends(get_current_active_user)]) -> Any:
    # statement = (select(Position.id, Position.quantity, Position.average_price, Position.type, Stock.ticker, Position.user_id, Position.stock_id)
    #              .join(Stock).where(Position.id == id))
    # position = session.exec(statement).first()
    position = session.get(Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    if position.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return position


@router.delete("/{id}", response_model=Position)
async def close_position(id: int, session: SessionDep, current_user: Annotated[User, Depends(get_current_active_user)], request_client: RequestClientDep) -> Any:
    position = session.get(Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    if position.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    stock = session.get(Stock, position.stock_id)
    if stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    response = await request_client.get(f"https://finnhub.io/api/v1/quote?symbol={stock.ticker}&token={settings.FINNHUB_API_KEY}")
    curr_price = response.json()["c"]

    profit = (curr_price - position.average_price) * position.quantity
    current_user.balance += profit
    session.delete(position)
    session.commit()
    session.refresh(current_user)
    return position
