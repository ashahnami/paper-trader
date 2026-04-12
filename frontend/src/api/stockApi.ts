
import { Stock, BuyOrder } from '../entities/stock.types';
import httpClient from './httpClient';

export const fetchStock = async (ticker: string): Promise<Stock> => {
    return (await httpClient.get<Stock>(`/api/stock/${ticker}`)).data;
}

export const buyStock = async ({ id, quantity }: { id: number, quantity: number}): Promise<any> => {
    return (await httpClient.post<BuyOrder>(`/api/transactions/${id}`, {quantity})).data;
}

export const closePosition = async (id: number): Promise<any> => {
    return (await httpClient.delete(`/api/positions/${id}/close`)).data;
}

export const fetchAllStocks = async (): Promise<any> => {
    return (await httpClient.get('/api/stocks/')).data.stocks;
}