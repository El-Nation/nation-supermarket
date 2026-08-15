import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface WishlistItem {
    product_id: number;
    name: string;
    price: number;
    image_url: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => Promise<void>;
    removeFromWishlist: (product_id: number) => Promise<void>;
    isInWishlist: (product_id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isGuest } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            fetchWishlistFromDB();
        } else if (isGuest || !user) {
            const stored = localStorage.getItem('nation_wishlist');
            if (stored) setWishlist(JSON.parse(stored));
        } else {
            setWishlist([]); // Strict block: admin receives no wishlist parameters
        }
    }, [user, isGuest]);

    const fetchWishlistFromDB = async () => {
        try {
            const res = await api.get('/user/wishlist');
            setWishlist(res.data);
        } catch (e) {
            console.error('Failed fetching wishlist constraints natively.');
        }
    };

    const addToWishlist = async (item: WishlistItem) => {
        if (user && user.role !== 'admin') {
            try {
                await api.post('/user/wishlist', { product_id: item.product_id, name: item.name, price: item.price, image_url: item.image_url });
                await fetchWishlistFromDB();
            } catch (e) { console.error(e); }
        } else {
            setWishlist(prev => {
                if(prev.find(p => p.product_id === item.product_id)) return prev;
                const updated = [...prev, item];
                localStorage.setItem('nation_wishlist', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const removeFromWishlist = async (product_id: number) => {
        if (user && user.role !== 'admin') {
            try {
                await api.delete(`/user/wishlist/${product_id}`);
                await fetchWishlistFromDB();
            } catch(e) { console.error(e); }
        } else {
            setWishlist(prev => {
                const updated = prev.filter(p => p.product_id !== product_id);
                localStorage.setItem('nation_wishlist', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const isInWishlist = (product_id: number | string) => wishlist.some(w => Number(w.product_id) === Number(product_id) || Number((w as any).id) === Number(product_id));

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) throw new Error('useWishlist mathematically natively requires a WishlistProvider boundary.');
    return context;
};
