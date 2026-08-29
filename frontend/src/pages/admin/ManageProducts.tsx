import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [catId, setCatId] = useState('');
    const [desc, setDesc] = useState('');
    const [images, setImages] = useState<FileList | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (query: string = '') => {
        try {
            const [pRes, cRes] = await Promise.all([
                api.get(`/admin/products${query ? `?search=${encodeURIComponent(query)}` : ''}`),
                api.get('/admin/categories')
            ]);
            setProducts(pRes.data);
            setCategories(cRes.data);
        } catch (e) {
            console.error('Failed fetching data', e);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stock_quantity', stock);
            formData.append('category_id', catId);
            formData.append('description', desc);
            formData.append('status', 'active');
            
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
            }

            if (editId) {
                await api.put(`/admin/products/${editId}/full`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Product carefully aligned globally.');
            } else {
                await api.post('/admin/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Product successfully managed globally.');
            }
            
            setEditId(null);
            setName(''); setPrice(''); setStock(''); setCatId(''); setDesc(''); setImages(null);
            
            fetchData();
        } catch (error) {
            alert('Cloudinary or API rejection.');
        } finally {
            setUploading(false);
        }
    };
    
    const handleEdit = (p: any) => {
        setEditId(p.id);
        setName(p.name || '');
        setPrice(p.price || '');
        setStock(p.stock_quantity || '');
        setCatId(p.category_id || '');
        setDesc(p.description || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleDelete = async (id: number) => {
        if (!window.confirm("Permanently remove this item from the catalog?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchData();
        } catch(e) {
            alert('Error deleting');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#1e293b', margin: 0, fontWeight: 700 }}>Product Management</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', width: '100%' }}>
                <div className="admin-card" style={{ flex: isMobile ? '1 1 100%' : '1', width: '100%', boxSizing: 'border-box' }}>
                    <h3 style={{margin: '0 0 1.5rem 0', color: '#1e293b'}}>Add New Product</h3>
                    <form onSubmit={handleCreateProduct}>
                        <div style={{marginBottom: '1rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Product Name</label>
                            <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                            <div>
                                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Base Price (₦)</label>
                                <input type="number" className="form-input" required value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div>
                                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Stock Qty</label>
                                <input type="number" className="form-input" required value={stock} onChange={e => setStock(e.target.value)} />
                            </div>
                        </div>
                        <div style={{marginBottom: '1rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Category</label>
                            <select className="form-input" required value={catId} onChange={e => setCatId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{marginBottom: '1rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Description (Detailed)</label>
                            <textarea className="form-input" rows={8} placeholder="Enter full specifications, features, and rich details here..." value={desc} onChange={e => setDesc(e.target.value)} />
                        </div>
                        <div style={{marginBottom: '1.5rem'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Cloudinary Images</label>
                            <input type="file" multiple accept="image/*" className="form-input" onChange={e => setImages(e.target.files)} />
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button type="submit" disabled={uploading} className="admin-btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                                {editId ? <Edit2 size={18} /> : <Plus size={18} />} {uploading ? 'Negotiating Cloud Upload...' : (editId ? 'Update Product' : 'Publish Product')}
                            </button>
                            {editId && (
                                <button type="button" onClick={() => { 
                                    setEditId(null); 
                                    setName(''); setPrice(''); setStock(''); setCatId(''); setDesc(''); setImages(null); 
                                }} className="admin-btn-primary" style={{backgroundColor: '#e2e8f0', color: '#0f172a'}}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-table-panel" style={{alignSelf: 'start'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>Product Directory</h3>
                        <form onSubmit={(e) => { e.preventDefault(); fetchData(searchQuery); }} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Search products, SKUs..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '250px', padding: '0.5rem' }}
                            />
                            <button type="submit" className="admin-btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
                            {searchQuery && (
                                <button type="button" onClick={() => { setSearchQuery(''); fetchData(''); }} className="admin-btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '0.5rem 1rem' }}>Clear</button>
                            )}
                        </form>
                    </div>
                    <div style={{overflowX: 'auto'}}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Img</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                            {searchQuery ? 'No results found.' : 'No products available in this namespace.'}
                                        </td>
                                    </tr>
                                ) : products.map(p => {
                                    const imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
                                    return (
                                        <tr key={p.id}>
                                            <td>{imgs[0] ? <img src={imgs[0]} alt="img" style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 8}}/> : '-'}</td>
                                            <td style={{fontWeight: 600, color: '#1e293b'}}>{p.name}</td>
                                            <td>{p.category_name || '-'}</td>
                                            <td>₦{Number(p.price).toLocaleString()}</td>
                                            <td style={{color: p.stock_quantity < 5 ? '#f43f5e' : 'inherit'}}>{p.stock_quantity}</td>
                                            <td>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <button onClick={() => handleEdit(p)} style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '0.5rem'}}>
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem'}}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
