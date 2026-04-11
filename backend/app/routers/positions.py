from typing import Any, Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends

from app.dependencies import SessionDep, get_current_active_user
from app.models import Position, User

router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("/",  response_model=list[Position])
async def get_positions(current_user: Annotated[User, Depends(get_current_active_user)]) -> Any:
    return current_user.positions


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
