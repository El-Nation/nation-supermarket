import React, { useState, useEffect } from 'react';
import { MessageSquare, Inbox, MailOpen, Send, User, Clock } from 'lucide-react';
import api from '../../services/api';

export default function ManageEnquiries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/enquiries');
            setEnquiries(res.data);
        } catch(e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadEnquiries(); }, []);

    const handleReply = async (id: number) => {
        if(!replyMessage.trim()) return alert("Enter a message.");
        try {
            setSending(true);
            await api.put(`/admin/enquiries/${id}/reply`, { replyMessage });
            alert("Reply successfully physically routed.");
            setReplyingTo(null);
            setReplyMessage('');
            loadEnquiries();
        } catch(e) {
            alert('Failed routing reply.');
        } finally { setSending(false); }
    };

    return (
        <div style={{maxWidth: 1200, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Customer Enquiries</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Secure incoming messages mapped dynamically from the contact cluster.</p>
                </div>
            </div>

            <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <MessageSquare color="#0f172a" size={24} />
                    <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Active Inbox Pipeline</h3>
                </div>
                
                {loading ? (
                    <div style={{padding: '4rem', textAlign: 'center'}}>Syncing database...</div>
                ) : enquiries.length === 0 ? (
                    <div style={{padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'white'}}>
                        <Inbox size={56} color="#cbd5e1" style={{margin: '0 auto 1.5rem', display: 'block'}} />
                        <h4 style={{fontSize: '1.2rem', color: '#334155', margin: '0 0 0.5rem 0'}}>No Pending Customer Enquiries</h4>
                        <p style={{color: '#94a3b8', margin: 0}}>The active database message queue is empty natively.</p>
                    </div>
                ) : (
                    <div style={{ padding: '0' }}>
                        {enquiries.map(enq => (
                            <div key={enq.id} style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', backgroundColor: enq.status === 'new' ? 'white' : '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                            {enq.status === 'new' ? <span style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444'}}></span> : <MailOpen size={16} color="#64748b" />}
                                            {enq.subject || 'No Subject Provided'}
                                        </h4>
                                        <p style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>{enq.message}</p>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {enq.name} ({enq.email})</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(enq.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => setReplyingTo(replyingTo === enq.id ? null : enq.id)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                            {replyingTo === enq.id ? 'Cancel' : 'Reply Directly'}
                                        </button>
                                    </div>
                                </div>
                                
                                {replyingTo === enq.id && (
                                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                                        <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a' }}>Formulate Administrator Reply</h5>
                                        <textarea
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '1rem', minHeight: 100 }}
                                            placeholder="Write your email reply here..."
                                        />
                                        <button disabled={sending} onClick={() => handleReply(enq.id)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Send size={16} /> {sending ? 'Transmitting...' : 'Send Secure Reply'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
