export interface Stock {
    ticker: string;
    name: string;
    market: string;
}

export interface BuyOrder {
    stock_id: number;
    quantity: number;
}