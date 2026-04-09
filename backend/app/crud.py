from sqlmodel import select

from app.core.security import verify_password, DUMMY_HASH
from app.dependencies import SessionDep
from app.models import User


def authenticate_user(session: SessionDep, username: str, password: str):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.password):
        return False
    return user
