import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Map, Navigation, Power, PowerOff } from 'lucide-react';
import api from '../../services/api';

export default function ManageDelivery() {
    const [zones, setZones] = useState<any[]>([]);
    
    // Form States
    const [name, setName] = useState('');
    const [areas, setAreas] = useState('');
    const [fee, setFee] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const res = await api.get('/admin/delivery');
            setZones(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/admin/delivery', { name, areas, fee: Number(fee) });
            setName('');
            setAreas('');
            setFee('');
            fetchZones();
            alert('Zone incorporated accurately into delivery vectors.');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failure mapping route.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/admin/delivery/${id}`, { status: newStatus });
            fetchZones();
        } catch (e) {
            alert('Status sync failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Remove delivery route? Customers physically in this zone will no longer see explicit routing costs.")) return;
        try {
            await api.delete(`/admin/delivery/${id}`);
            fetchZones();
        } catch (e) {
            alert('Delete rejected');
        }
    };

    return (
        <div style={{maxWidth: 1100, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Delivery Network & Zones</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Construct geometric regional hubs controlling dynamic checkout rate dependencies natively.</p>
                </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start'}}>
                
                {/* Create Form Card */}
                <div className="admin-card" style={{padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                        <Map color="#0f172a" size={24} />
                        <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.2rem'}}>Append Routing Hub</h3>
                    </div>
                    
                    <form onSubmit={handleCreate} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                        <div>
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                Target Zone Alias
                            </label>
                            <input type="text" className="form-input" required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Zone 1" style={{backgroundColor: '#f8fafc', borderColor: '#cbd5e1'}} />
                        </div>

                        <div>
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                Explicit Geographic Areas (CSV)
                            </label>
                            <textarea className="form-input" required rows={3} value={areas} onChange={e=>setAreas(e.target.value)} placeholder="Ugbowo, Uselu, Isihor, Ring Road..." style={{backgroundColor: '#f8fafc', borderColor: '#cbd5e1', resize: 'none'}} />
                            <small style={{display: 'block', color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.8rem'}}>Renders explicitly onto customer MockCheckout string inputs visually.</small>
                        </div>

                        <div>
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                Routing Fee (NGN)
                            </label>
                            <input type="number" className="form-input" required value={fee} onChange={e=>setFee(e.target.value)} placeholder="3000" style={{backgroundColor: '#f8fafc', borderColor: '#cbd5e1'}} />
                        </div>

                        <div style={{marginTop: '0.5rem'}}>
                            <button type="submit" disabled={isSaving} className="admin-btn-primary" style={{width: '100%', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                                <Plus size={18} /> {isSaving ? 'Compiling...' : 'Construct Geographic Node'}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Table Data Panel */}
                <div className="admin-card" style={{padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                    <div style={{padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <Navigation color="#0f172a" size={24} />
                        <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Active Network Paths</h3>
                    </div>
                    
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                            <thead>
                                <tr style={{backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0'}}>
                                    <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Vector Identifers</th>
                                    <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Routing Extents</th>
                                    <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Pricing Limit</th>
                                    <th style={{padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Constraints</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zones.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{textAlign: 'center', color: '#94a3b8', padding: '4rem 2rem'}}>
                                            No explicit geographic vectors generated natively.
                                        </td>
                                    </tr>
                                ) : zones.map((z, i) => (
                                    <tr key={z.id} style={{borderBottom: i === zones.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                        <td style={{padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.95rem'}}>{z.name}</td>
                                        <td style={{padding: '1rem', color: '#475569', fontSize: '0.9rem', maxWidth: 200, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box'}}>
                                            {z.areas || 'N/A'}
                                        </td>
                                        <td style={{padding: '1rem', fontWeight: 700, color: '#1e293b'}}>₦{Number(z.fee).toLocaleString()}</td>
                                        <td style={{padding: '1rem'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                <button 
                                                    onClick={() => handleToggleStatus(z.id, z.status)}
                                                    style={{
                                                        background: z.status === 'active' ? '#10b981' : '#f1f5f9', 
                                                        color: z.status === 'active' ? 'white' : '#64748b',
                                                        border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', 
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                        fontSize: '0.8rem', fontWeight: 600
                                                    }}
                                                    title={z.status === 'active' ? 'Deactivate Mapping' : 'Activate Mapping'}
                                                >
                                                    {z.status === 'active' ? <Power size={14} /> : <PowerOff size={14} />} 
                                                    {z.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(z.id)} 
                                                    style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem'}}
                                                    title="Permanently Delete Network Vector"
                                                >
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
