from sqlmodel import SQLModel


class CompanyProfile(SQLModel):
    exchange: str
    finnhubIndustry: str
    logo: str
    name: str
    ticker: str


class Quote(SQLModel):
    c: float
    d: float
    dp: float
    h: float
    l: float
    o: float
    pc: float
    t: int


class NewsItem(SQLModel):
    category: str
    datetime: int
    headline: str
    id: int
    image: str
    related: str
    source: str
    summary: str
    url: str
