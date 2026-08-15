import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ChevronLeft, ShoppingCart, Heart, Truck, Tag, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const inWishlist = wishlist.some(item => item.id === product?.id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchIsolatedProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/public/products/${id}`);
                const p = res.data;
                setProduct({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: Number(p.price),
                    compare_price: p.discount > 0 ? Number(p.price) + Number(p.discount) : undefined,
                    image_url: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
                    stock: p.stock_quantity,
                    category_id: p.category_id
                });
            } catch(e) {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchIsolatedProduct();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#64748b' }}>Locating structural node arrays...</div>;

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#64748b' }}>
                <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Product Not Found</h1>
                <p>The specific item you are looking for natively resolving mapping the coordinates could not be loaded.</p>
                <Link to="/shop" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.85rem 2rem', background: '#0284c7', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}>Back to Shop</Link>
            </div>
        );
    }

    const toggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleBuyNow = () => {
        sessionStorage.setItem('buy_now_product', JSON.stringify([{ ...product, quantity }]));
        navigate('/checkout-test?mode=buy_now');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem', transition: '0.2s' }}>
                <ChevronLeft size={20} /> Continue Shopping
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '4rem', alignItems: 'start' }}>
                {/* Left: HD Cover Frame */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden' }}>
                    {product.compare_price && (
                        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', zIndex: 10 }}>
                            <Tag size={14} /> Sale
                        </div>
                    )}
                    <button 
                        onClick={toggleWishlist}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    >
                        <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#64748b'} />
                    </button>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s' }} />
                    ) : (
                        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#cbd5e1' }}>{product.name.charAt(0)}</div>
                    )}
                </div>

                {/* Right: Explicit Product Payload Mapping */}
                <div>
                    {product.stock <= 0 && <span style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>Out of Stock</span>}
                    {product.stock > 0 && product.stock <= 20 && <span style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>Low Stock: Only {product.stock} left</span>}

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0', lineHeight: 1.1 }}>{product.name}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>₦{product.price.toLocaleString()}</span>
                        {product.compare_price && (
                            <span style={{ fontSize: '1.25rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>₦{product.compare_price.toLocaleString()}</span>
                        )}
                    </div>
                    
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0' }}>
                        {product.description}
                    </p>

                    {/* Interactive Action Control Grid */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', border: '2px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '56px' }}>
                            <button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} style={{ width: '45px', background: '#f8fafc', border: 'none', fontSize: '1.25rem', fontWeight: 700, cursor: quantity > 1 ? 'pointer' : 'not-allowed', color: '#64748b' }}>-</button>
                            <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', borderLeft: '2px solid #e2e8f0', borderRight: '2px solid #e2e8f0' }}>{quantity}</div>
                            <button disabled={quantity >= product.stock} onClick={() => setQuantity(q => q + 1)} style={{ width: '45px', background: '#f8fafc', border: 'none', fontSize: '1.25rem', fontWeight: 700, cursor: quantity < product.stock ? 'pointer' : 'not-allowed', color: '#64748b' }}>+</button>
                        </div>
                        <button 
                            disabled={product.stock <= 0}
                            onClick={() => addToCart({
                                product_id: product.id,
                                name: product.name,
                                price: product.price,
                                image_url: product.image_url,
                                quantity: quantity,
                                max_stock: product.stock
                            })} 
                            style={{ flex: 1, minWidth: '200px', height: '56px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, cursor: product.stock > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: product.stock <= 0 ? 0.5 : 1 }}
                        >
                            <ShoppingCart size={20} /> {product.stock <= 0 ? 'Unavailable' : 'Add to Cart'}
                        </button>
                        <button 
                            disabled={product.stock <= 0}
                            onClick={handleBuyNow} 
                            style={{ flex: 1, minWidth: '200px', height: '56px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, cursor: product.stock > 0 ? 'pointer' : 'not-allowed', opacity: product.stock <= 0 ? 0.5 : 1 }}
                        >
                            Buy It Now
                        </button>
                    </div>

                    {/* Trust Signals */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#334155', fontWeight: 600 }}>
                            <Truck size={24} color="#0284c7" /> Genuine Swift Delivery Network
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#334155', fontWeight: 600 }}>
                            <ShieldCheck size={24} color="#16a34a" /> 100% Quality Guaranteed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
