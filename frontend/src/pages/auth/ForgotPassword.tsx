import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', msg: string}>({ type: 'idle', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'idle', msg: '' });
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setStatus({ type: 'success', msg: res.data.message || 'Reset link sent! Check your email.' });
        } catch (error: any) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Invalid email address' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ height: '70px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-1.5rem', marginBottom: '1.5rem' }}>
                    <img src="/logo.png" alt="Nation Supermarket" style={{ height: '220px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<h1 class="auth-title">Nation Supermarket</h1>'; }} />
                </div>
                
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1e293b' }}>Reset Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    Enter your email address and we'll send you a link to securely reset your password.
                </p>

                {status.type === 'error' && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{status.msg}</div>}
                {status.type === 'success' && <div style={{ color: '#0d9488', backgroundColor: '#f0fdfa', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{status.msg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input" placeholder="you@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                    Remembered your password? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}
