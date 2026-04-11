import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import httpClient from '../api/httpClient';

const AuthContext = createContext({});

interface Auth {
    user: object;
    accessToken: string;
}

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return authContext;
}

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>();
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await httpClient.get('/api/users/me');
                setToken(response.data.access_token)
            } catch (error) {
                console.log('Not logged in')
            } finally {
                setLoading(false);
            }
        }

        fetchMe();
    }, [])

    useLayoutEffect(() => {
        const authInterceptor = httpClient.interceptors.request.use((config) => {
            config.headers.Authorization =
                token
                    ? `Bearer ${token}`
                    : config.headers.Authorization;
            return config;
        });

        return () => {
            httpClient.interceptors.request.eject(authInterceptor);
        };
    }, [token])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;