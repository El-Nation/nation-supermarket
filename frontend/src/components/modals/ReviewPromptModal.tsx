import React, { useState } from 'react';
import { X, Star, ShoppingBag, Store } from 'lucide-react';
import api from '../../services/api';

export default function ReviewPromptModal({ isOpen, onClose, items, reference }: { isOpen: boolean, onClose: () => void, items: any[], reference: string }) {
    const [mode, setMode] = useState<'chooser' | 'product' | 'store'>('chooser');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const reset = () => {
        setMode('chooser');
        setSelectedProductId(null);
        setRating(5);
        setComment('');
        setGuestName('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'product' && selectedProductId) {
                // Post product review explicitly structurally
                const token = sessionStorage.getItem('token') || localStorage.getItem('token');
                const path = token ? `/user/products/${selectedProductId}/reviews` : `/public/products/${selectedProductId}/reviews`;
                await api.post(path, { rating, comment, guest_name: guestName });
            } else if (mode === 'store') {
                // Post store feedback globally natively
                await api.post('/public/feedback', { rating, comment, guest_name: guestName });
            }
            alert('Your review has been successfully submitted! Thank you!');
            handleClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit review cleanly');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '500px', borderRadius: '12px', padding: '2rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                <button onClick={handleClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={24} />
                </button>

                {mode === 'chooser' ? (
                    <>
                        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, textAlign: 'center' }}>Leave a Review</h2>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>We value your feedback strictly! What would you like to review?</p>
                        
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <button onClick={() => setMode('product')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: '0.2s', outline: 'none' }}>
                                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '50%' }}><ShoppingBag size={24} /></div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>Review a Product</h4>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Rate a specific item from your order structurally.</p>
                                </div>
                            </button>

                            <button onClick={() => setMode('store')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: '0.2s', outline: 'none' }}>
                                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '50%' }}><Store size={24} /></div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>Review Store Experience</h4>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Rate the overall shopping & delivery experience seamlessly.</p>
                                </div>
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submitReview}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <button type="button" onClick={() => setMode('chooser')} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>← Back</button>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                                {mode === 'product' ? 'Review a Product' : 'Rate Your Experience'}
                            </h2>
                        </div>

                        {mode === 'product' && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Select Product from Order</label>
                                <select required value={selectedProductId || ''} onChange={(e) => setSelectedProductId(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                                    <option value="" disabled>Select an item...</option>
                                    {items.map((item: any, idx) => (
                                        <option key={idx} value={item.product_id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Your Name (Optional if logged in)</label>
                            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '0.25rem' }} onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button 
                                        key={num} type="button" 
                                        onClick={() => setRating(num)} 
                                        onMouseEnter={() => setHoverRating(num)}
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
                                    >
                                        <Star size={32} fill={(hoverRating || rating) >= num ? '#f59e0b' : 'transparent'} color={(hoverRating || rating) >= num ? '#d97706' : '#cbd5e1'} style={{ transition: 'all 0.1s', transform: hoverRating === num ? 'scale(1.15)' : 'scale(1)' }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>{mode === 'product' ? 'Product Feedback' : 'Store Feedback'}</label>
                            <textarea required rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder={mode === 'product' ? "What did you like or dislike about this product?" : "How was the website, checkout, and delivery experience?"} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                        </div>

                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem' }}>
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
