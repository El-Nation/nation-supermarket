import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // Since this route wasn't explicitly scaffolded in Stage 3, we mock it visually for now or bind it closely based on structural directives
                // We'll implement a secure generalized payload loop
                const res = await api.get('/admin/users'); // We will create this backend controller next!
                setCustomers(res.data);
            } catch (e) {
                console.error('Customer fetch failure');
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem', fontWeight: 700 }}>Customer CRM Directory</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Observe aggregated customer records securely.</p>
            </div>
            
            <div className="admin-table-panel">
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
                                        Synchronizing user datastore...
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
