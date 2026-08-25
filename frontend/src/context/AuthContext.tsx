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
        if (!user) return;

        let lastWrite = Date.now();
        const updateActivity = () => {
            const now = Date.now();
            if (now - lastWrite > 1000) {
                localStorage.setItem('lastActivity', now.toString());
                lastWrite = now;
            }
        };

        const checkInactivity = setInterval(() => {
            const lastActive = localStorage.getItem('lastActivity');
            if (lastActive && Date.now() - parseInt(lastActive, 10) > 600000) {
                logout();
            }
        }, 10000);

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
        localStorage.setItem('lastActivity', Date.now().toString());

        return () => {
            clearInterval(checkInactivity);
            events.forEach(e => window.removeEventListener(e, updateActivity));
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
        } catch (error) {
            console.error('Logout backend request failed, but clearing local state', error);
        } finally {
            setUser(null);
            setIsGuest(true);
            localStorage.removeItem('user');
            localStorage.setItem('isGuest', 'true');
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
