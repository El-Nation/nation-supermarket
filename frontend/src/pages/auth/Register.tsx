import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', { name, email, password, phone });
            login(res.data);
            navigate('/dashboard'); 
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Crop Box Wrapper to forcefully chop off empty PNG whitespace */}
                <div style={{ height: '70px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-1.5rem', marginBottom: '1.5rem' }}>
                    <img src="/logo.png" alt="Nation Supermarket" style={{ height: '220px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<h1 class="auth-title">Join Nation Supermarket</h1>'; }} />
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" required className="form-input" placeholder="John Doe"
                            value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" required className="form-input" placeholder="you@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" required className="form-input" placeholder="08012345678"
                            value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required className="form-input" placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    
                    <button type="submit" className="btn-primary">Create Account</button>
                    
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}
