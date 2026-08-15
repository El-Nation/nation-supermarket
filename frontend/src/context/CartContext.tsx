import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    product_id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    max_stock: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (product_id: number) => void;
    updateQuantity: (product_id: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem('nation_cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('nation_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(p => p.product_id === item.product_id);
            if (existing) {
                return prev.map(p => 
                    p.product_id === item.product_id 
                        ? { ...p, quantity: Math.min(p.quantity + item.quantity, p.max_stock) } 
                        : p
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (product_id: number) => {
        setCartItems(prev => prev.filter(p => p.product_id !== product_id));
    };

    const updateQuantity = (product_id: number, quantity: number) => {
        setCartItems(prev => prev.map(p => {
            if (p.product_id === product_id) {
                return { ...p, quantity: Math.max(1, Math.min(quantity, p.max_stock)) };
            }
            return p;
        }));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) throw new Error('useCart must be used strictly within a CartProvider wrapper.');
    return context;
};
