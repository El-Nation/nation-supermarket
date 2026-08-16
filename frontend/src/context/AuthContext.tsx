import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isGuest: boolean;
    login: (userData: User) => void;
    updateUser: (data: Partial<User>) => void;
    logout: () => Promise<void>;
    setGuestMode: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isGuest, setIsGuest] = useState<boolean>(() => {
        return localStorage.getItem('isGuest') === 'true';
    });

    useEffect(() => {
        let timeoutId: number;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            if (user) {
                timeoutId = setTimeout(() => {
                    logout();
                    alert("Your session has securely expired natively due to 1 hour of inactivity.");
                }, 3600000); // 1 hr securely
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        if (user) {
            events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
            resetTimer();
        }

        return () => {
            clearTimeout(timeoutId);
            events.forEach(e => window.removeEventListener(e, resetTimer));
        };
    }, [user]);

    const login = (userData: User) => {
        setUser(userData);
        setIsGuest(false);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('isGuest');
    };

    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setIsGuest(true);
            localStorage.removeItem('user');
            localStorage.setItem('isGuest', 'true');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const setGuestMode = (status: boolean) => {
        setIsGuest(status);
        localStorage.setItem('isGuest', String(status));
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, login, updateUser, logout, setGuestMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
