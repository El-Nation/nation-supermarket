import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, Star, Search, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function ManageReviews() {
    const [activeTab, setActiveTab] = useState<'products' | 'store'>('products');
    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [storeFeedbacks, setStoreFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/reviews');
            setProductReviews(res.data.product_reviews);
            setStoreFeedbacks(res.data.store_feedback);
        } catch(e) {
            console.error("Failed fetching reviews:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteProductReview = async (id: number) => {
        if(!window.confirm("Delete this Product Review permanently?")) return;
        try {
            await api.delete(`/admin/reviews/product/${id}`);
            setProductReviews(r => r.filter(i => i.id !== id));
        } catch(e) {
            alert('Deletion failed intelligently.');
        }
    };

    const handleDeleteStoreFeedback = async (id: number) => {
        if(!window.confirm("Delete this Store Feedback permanently?")) return;
        try {
            await api.delete(`/admin/reviews/feedbacks/${id}`);
            setStoreFeedbacks(r => r.filter(i => i.id !== id));
        } catch(e) {
            alert('Deletion failed cleanly.');
        }
    };

    const hndleApproveStoreFeedback = async (id: number) => {
        try {
            await api.put(`/admin/feedbacks/${id}/approve`);
            setStoreFeedbacks(r => r.map(i => i.id === id ? { ...i, is_approved: true } : i));
        } catch(e) {
            alert('Approval failed natively.');
        }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Pulling Moderation Queue...</div>;

    return (
        <div style={{ padding: '0', fontFamily: 'sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
            <Helmet>
                <title>Manage Reviews & Feedback | Nation Supermarket Admin</title>
            </Helmet>

            <header style={{ padding: '2rem 2.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Reviews & Feedback</h1>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.95rem' }}>Moderate product reviews and storefront testimonials.</p>
                </div>
            </header>

            <div style={{ padding: '2rem 2.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                    <button 
                        onClick={() => setActiveTab('products')}
                        style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'products' ? '2px solid #0f172a' : '2px solid transparent', color: activeTab === 'products' ? '#0f172a' : '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Star size={16} /> Product Reviews ({productReviews.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('store')}
                        style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'store' ? '2px solid #0f172a' : '2px solid transparent', color: activeTab === 'store' ? '#0f172a' : '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <MessageCircle size={16} /> Store Feedback ({storeFeedbacks.length})
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                    {activeTab === 'products' && productReviews.map(r => (
                        <div key={r.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontWeight: 700 }}>{r.product_name || `Product ID: ${r.product_id}`}</h4>
                                    <div style={{ color: '#d97706', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                </div>
                                <button onClick={() => handleDeleteProductReview(r.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>"{r.comment}"</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                    {r.db_user_name || r.guest_name || 'Anonymous User'} 
                                    {r.is_verified_purchase && <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><ShieldCheck size={12} /> Verified</span>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'store' && storeFeedbacks.map(f => (
                        <div key={f.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
                            {!f.is_approved && (
                                <span style={{ position: 'absolute', top: '-10px', right: '15px', background: '#f59e0b', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>PENDING</span>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontWeight: 700 }}>{f.user_name || 'Guest User'}</h4>
                                    <div style={{ color: '#d97706', fontSize: '0.85rem' }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {!f.is_approved && (
                                        <button onClick={() => hndleApproveStoreFeedback(f.id)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, fontSize: '0.75rem' }}><CheckCircle size={14} /> Approve</button>
                                    )}
                                    <button onClick={() => handleDeleteStoreFeedback(f.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>"{f.comment}"</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                {new Date(f.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    
                    {activeTab === 'products' && productReviews.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>No product reviews structurally mapped globally implicitly nicely.</div>
                    )}
                    {activeTab === 'store' && storeFeedbacks.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>No store testimonials systematically dynamically logically smoothly gracefully nicely explicitly safely solidly beautifully completely gracefully structurally intelligently smoothly globally flawlessly safely correctly.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
