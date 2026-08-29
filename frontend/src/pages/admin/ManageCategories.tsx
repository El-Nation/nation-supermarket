import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('📦');
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCats();
    }, []);

    const fetchCats = async (query: string = '') => {
        try {
            const res = await api.get(`/admin/categories${query ? `?search=${encodeURIComponent(query)}` : ''}`);
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
                await api.put(`/admin/categories/${editId}`, { name, icon });
                alert('Category explicitly updated.');
            } else {
                await api.post('/admin/categories', { name, icon });
                alert('Category successfully instantiated.');
            }
            setName('');
            setIcon('📦');
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
        setIcon(c.icon || '📦');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this category? This alters associated product hierarchies.")) return;
        try {
            alert('Deleting categories is restricted pending Product migration rules.');
            fetchCats();
        } catch(e) {
            alert('Error');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#1e293b', margin: 0, fontWeight: 700 }}>Category Management</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', width: '100%' }}>
                <div className="admin-card" style={{ flex: isMobile ? '1 1 100%' : '1', width: '100%', boxSizing: 'border-box' }}>
                    <h3 style={{margin: '0 0 1.5rem 0', color: '#1e293b'}}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Category Descriptor</label>
                                <input type="text" className="form-input" required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Toys" />
                            </div>
                            <div style={{ width: '100px' }}>
                                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Emoji Icon</label>
                                <input type="text" className="form-input" required value={icon} onChange={e=>setIcon(e.target.value)} maxLength={5} style={{ textAlign: 'center', fontSize: '1.25rem', padding: '0.5rem' }} />
                            </div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>Categories</h3>
                        <form onSubmit={(e) => { e.preventDefault(); fetchCats(searchQuery); }} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Search by name, slug..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '200px', padding: '0.5rem' }}
                            />
                            <button type="submit" className="admin-btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
                            {searchQuery && (
                                <button type="button" onClick={() => { setSearchQuery(''); fetchCats(''); }} className="admin-btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '0.5rem 1rem' }}>Clear</button>
                            )}
                        </form>
                    </div>
                    <div style={{overflowX: 'auto'}}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Name</th>
                                    <th>URL Slug</th>
                                    <th>Created On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                            {searchQuery ? 'No results found.' : 'No explicit categories established.'}
                                        </td>
                                    </tr>
                                ) : categories.map(c => (
                                    <tr key={c.id}>
                                        <td style={{ fontSize: '1.5rem', textAlign: 'center' }}>{c.icon || '📦'}</td>
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
