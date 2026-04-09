from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.dependencies import SessionDep
from app.models import Position

router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("/",  response_model=list[Position])
async def get_positions(session: SessionDep) -> Any:
    positions = session.exec(select(Position)).all()
    return positions


@router.post("/")
async def create_position(position: Position, session: SessionDep) -> Position:
    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.get("/{id}", response_model=Position)
async def get_position(id: int, session: SessionDep) -> Any:
    position = session.get(Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    return position


@router.delete("/{id}", response_model=Position)
async def close_position(id: int, session: SessionDep) -> Any:
    position = session.get(Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    session.delete(position)
    session.commit()
    return position
