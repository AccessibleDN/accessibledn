'use client';

import { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { atom, useAtom } from 'jotai';

interface User {
    username: string;
    email: string; 
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
}

const userAtom = atom<User | null>(null);
const loadingAtom = atom(true);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const abortControllerRef = useRef<AbortController>();

    // Memoized API calls
    const apiCall = useCallback(async (endpoint: string, options: RequestInit) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const response = await fetch(endpoint, {
            ...options,
            signal: abortControllerRef.current.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API call failed');
        }

        return response.json();
    }, []);

    // Session check on mount with cleanup
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await apiCall('/api/userbase/v1/users/session', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(userData);
            } catch (error) {
                console.error('Session check failed:', error);
                localStorage.removeItem('authToken');
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [apiCall, setUser, setIsLoading]);

    const login = useCallback(async (username: string, password: string) => {
        const { token, user: userData } = await apiCall('/api/userbase/v1/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        localStorage.setItem('authToken', token);
        setUser(userData);
    }, [apiCall, setUser]);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
    }, [setUser]);

    const register = useCallback(async (username: string, email: string, password: string) => {
        const { token, user: userData } = await apiCall('/api/userbase/v1/users', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });

        localStorage.setItem('authToken', token);
        setUser(userData);
    }, [apiCall, setUser]);

    const contextValue = useMemo(() => ({
        user,
        isLoading,
        login,
        logout,
        register
    }), [user, isLoading, login, logout, register]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthenticationProvider');
    }
    return context;
}
