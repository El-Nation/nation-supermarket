import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingBag, ChevronLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem clamp(1rem, 4vw, 2rem)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Wishlist</h1>
                {wishlist.length > 0 && (
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</span>
                )}
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
                    {wishlist.map((product: any) => (
                        <div key={product.product_id || product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                            {/* Product Image */}
                            <div style={{ height: '180px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '8px' }} />
                                )}
                            </div>
                            {/* Product Info */}
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Link to={`/product/${product.product_id || product.id}`} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>
                                    {product.name}
                                </Link>
                                <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '1.1rem' }}>
                                    ₦{Number(product.price).toLocaleString()}
                                </span>
                                <button 
                                    onClick={() => removeFromWishlist(product.product_id || product.id)}
                                    style={{ marginTop: 'auto', width: '100%', padding: '0.6rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                                >
                                    <Trash2 size={14} /> Remove from Wishlist
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                    <ChevronLeft size={20} /> Back to Shop
                </Link>
            </div>
        </div>
    );
}
