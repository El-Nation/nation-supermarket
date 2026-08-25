import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ChevronLeft, ShoppingCart, Heart, Truck, Tag, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/shop/ProductCard';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [postingReview, setPostingReview] = useState(false);
    const { user } = useAuth(); 

    const inWishlist = wishlist.some(item => (item as any).product_id === product?.id || (item as any).id === product?.id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchIsolatedProduct = async () => {
            setLoading(true);
            try {
                const [pRes, rRes, recRes] = await Promise.all([
                    api.get(`/public/products/${id}`),
                    api.get(`/public/products/${id}/reviews`),
                    api.get(`/public/products/${id}/recommendations`)
                ]);
                const p = pRes.data;
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
                setReviews(rRes.data);
                setRecommendations(recRes.data);
            } catch(e) {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchIsolatedProduct();
    }, [id]);

    if (loading) return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '4rem' }}>
                <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#e2e8f0', borderRadius: '16px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '60%', height: '3rem', backgroundColor: '#e2e8f0', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    <div style={{ width: '40%', height: '2rem', backgroundColor: '#e2e8f0', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    <div style={{ width: '100%', height: '10rem', backgroundColor: '#e2e8f0', borderRadius: '8px', marginTop: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                </div>
            </div>
            <style>
                {`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}
            </style>
        </div>
    );

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
            addToWishlist({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url
            });
        }
    };

    const handleBuyNow = () => {
        sessionStorage.setItem('buy_now_product', JSON.stringify([{ ...product, quantity }]));
        navigate('/checkout-test?mode=buy_now');
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please login to submit heavily weighted reviews natively.");
        setPostingReview(true);
        try {
            await api.post(`/user/products/${product.id}/reviews`, reviewForm);
            const rRes = await api.get(`/public/products/${product.id}/reviews`);
            setReviews(rRes.data);
            setReviewForm({ rating: 5, comment: '' });
            alert("Review successfully deployed seamlessly!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Error submitting review strictly");
        } finally {
            setPostingReview(false);
        }
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const verifiedCount = reviews.filter(r => r.is_verified_purchase).length;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
            <Helmet>
                <title>{product.name} | Nation Supermarket</title>
                <meta name="description" content={product.description ? product.description.substring(0, 150) + '...' : `Buy ${product.name} at Nation Supermarket.`} />
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={product.description ? product.description.substring(0, 150) + '...' : `Buy ${product.name} at Nation Supermarket.`} />
                <meta property="og:image" content={product.image_url} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": product.image_url,
                        "description": product.description,
                        "sku": product.id,
                        "offers": {
                            "@type": "Offer",
                            "url": typeof window !== 'undefined' ? window.location.href : '',
                            "priceCurrency": "NGN",
                            "price": product.price,
                            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    })}
                </script>
            </Helmet>
            
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem', transition: '0.2s' }}>
                <ChevronLeft size={20} /> Continue Shopping
            </Link>

            <div className="tablet-grid-1 mobile-grid-1 mobile-gap" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '4rem', alignItems: 'start' }}>
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
                    
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0', whiteSpace: 'pre-line' }}>
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
                    <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#334155', fontWeight: 600 }}>
                            <Truck size={24} color="#0284c7" /> Genuine Swift Delivery Network
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#334155', fontWeight: 600 }}>
                            <ShieldCheck size={24} color="#16a34a" /> 100% Quality Guaranteed
                        </div>
                    </div>
                    
                    {/* Customer Reviews Section natively mapped */}
                    <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Customer Reviews 
                            {reviews.length > 0 && <span style={{ fontSize: '1rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '20px', color: '#475569' }}>{reviews.length}</span>}
                        </h2>
                        
                        {reviews.length > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#d97706', lineHeight: 1 }}>⭐ {avgRating}</div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400e' }}>out of 5 stars</div>
                                    <div style={{ color: '#b45309', fontSize: '0.95rem' }}>Based on {reviews.length} reviews ({verifiedCount} verified)</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#64748b', marginBottom: '2rem', fontStyle: 'italic' }}>Be the first to review this item uniquely cleanly!</div>
                        )}
                        
                        {/* Add Review Hook */}
                        {user ? (
                            <form onSubmit={submitReview} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>Write a Review</h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Rating</label>
                                    <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Your Review</label>
                                    <textarea required rows={3} value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }} placeholder="What did you like or dislike about this product?"></textarea>
                                </div>
                                <button type="submit" disabled={postingReview} style={{ padding: '0.65rem 1.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: postingReview ? 'not-allowed' : 'pointer' }}>
                                    {postingReview ? 'Posting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '3rem' }}>
                                <span style={{ color: '#475569', fontWeight: 500 }}>Want to leave a trusted review?</span>
                                <Link to="/auth/login" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>Login to Review</Link>
                            </div>
                        )}

                        {/* Review Feed */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.map(r => (
                                <div key={r.id} style={{ padding: '1.5rem', background: 'white', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{r.user_name}</span>
                                                {r.is_verified_purchase && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <ShieldCheck size={12} /> Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ color: '#d97706', fontSize: '0.9rem', letterSpacing: '2px' }}>
                                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                            {new Date(r.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Discovery / You May Also Like System */}
                    {recommendations.length > 0 && (
                        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '3rem', marginTop: '3rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>You May Also Like</h2>
                            <div className="tablet-grid-2 desktop-grid-4 mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                                {recommendations.map((p: any) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
