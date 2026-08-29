import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function ManageInventory() {
    const [products, setProducts] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async (query: string = '') => {
        try {
            const res = await api.get(`/admin/products${query ? `?search=${encodeURIComponent(query)}` : ''}`);
            setProducts(res.data);
        } catch(e) {
            console.error(e);
        }
    };

    const handleUpdateStock = async (id: number, currentStock: number) => {
        const result = window.prompt("Modify exact stock count available on shelves:", currentStock.toString());
        if(result && !isNaN(Number(result))) {
            try {
                await api.put(`/admin/products/${id}`, { stock_quantity: Number(result) });
                const res = await api.get('/admin/products');
                setProducts(res.data);
            } catch(e) {
                alert('Conflict adjusting constraints.');
            }
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem', fontWeight: 700 }}>Inventory Engine Metrics</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Fast access grid specifically emphasizing availability arrays natively.</p>
            </div>
            
            <div className="admin-table-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Stock Directives</h3>
                    <form onSubmit={(e) => { e.preventDefault(); fetchStock(searchQuery); }} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by product name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '250px', padding: '0.5rem', margin: 0 }}
                        />
                        <button type="submit" className="admin-btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
                        {searchQuery && (
                            <button type="button" onClick={() => { setSearchQuery(''); fetchStock(''); }} className="admin-btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '0.5rem 1rem' }}>Clear</button>
                        )}
                    </form>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Vector</th>
                                <th>Base Pricing</th>
                                <th>Tracked Stock Matrix</th>
                                <th>Availability Status</th>
                                <th>Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                        {searchQuery ? 'No results found.' : 'Connecting stock arrays...'}
                                    </td>
                                </tr>
                            ) : products.map(p => {
                                const isLow = p.stock_quantity < 5 && p.stock_quantity > 0;
                                const isOut = p.stock_quantity <= 0;
                                return (
                                    <tr key={p.id}>
                                        <td style={{fontWeight: 600, color: '#1e293b'}}>{p.name}</td>
                                        <td>₦{Number(p.price).toLocaleString()}</td>
                                        <td style={{fontWeight: 600, color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e', fontSize: '1.1rem'}}>{p.stock_quantity} <span style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 400}}>UNITS</span></td>
                                        <td>
                                            {isOut && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: 500, fontSize: '0.85rem'}}><AlertCircle size={14} /> Out of Stock</span>}
                                            {isLow && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 500, fontSize: '0.85rem'}}><AlertCircle size={14} /> Low Supply</span>}
                                            {!isLow && !isOut && <span style={{color: '#22c55e', fontWeight: 500, fontSize: '0.85rem'}}>Plentiful Access</span>}
                                        </td>
                                        <td>
                                            <button className="btn-action" onClick={() => handleUpdateStock(p.id, p.stock_quantity)}>Resolve Stock</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
