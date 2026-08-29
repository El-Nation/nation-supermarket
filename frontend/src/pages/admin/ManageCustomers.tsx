import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async (query: string = '') => {
        try {
            const res = await api.get(`/admin/users${query ? `?search=${encodeURIComponent(query)}` : ''}`);
                setCustomers(res.data);
            } catch (e) {
                console.error('Customer fetch failure');
            }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem', fontWeight: 700 }}>Customer CRM Directory</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Observe aggregated customer records securely.</p>
            </div>
            
            <div className="admin-table-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Customer Base</h3>
                    <form onSubmit={(e) => { e.preventDefault(); fetchCustomers(searchQuery); }} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by name, email, phone..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '250px', padding: '0.5rem', margin: 0 }}
                        />
                        <button type="submit" className="admin-btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
                        {searchQuery && (
                            <button type="button" onClick={() => { setSearchQuery(''); fetchCustomers(''); }} className="admin-btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '0.5rem 1rem' }}>Clear</button>
                        )}
                    </form>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Direct Contact</th>
                                <th>Authentication Email</th>
                                <th>Registration Span</th>
                                <th>Profile State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                        {searchQuery ? 'No results found.' : 'Synchronizing user datastore...'}
                                    </td>
                                </tr>
                            ) : customers.map(u => (
                                <tr key={u.id}>
                                    <td style={{fontWeight: 600, color: '#1e293b'}}>{u.name}</td>
                                    <td>{u.phone || 'N/A'}</td>
                                    <td>{u.email}</td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${u.account_status === 'active' ? 'status-paid' : 'status-pending'}`}>
                                            {u.account_status.toUpperCase()}
                                        </span>
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
