export interface LoginDetails {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface LoginStatus {
    logged_in: boolean;
}

export interface Position {
    id: number;
    symbol: string;
    quantity: number;
    averagePrice: number;
}

export interface Profile {
    username: string;
    email: string;
    balance: number;
}

export interface RegisterDetails {
    username: string;
    email: string;
    password: string;
}

export interface Transaction {
    symbol: string;
    name: string;
    price: number;
    shares: number;
}

export interface WatchlistItem {
    symbol: string;
}

export interface ChangePasswordDetails {
    old_password: string;
    new_password: string;
}

export interface ChangeUsername {
    newUsername: string;
}

export interface RegisterDetails {
    username: string;
    email: string;
    password: string;
}