import { useState, useEffect } from 'react';
import { BellRing, ShieldCheck, Info } from 'lucide-react';
import api from '../../services/api';

export default function ManageNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/admin/notifications');
                setNotifications(res.data);
            } catch(e) { console.error("Error securely securely securely routing notifications", e); }
            finally { setLoading(false); }
        }
        fetchNotifications();
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/admin/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch(e) { console.error(e); }
    };

    return (
        <div style={{maxWidth: 1200, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>System Notifications</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Global server alerts and infrastructure API health triggers.</p>
                </div>
            </div>

            <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <BellRing color="#0f172a" size={24} />
                    <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Security & Traffic Alerts</h3>
                </div>
                
                {loading ? <div style={{padding: '3rem', textAlign: 'center'}}>Syncing Secure Tunnels...</div> : notifications.length === 0 ? (
                    <div style={{padding: '5rem 2rem', textAlign: 'center', backgroundColor: '#f0fdf4', borderBottom: '1px solid #bbf7d0'}}>
                        <ShieldCheck size={56} color="#10b981" style={{margin: '0 auto 1.5rem', display: 'block'}} />
                        <h4 style={{fontSize: '1.2rem', color: '#065f46', margin: '0 0 0.5rem 0'}}>All Embedded Systems Active</h4>
                        <p style={{color: '#047857', margin: 0}}>No anomalous limits or runtime breaches flagged remotely. Everything is operating natively.</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map(n => (
                            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', backgroundColor: n.is_read ? 'white' : '#eff6ff' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '0.5rem', backgroundColor: n.is_read ? '#f1f5f9' : '#dbeafe', borderRadius: '50%' }}>
                                        <Info size={20} color={n.is_read ? '#64748b' : '#2563eb'} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: n.is_read ? 500 : 700 }}>{n.title}</h4>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.95rem' }}>{n.message}</p>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(n.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                {!n.is_read && (
                                    <button onClick={() => markAsRead(n.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
