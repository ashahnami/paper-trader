
import { Stock } from '../entities/Stock';
import httpClient from '../httpClient';

export const fetchStock = async (ticker: string): Promise<Stock> => {
    return (await httpClient.get<Stock>(`/stock/${ticker}`)).data;
}