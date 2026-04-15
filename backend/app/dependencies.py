from typing import Annotated

import jwt
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from httpx import AsyncClient
from jwt import InvalidTokenError
from sqlmodel import Session, select

from app.core.db import engine
from app.core.security import ALGORITHM
from app.models import User, TokenData
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")


def get_session():
    with Session(engine) as session:
        yield session


async def get_request_client():
    async with httpx.AsyncClient() as client:
        yield client


SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]
RequestClientDep = Annotated[AsyncClient, Depends(get_request_client)]


async def get_current_user(token: TokenDep, session: SessionDep) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    statement = select(User).where(User.username == token_data.username)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
