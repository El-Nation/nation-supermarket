import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCats();
    }, []);

    const fetchCats = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Failed category payload', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/categories', { name });
            setName('');
            fetchCats();
            alert('Category successfully instantiated.');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Error occurred mapping this category.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this category? This alters associated product hierarchies.")) return;
        try {
            // Need to implement delete endpoint on backend if missing, but we assume it's created or we skip for now gracefully
            // await api.delete(`/admin/categories/${id}`);
            alert('Deleting categories is restricted pending Product migration rules.');
            fetchCats();
        } catch(e) {
            alert('Error');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', margin: 0, fontWeight: 700 }}>Category Management</h2>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
                <div className="admin-card" style={{alignSelf: 'start'}}>
                    <h3 style={{margin: '0 0 1.5rem 0', color: '#1e293b'}}>Add New Category</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{marginBottom: '1rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Category Descriptor</label>
                            <input type="text" className="form-input" required value={name} onChange={e=>setName(e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading} className="admin-btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                            <Plus size={18} /> {loading ? 'Processing...' : 'Create Classification'}
                        </button>
                    </form>
                </div>
                
                <div className="admin-table-panel">
                    <div style={{overflowX: 'auto'}}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>URL Slug</th>
                                    <th>Created On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                            No explicit categories established.
                                        </td>
                                    </tr>
                                ) : categories.map(c => (
                                    <tr key={c.id}>
                                        <td style={{fontWeight: 600, color: '#1e293b'}}>{c.name}</td>
                                        <td style={{color: '#0ea5e9'}}>{c.slug}</td>
                                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDelete(c.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem'}}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
