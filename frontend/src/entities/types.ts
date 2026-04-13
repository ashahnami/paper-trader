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

export type UserPublic = {
    username: string;
    email: string;
    balance: number;
}