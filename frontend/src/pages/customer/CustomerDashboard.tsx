import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { User, LogOut, Package, Heart, Shield, Settings, CheckCircle2 } from 'lucide-react';

export default function CustomerDashboard() {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    
    const [orders, setOrders] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profileStatus, setProfileStatus] = useState('');

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passStatus, setPassStatus] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || '');
            fetchOrders();
            fetchWishlist();
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/user/orders');
            setOrders(res.data);
        } catch(e) { console.error("Error fetching orders securely."); }
    };

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/user/wishlist');
            setWishlist(res.data);
        } catch(e) { console.error("Error securely matching wishlist."); }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/user/profile', { name, email, phone });
            updateUser({ name, email, phone });
            setProfileStatus('Profile securely modified natively.');
            setTimeout(() => setProfileStatus(''), 3000);
        } catch (error) {
            setProfileStatus('Error modifying profile logic.');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newPass !== confirmPass) return setPassStatus("New passwords mismatch structurally!");
        try {
            await api.post('/user/password', { current_password: currentPass, new_password: newPass, confirm_password: confirmPass });
            setPassStatus('Password completely updated and formally routed successfully.');
            setCurrentPass(''); setNewPass(''); setConfirmPass('');
            setTimeout(() => setPassStatus(''), 4000);
        } catch(error: any) {
            setPassStatus(error.response?.data?.message || 'Failed applying secure password matrices.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const removeFromWishlist = async (id: number) => {
        try {
            await api.delete(`/user/wishlist/${id}`);
            fetchWishlist();
        } catch (e) { console.error(e); }
    };

    if (!user || user.role === 'admin') return null;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Header Navigation */}
            <header style={{ backgroundColor: '#0f172a', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>NATION SUPERMARKET</h1>
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Welcome back, <strong>{user.name.split(' ')[0]}</strong></span>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #334155', color: '#f1f5f9', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s', fontWeight: 600 }}>
                        <LogOut size={16} /> Logout
                    </button>
                </nav>
            </header>

            <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: '2rem' }}>
                
                {/* Sidebar Isolation Segment */}
                <aside style={{ width: '250px', flexShrink: 0 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem 1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <button onClick={() => setActiveTab('overview')} style={getTabStyle(activeTab === 'overview')}><User size={18}/> Account Overview</button>
                        <button onClick={() => setActiveTab('orders')} style={getTabStyle(activeTab === 'orders')}><Package size={18}/> Order History</button>
                        <button onClick={() => setActiveTab('wishlist')} style={getTabStyle(activeTab === 'wishlist')}><Heart size={18}/> My Wishlist</button>
                        <button onClick={() => setActiveTab('profile')} style={getTabStyle(activeTab === 'profile')}><Settings size={18}/> Profile Settings</button>
                        <button onClick={() => setActiveTab('security')} style={getTabStyle(activeTab === 'security')}><Shield size={18}/> Account Security</button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main style={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    
                    {activeTab === 'overview' && (
                        <div>
                            <h2 style={{marginTop: 0, color: '#1e293b'}}>Account Overview</h2>
                            <p style={{color: '#64748b', marginBottom: '2rem'}}>Quick glance at your active integrations.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                                    <Package size={24} color="#0f172a" style={{marginBottom: '0.5rem'}}/>
                                    <div style={{fontSize: '1.5rem', fontWeight: 800}}>{orders.length}</div>
                                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>Total Orders</div>
                                </div>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                                    <Heart size={24} color="#ef4444" style={{marginBottom: '0.5rem'}}/>
                                    <div style={{fontSize: '1.5rem', fontWeight: 800}}>{wishlist.length}</div>
                                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>Wishlist Items</div>
                                </div>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                                    <CheckCircle2 size={24} color="#10b981" style={{marginBottom: '0.5rem'}}/>
                                    <div style={{fontSize: '1.5rem', fontWeight: 800}}>Verified</div>
                                    <div style={{fontSize: '0.85rem', color: '#64748b'}}>Account Status</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{marginTop: 0, color: '#1e293b'}}>Order History</h2>
                            {orders.length === 0 ? (
                                <p style={{color: '#64748b'}}>No orders resolved to your active identity yet.</p>
                            ) : (
                                <div style={{display: 'grid', gap: '1rem'}}>
                                    {orders.map((o, i) => (
                                        <div key={i} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div>
                                                <div style={{fontWeight: 700, color: '#334155', marginBottom: '0.2rem'}}>{o.order_reference}</div>
                                                <div style={{color: '#64748b', fontSize: '0.85rem', marginBottom: '0.2rem'}}>{new Date(o.created_at).toLocaleDateString()}</div>
                                                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem'}}>
                                                    <span style={{background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600}}>{o.order_status}</span>
                                                    <span style={{background: o.payment_status === 'Paid' ? '#dcfce7' : '#fef9c3', color: o.payment_status === 'Paid' ? '#166534' : '#854d0e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600}}>{o.payment_status}</span>
                                                </div>
                                            </div>
                                            <div style={{textAlign: 'right'}}>
                                                <div style={{fontWeight: 800, fontSize: '1.25rem', color: '#0f172a'}}>₦{o.total_amount.toLocaleString()}</div>
                                                <Link to={`/receipt/${o.order_reference}`} target="_blank" style={{color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600}}>View Receipt &rarr;</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div>
                            <h2 style={{marginTop: 0, color: '#1e293b'}}>My Wishlist</h2>
                            <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Favorites formally pinned to your account securely.</p>
                            {wishlist.length === 0 ? <p style={{color: '#94a3b8'}}>No products dynamically mapped to your wishlist.</p> : (
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
                                    {wishlist.map(w => (
                                        <div key={w.product_id} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem'}}>
                                            <div style={{fontWeight: 700, color: '#334155'}}>{w.name}</div>
                                            <div style={{color: '#0f172a', fontWeight: 800, marginTop: '0.25rem'}}>₦{w.price.toLocaleString()}</div>
                                            <button onClick={() => removeFromWishlist(w.product_id)} style={{marginTop: '1rem', width: '100%', padding: '0.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'}}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div style={{maxWidth: '500px'}}>
                            <h2 style={{marginTop: 0, color: '#1e293b'}}>Profile Settings</h2>
                            {profileStatus && <div style={{padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600}}>{profileStatus}</div>}
                            <form onSubmit={handleProfileUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>Full Name</label>
                                    <input required type="text" value={name} onChange={e=>setName(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>Email Address</label>
                                    <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>Phone Number</label>
                                    <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <button type="submit" style={{padding: '0.75rem', background: '#0f172a', color: 'white', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', width: 'fit-content'}}>Save Identity Changes</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={{maxWidth: '500px'}}>
                            <h2 style={{marginTop: 0, color: '#1e293b'}}>Account Security</h2>
                            <p style={{color: '#64748b', fontSize: '0.9rem'}}>Modify your core encryption passwords safely here.</p>
                            {passStatus && <div style={{padding: '0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600}}>{passStatus}</div>}
                            <form onSubmit={handlePasswordUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>Current Password</label>
                                    <input required type="password" value={currentPass} onChange={e=>setCurrentPass(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>New Password</label>
                                    <input required type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600}}>Confirm New Password</label>
                                    <input required type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} style={{width: '95%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1'}} />
                                </div>
                                <button type="submit" style={{padding: '0.75rem', background: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', width: 'fit-content'}}>Change Password</button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Utility
const getTabStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.85rem 1rem',
    background: isActive ? '#f1f5f9' : 'transparent',
    color: isActive ? '#0f172a' : '#64748b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left' as 'left',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 500,
    marginBottom: '0.25rem'
});
