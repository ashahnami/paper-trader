import { LoginDetails } from '../entities/LoginDetails';
import { RegisterDetails } from '../entities/RegisterDetails';
import { ChangePasswordDetails } from '../entities/ChangePasswordDetails';
import { ChangeUsername } from '../entities/ChangeUsername';
import { LoginStatus } from '../entities/LoginStatus';
import { Position } from '../entities/Position';
import { Profile } from '../entities/Profile';
import { Transaction } from '../entities/Transaction';
import { WatchlistItem } from '../entities/Watchlist';
import httpClient from './httpClient';

export const fetchProfile = async (): Promise<Profile> => {
    return (await httpClient.get<Profile>('/api/auth/@me')).data;
}

export const fetchPositions = async (): Promise<Position[]> => {
    return (await httpClient.get<{ positions: Position[] }>('/api/positions/')).data.positions;
}

export const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
    return (await httpClient.get<{ watchlist: WatchlistItem[] }>('/api/watchlist/')).data.watchlist;
}

export const fetchTransactions = async (ticker: string): Promise<Transaction[]> => {
    return (await httpClient.get<Transaction[]>(`/api/${ticker}/transactions/`)).data;
}

export const login = async ({ username, password }: { username: string, password: string }): Promise<LoginDetails> => {
    return (await httpClient.post<LoginDetails>('/api/auth/login', {username, password})).data;
}

export const register = async ({ username, email, password }: { username: string, email: string, password: string }): Promise<RegisterDetails> => {
    return (await httpClient.post<RegisterDetails>('/api/auth/register', {username, email, password})).data;
} 

export const checkLogin = async (): Promise<LoginStatus> => {
    return (await httpClient.get<LoginStatus>('/api/auth/checklogin')).data;
}

export const changePassword = async ({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }): Promise<ChangePasswordDetails> => {
    return (await httpClient.patch<ChangePasswordDetails>('/api/auth/change-password', {oldPassword, newPassword})).data;
}

export const changeUsername = async ({ newUsername }: { newUsername: string }): Promise<ChangeUsername> => {
    return (await httpClient.patch<ChangeUsername>('/api/auth/change-username', {newUsername})).data;
}