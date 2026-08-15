import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ChevronLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/shop/ProductCard';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Wishlist</h1>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ width: '80px', height: '80px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <ShoppingBag size={40} color="#94a3b8" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>Your Wishlist is Empty</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>You haven't saved any items to your wishlist yet.</p>
                    <Link to="/shop" style={{ background: '#0284c7', color: 'white', fontWeight: 600, padding: '0.75rem 2rem', borderRadius: '6px', textDecoration: 'none' }}>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {wishlist.map((product: any) => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                    <ChevronLeft size={20} /> Back to Shop
                </Link>
            </div>
        </div>
    );
}
