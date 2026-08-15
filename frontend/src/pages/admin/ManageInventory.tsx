import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function ManageInventory() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await api.get('/admin/products');
                setProducts(res.data);
            } catch(e) {
                console.error(e);
            }
        };
        fetchStock();
    }, []);

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
                                        Connecting stock arrays...
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
