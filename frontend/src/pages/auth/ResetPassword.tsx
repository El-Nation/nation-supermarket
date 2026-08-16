import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<{type: 'idle' | 'loading' | 'success' | 'error', msg: string}>({ type: 'idle', msg: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
            return;
        }

        setStatus({ type: 'loading', msg: 'Resetting password...' });
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setStatus({ type: 'success', msg: 'Password successfully updated.' });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Invalid or expired token.' });
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Invalid Request</h2>
                    <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>No reset token provided.</p>
                    <Link to="/forgot-password" style={{ color: '#0d9488', textDecoration: 'underline' }}>Request a new reset link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ height: '70px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-1.5rem', marginBottom: '1.5rem' }}>
                    <img src="/logo.png" alt="Nation Supermarket" style={{ height: '220px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<h1 class="auth-title">Nation Supermarket</h1>'; }} />
                </div>
                
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' }}>Create New Password</h2>

                {status.type === 'error' && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{status.msg}</div>}
                {status.type === 'success' && <div style={{ color: '#0d9488', backgroundColor: '#f0fdfa', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{status.msg} Redirecting to login...</div>}

                {status.type !== 'success' && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" required className="form-input" placeholder="••••••••"
                                value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={status.type === 'loading'} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" required className="form-input" placeholder="••••••••"
                                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={status.type === 'loading'} />
                        </div>
                        
                        <button type="submit" className="btn-primary" disabled={status.type === 'loading'}>
                            {status.type === 'loading' ? 'Saving...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
