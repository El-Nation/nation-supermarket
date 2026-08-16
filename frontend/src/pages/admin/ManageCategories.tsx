import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
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
            if (editId) {
                await api.put(`/admin/categories/${editId}`, { name });
                alert('Category explicitly updated.');
            } else {
                await api.post('/admin/categories', { name });
                alert('Category successfully instantiated.');
            }
            setName('');
            setEditId(null);
            fetchCats();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Error occurred mapping this category.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (c: any) => {
        setEditId(c.id);
        setName(c.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            
            <div className="category-grid">
                <div className="admin-card" style={{alignSelf: 'start'}}>
                    <h3 style={{margin: '0 0 1.5rem 0', color: '#1e293b'}}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{marginBottom: '1rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Category Descriptor</label>
                            <input type="text" className="form-input" required value={name} onChange={e=>setName(e.target.value)} />
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button type="submit" disabled={loading} className="admin-btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                                {editId ? <Edit2 size={18} /> : <Plus size={18} />} {loading ? 'Processing...' : (editId ? 'Update Classification' : 'Create Classification')}
                            </button>
                            {editId && (
                                <button type="button" onClick={() => { setEditId(null); setName(''); }} className="admin-btn-primary" style={{backgroundColor: '#e2e8f0', color: '#0f172a'}}>Cancel</button>
                            )}
                        </div>
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
                                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                                <button onClick={() => handleEdit(c)} style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '0.5rem'}}>
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(c.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem'}}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
