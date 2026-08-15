import React, { useState, useEffect } from 'react';
import { FileText, Navigation, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function ManageReceipts() {
    const [receipts, setReceipts] = useState<any[]>([]);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const res = await api.get('/admin/receipts');
                setReceipts(res.data);
            } catch (e) {
                console.error("Receipts fetch failure", e);
            }
        };
        fetchReceipts();
    }, []);

    const handleViewReceipt = (payment_reference: string) => {
        window.open(`/receipt/${payment_reference}`, "_blank");
    };

    return (
        <div style={{maxWidth: 1200, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Digital Receipts Archive</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Read-only vault of all cryptographically generated transaction receipts.</p>
                </div>
            </div>
            
            <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <FileText color="#0f172a" size={24} />
                    <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Cryptographic Signature Log</h3>
                </div>
                
                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                        <thead>
                            <tr style={{backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0'}}>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Transaction Ref</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Order ID</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Timestamp</th>
                                <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{textAlign: 'center', color: '#94a3b8', padding: '5rem 2rem'}}>
                                        <FileText size={48} color="#cbd5e1" style={{margin: '0 auto 1rem', display: 'block'}} />
                                        No digital receipts generated yet. Complete a checkout to populate limits natively.
                                    </td>
                                </tr>
                            ) : receipts.map((r, i) => (
                                <tr key={r.id} style={{borderBottom: i === receipts.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                    <td style={{padding: '1rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <CheckCircle2 size={16} /> {r.payment_reference}
                                    </td>
                                    <td style={{padding: '1rem', color: '#475569', fontWeight: 500}}>{r.receipt_data?.order_reference}</td>
                                    <td style={{padding: '1rem', color: '#64748b', fontSize: '0.9rem'}}>
                                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}><Navigation size={12}/>{new Date(r.created_at).toLocaleString()}</div>
                                    </td>
                                    <td style={{padding: '1rem', textAlign: 'right'}}>
                                        <button 
                                            className="admin-btn-primary" 
                                            onClick={() => handleViewReceipt(r.payment_reference)}
                                            style={{backgroundColor: '#0f172a', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
                                        >
                                            <ExternalLink size={14} /> View Signature Document
                                        </button>
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
