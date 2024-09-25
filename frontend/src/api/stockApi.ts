
import { BuyOrder } from '../entities/BuyOrder';
import { Stock } from '../entities/Stock';
import httpClient from './httpClient';

export const fetchStock = async (ticker: string): Promise<Stock> => {
    return (await httpClient.get<Stock>(`/stock/${ticker}`)).data;
}

export const buyStock = async (order: BuyOrder): Promise<any> => {
    return (await httpClient.post<BuyOrder>('/positions')).data;
}

export const closePosition = async (ticker: string): Promise<any> => {
    return (await httpClient.delete(`/positions/${ticker}/close`)).data;
}