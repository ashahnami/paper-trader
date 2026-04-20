import qs from 'qs';

import { Stock, BuyOrder } from '@/entities/stock.types';
import httpClient from '@/api/httpClient';
import {CompanyProfile, MakeTransactionVariables, NewsItem, OrderType, Quote, StockPublic} from "@/entities/types";

export const fetchStock = async (ticker: string): Promise<StockPublic> => {
    const { data } = await httpClient.get<StockPublic>(`/api/stock/${ticker}`);
    return data;
}

export const getCompanyProfile = async (stock_id: number): Promise<CompanyProfile> => {
    const { data } = await httpClient.get<CompanyProfile>(`/api/stocks/${stock_id}/profile`)
    return data;
}

export const getStockQuote = async (stock_id: number): Promise<Quote> => {
    const { data } = await httpClient.get<Quote>(`/api/stocks/${stock_id}/quote`)
    return data;
}

export const getStocksQuotes = async (stock_id_array: number[]): Promise<Quote[]> => {
    const { data } = await httpClient.get<Quote[]>('api/stocks/quote/', {
        params: {
            id: stock_id_array
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    })
    return data;
}

export const getNews = async (): Promise<NewsItem[]> => {
    const { data } = await httpClient.get<NewsItem[]>('/api/news')
    return data;
}

export const makeTransaction = async ({ stock_id, quantity, order_type }: MakeTransactionVariables): Promise<any> => {
    const { data } = await httpClient.post('/api/transactions/', {
        stock_id,
        quantity,
        order_type 
    })
    return data;
}

export const closePosition = async (id: number): Promise<any> => {
    const { data } = await httpClient.delete(`/api/positions/${id}`);
    return data;
}

export const fetchAllStocks = async (): Promise<StockPublic[]> => {
    const { data } = await httpClient.get('/api/stocks/');
    return data;
}
