import { createContext, useEffect, useState } from "react";
import httpClient from '../httpClient';

const AuthContext = createContext({});

interface Auth {
    user: string;
}

export const AuthProvider = ({ children }: any) => {
    const [auth, setAuth] = useState<Auth | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await httpClient.get('/auth/@me');
                setAuth({ user: response.data.username });
            } catch (error) {
                console.log('Not logged in')
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [])

    if (loading) {
        return <div></div>
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;