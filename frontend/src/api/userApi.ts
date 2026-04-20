import '../entities/user.types'
import httpClient from './httpClient';
import { Profile, ChangeUsername, ChangePasswordDetails, RegisterDetails, LoginResponse, LoginStatus, Transaction } from "../entities/user.types";
import { PositionPublic, WatchedStockPublic, UserPublic } from "../entities/types";

export const fetchProfile = async (): Promise<UserPublic> => {
    return (await httpClient.get<Profile>('/api/users/me')).data;
}

export const fetchPositions = async (): Promise<PositionPublic[]> => {
    return (await httpClient.get('/api/positions/')).data;
}

export const fetchWatchlist = async (): Promise<WatchedStockPublic[]> => {
    return (await httpClient.get('/api/watchlists/')).data;
}

export const checkInWatchlist = async (stock_id: number) => {
    return (await httpClient.get(`/api/users/me/watching/${stock_id}`)).data.inWatchlist;
}

export const addToWatchlist = async (stock_id: number) => {
    return (await httpClient.post('/api/watchlists/', { stock_id: stock_id })).data;
}

export const removeFromWatchlist = async (stock_id: number) => {
    return (await httpClient.delete(`/api/watchlists/${stock_id}`)).data;
}

export const fetchTransactions = async (ticker: string): Promise<Transaction[]> => {
    return (await httpClient.get<Transaction[]>(`/api/${ticker}/transactions/`)).data;
}

export const login = async ({ username, password }: { username: string, password: string }): Promise<LoginResponse> => {
    return (await httpClient.postForm<LoginResponse>('/api/login/token', {username: username, password: password})).data;
}

export const logout = async () => {
    /*
    const { data } = await httpClient.post("/api/auth/logout")
    return data;
    */
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
