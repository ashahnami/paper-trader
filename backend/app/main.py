from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from .routers import users, positions, stocks, transactions, login, watchlists
from .dependencies import TokenDep

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
app.include_router(positions.router)
app.include_router(stocks.router)
app.include_router(transactions.router)
app.include_router(login.router)
app.include_router(watchlists.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
