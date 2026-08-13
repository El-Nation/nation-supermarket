import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';

export default function Login() {
    const { login, setGuestMode } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.requires2FA) {
                // Future implementation: show 2FA prompt for admin instead of auto login
                alert('Admin 2FA requires specialized prompt (coming soon)');
                return;
            }
            login(res.data);
            navigate('/dashboard'); // Route to be created in Stage 4/5
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    const handleGuest = () => {
        setGuestMode(true);
        navigate('/shop'); // Future shop route
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Nation Supermarket</h1>
                <p className="auth-subtitle">Sign in to your account</p>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input" placeholder="you@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required className="form-input" placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    
                    <button type="submit" className="btn-primary">Sign In</button>
                    
                    <button type="button" onClick={handleGuest} className="btn-guest">
                        <UserCircle2 size={18} />
                        Continue as Guest
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one here</Link>
                </div>
            </div>
        </div>
    );
}
