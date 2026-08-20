import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, User, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } catch(e) {
                console.error("Orders fetching rejection:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{maxWidth: 1200, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Order Management</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Process logistics and track cart deliveries routing actively.</p>
                </div>
            </div>

            <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <Package color="#0f172a" size={24} />
                    <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Active Checkout Queue</h3>
                </div>
                
                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                        <thead>
                            <tr style={{backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0'}}>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Order Ref</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date & Time</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Client Target</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location (Matrix)</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Total (₦)</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Gateway Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: '5rem 2rem'}}>
                                        <div className="admin-spinner" style={{width: 32, height: 32, borderColor: '#0f172a', borderTopColor: 'transparent', margin: '0 auto 1rem'}}></div>
                                        Gathering active orders from PostgreSQL backend...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: '5rem 2rem'}}>
                                        <ShoppingCart size={48} color="#cbd5e1" style={{margin: '0 auto 1rem', display: 'block'}} />
                                        No active orders generated natively yet. Create one via Checkout Simulator.
                                    </td>
                                </tr>
                            ) : orders.map((o, i) => {
                                const guestData = o.guest_data ? (typeof o.guest_data === 'string' ? JSON.parse(o.guest_data) : o.guest_data) : null;
                                const customerName = o.registered_customer_name || (guestData?.name) || 'Anonymous';
                                
                                return (
                                    <tr key={o.id} style={{borderBottom: i === orders.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                        <td style={{padding: '1rem', fontWeight: 700, color: '#0ea5e9', fontSize: '0.95rem'}}>{o.order_reference}</td>
                                        <td style={{padding: '1rem', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                                            {o.created_at ? new Date(o.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                        </td>
                                        <td style={{padding: '1rem', fontWeight: 600, color: '#1e293b'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><User size={14} color="#64748b"/> {customerName}</div>
                                        </td>
                                        <td style={{padding: '1rem', color: '#475569', fontSize: '0.9rem'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                {o.delivery_type === 'store_pickup' ? <MapPin size={14} color="#64748b" /> : <Truck size={14} color="#64748b" />}
                                                {o.delivery_type === 'store_pickup' ? 'Store Pickup (Walk-in)' : (o.delivery_address || 'Unspecified Address')}
                                            </div>
                                        </td>
                                        <td style={{padding: '1rem', fontWeight: 700, color: '#1e293b'}}>₦{Number(o.total_amount).toLocaleString()}</td>
                                        <td style={{padding: '1rem'}}>
                                            <span style={{
                                                fontSize: '0.75rem', 
                                                textTransform: 'uppercase', 
                                                fontWeight: 700, 
                                                letterSpacing: '0.5px',
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                color: o.payment_status === 'paid' ? '#047857' : '#b45309',
                                                padding: '4px 8px', borderRadius: '4px', background: o.payment_status === 'paid' ? '#d1fae5' : '#fef3c7'
                                            }}>
                                                {o.payment_status === 'paid' && <CheckCircle2 size={12} />}
                                                {o.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
