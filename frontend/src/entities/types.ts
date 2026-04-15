export enum OrderType {
    "BUY",
    "SELL"
}

export type PositionPublic = {
    id: number;
    quantity: number;
    average_price: number;
    type: OrderType;
    stock_id: number;
}

export type WatchedStockPublic = {
    id: number;
    ticker: string;
}

export type StockPublic = {
    id: number;
    ticker: string;
    description: string;
    exchange: string;
}

export type CompanyProfile = {
    exchange: string;
    finnhubIndustry: string;
    logo: string;
    name: string;
    ticker: string;
}

export type Quote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}


export type NewsItem = {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}


export type UserPublic = {
    username: string;
    email: string;
    balance: number;
}