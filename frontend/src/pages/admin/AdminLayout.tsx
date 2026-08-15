import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    LayoutDashboard, ShoppingBag, PackageSearch, Tags, 
    Users, CreditCard, Receipt, MessageCircle, Bell, 
    Truck, Settings, ExternalLink, LogOut, Menu
} from 'lucide-react';
import './admin.css';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if(user && user.role === 'admin') {
            const fetchNotifs = async () => {
                try {
                    const { default: api } = await import('../../services/api');
                    const res = await api.get('/admin/notifications');
                    setNotifications(res.data);
                    setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
                } catch(e) {}
            };
            fetchNotifs();
            const interval = setInterval(fetchNotifs, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    const closeSidebar = () => setSidebarOpen(false);

    const getNotificationLink = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('enquiry')) return '/admin/enquiries';
        if (lowerTitle.includes('payment') || lowerTitle.includes('order')) return '/admin/payments';
        if (lowerTitle.includes('account') || lowerTitle.includes('customer')) return '/admin/customers';
        return '/admin/notifications';
    };

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            <div 
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-brand">
                    <div className="admin-brand-logo">N</div>
                    <div className="admin-brand-text">Nation<br/>Supermarket</div>
                </div>
                
                <div className="admin-nav-container">
                    <NavLink to="/admin/dashboard" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/orders" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Receipt size={20} /> Orders
                    </NavLink>
                    <NavLink to="/admin/products" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <ShoppingBag size={20} /> All Products
                    </NavLink>
                    <NavLink to="/admin/categories" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Tags size={20} /> Categories
                    </NavLink>
                    <NavLink to="/admin/inventory" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <PackageSearch size={20} /> Inventory
                    </NavLink>
                    <NavLink to="/admin/customers" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Users size={20} /> Customers
                    </NavLink>
                    <NavLink to="/admin/payments" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <CreditCard size={20} /> Payments
                    </NavLink>
                    <NavLink to="/admin/receipts" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Receipt size={20} /> Receipts
                    </NavLink>
                    <NavLink to="/admin/enquiries" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <MessageCircle size={20} /> Enquiries
                    </NavLink>
                    <NavLink to="/admin/notifications" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Bell size={20} /> Notifications
                    </NavLink>
                    <NavLink to="/admin/delivery" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Truck size={20} /> Delivery
                    </NavLink>
                    <NavLink to="/admin/settings" onClick={closeSidebar} className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                        <Settings size={20} /> Settings
                    </NavLink>
                </div>

                <div className="admin-sidebar-footer">
                    <NavLink to="/" className="admin-nav-item" style={{padding: '0.75rem'}}>
                        <ExternalLink size={20} /> View Store
                    </NavLink>
                    <button className="admin-nav-item" onClick={logout} style={{background: 'none', border: 'none', width: '100%', cursor: 'pointer', padding: '0.75rem'}}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-title">
                        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        Welcome back, {user.name.split(' ')[0]} <span>👋</span>
                    </div>
                    <div className="admin-header-actions">
                        <div style={{position: 'relative'}}>
                            <button onClick={() => setShowDropdown(!showDropdown)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', color: 'inherit'}}>
                                <Bell size={22} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4, 
                                        backgroundColor: '#ef4444', color: 'white', 
                                        fontSize: '0.65rem', fontWeight: 'bold', 
                                        borderRadius: '50%', width: 16, height: 16, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {showDropdown && (
                                <div style={{position: 'absolute', top: '120%', right: 0, width: 320, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0', zIndex: 50, overflow: 'hidden'}}>
                                    <div style={{padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc'}}>
                                        <h4 style={{margin: 0, fontSize: '0.9rem', color: '#0f172a'}}>Recent Notifications</h4>
                                    </div>
                                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                                        {notifications.slice(0, 5).map((n) => (
                                            <Link 
                                                key={n.id} 
                                                to={getNotificationLink(n.title)} 
                                                onClick={() => setShowDropdown(false)}
                                                style={{display: 'block', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', backgroundColor: n.is_read ? 'white' : '#eff6ff'}}
                                            >
                                                <div style={{fontWeight: n.is_read ? 500 : 600, color: '#0f172a', fontSize: '0.85rem', marginBottom: '0.2rem'}}>{n.title}</div>
                                                <div style={{color: '#64748b', fontSize: '0.75rem'}}>{new Date(n.created_at).toLocaleString()}</div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div style={{padding: '0.5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc'}}>
                                        <Link to="/admin/notifications" onClick={() => setShowDropdown(false)} style={{fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600}}>View All Notifications</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="admin-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>
                
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
