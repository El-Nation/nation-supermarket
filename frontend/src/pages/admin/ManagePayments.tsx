import React, { useState, useEffect } from 'react';
import { CreditCard, Activity, CheckCircle2, Navigation } from 'lucide-react';
import api from '../../services/api';

export default function ManagePayments() {
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
             const res = await api.get('/admin/payments');
             setPayments(res.data);
        };
        fetchPayments();
    }, []);

    return (
        <div style={{maxWidth: 1200, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Payment Gateway Records</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Comprehensive visualization of all secure Paystack transactions.</p>
                </div>
            </div>
            
            <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <CreditCard color="#0f172a" size={24} />
                    <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Cryptographic Settlement Vault</h3>
                </div>
                
                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                        <thead>
                            <tr style={{backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0'}}>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Gateway Hash</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Order Scope</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Amount Confirmed</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Status Vector</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{textAlign: 'center', color: '#94a3b8', padding: '5rem 2rem'}}>
                                        <Activity size={48} color="#cbd5e1" style={{margin: '0 auto 1rem', display: 'block'}} />
                                        No active payments mapped recursively.
                                    </td>
                                </tr>
                            ) : payments.map((p, i) => (
                                <tr key={p.id} style={{borderBottom: i === payments.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                    <td style={{padding: '1rem', fontWeight: 600, color: '#0ea5e9'}}>{p.payment_reference}</td>
                                    <td style={{padding: '1rem', color: '#475569'}}>{p.order_id}</td>
                                    <td style={{padding: '1rem', fontWeight: 800, color: '#1e293b'}}>₦{Number(p.amount).toLocaleString()}</td>
                                    <td style={{padding: '1rem'}}>
                                        <span style={{
                                            fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, 
                                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                            color: '#047857', padding: '4px 8px', borderRadius: '4px', background: '#d1fae5'
                                        }}>
                                            <CheckCircle2 size={12} /> {p.payment_status}
                                        </span>
                                    </td>
                                    <td style={{padding: '1rem', color: '#64748b', fontSize: '0.9rem'}}>
                                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}><Navigation size={12}/>{new Date(p.created_at).toLocaleString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
