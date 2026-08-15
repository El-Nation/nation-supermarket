import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import api from '../../services/api';

export default function ContactUs() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSending(true);
            setSuccessMessage('');
            await api.post('/enquiries', formData);
            setSuccessMessage("Your enquiry has been successfully safely securely received natively!");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch(e) {
            alert("Failed transmitting message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '4rem 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>Contact Nation Supermarket</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>Discover optimal delivery scopes natively correctly physically flexibly.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '2.5rem', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 2rem 0' }}>Get in Touch securely</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MapPin color="#38bdf8" />
                                <span>16 Ihama Road Boundary, Benin City</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Mail color="#38bdf8" />
                                <span>eghedestiny10@gmail.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Phone color="#38bdf8" />
                                <span>07066784058</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                        {successMessage && (
                            <div style={{ backgroundColor: '#ecfccb', color: '#4d7c0f', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
                                {successMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Your Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Subject Scope</label>
                                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Message Detail</label>
                                <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            <button disabled={sending} type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#0ea5e9', color: 'white', padding: '1rem', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                                <Send size={20} /> {sending ? 'Transmitting Data...' : 'Submit Message Securely'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
