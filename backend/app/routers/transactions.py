from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.dependencies import SessionDep
from app.models import Transaction

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[Transaction])
async def get_transactions(session: SessionDep) -> Any:
    transactions = session.exec(select(Transaction)).all()
    return transactions


@router.get("/{id}", response_model=Transaction)
async def get_transaction(id: int, session: SessionDep) -> Any:
    transaction = session.get(Transaction, id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction
