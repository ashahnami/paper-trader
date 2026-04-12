import '../entities/user.types'
import httpClient from './httpClient';
import { Profile, Position, ChangeUsername, ChangePasswordDetails, RegisterDetails, LoginResponse, LoginStatus, WatchlistItem, Transaction, LoginDetails } from "../entities/user.types";

export const fetchProfile = async (): Promise<Profile> => {
    return (await httpClient.get<Profile>('/api/users/me')).data;
}

export const fetchPositions = async (): Promise<Position[]> => {
    return (await httpClient.get<{ positions: Position[] }>('/api/positions/')).data.positions;
}

export const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
    return (await httpClient.get<{ watchlist: WatchlistItem[] }>('/api/watchlists/')).data.watchlist;
}

export const checkInWatchlist = async (id: number) => {
    return (await httpClient.get(`/api/watchlists/${id}`)).data.inWatchlist;
}

export const addToWatchlist = async (id: number) => {
    return (await httpClient.post(`/api/watchlists/${id}`)).data;
}

export const removeFromWatchlist = async (id: number) => {
    return (await httpClient.delete(`/api/watchlists/${id}`)).data;
}

export const fetchTransactions = async (ticker: string): Promise<Transaction[]> => {
    return (await httpClient.get<Transaction[]>(`/api/${ticker}/transactions/`)).data;
}

export const login = async ({ username, password }: { username: string, password: string }): Promise<LoginResponse> => {
    return (await httpClient.postForm<LoginResponse>('/api/login/token', {username: username, password: password})).data;
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