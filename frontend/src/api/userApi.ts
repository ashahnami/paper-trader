import { Position } from '../entities/Position';
import { Profile } from '../entities/Profile';
import { Transaction } from '../entities/Transaction';
import { WatchlistItem } from '../entities/Watchlist';
import httpClient from '../httpClient';

export const fetchProfile = async (): Promise<Profile> => {
    return (await httpClient.get<Profile>('/@me')).data;
}

export const fetchPositions = async (): Promise<Position[]> => {
    return (await httpClient.get<Position[]>('/positions')).data;
}

export const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
    return (await httpClient.get<WatchlistItem[]>('/watchlist')).data;
}

export const fetchTransactions = async (ticker: string): Promise<Transaction[]> => {
    return (await httpClient.get<Transaction[]>(`/transactions/${ticker}`)).data;
}