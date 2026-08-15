import React, { useState, useEffect } from 'react';
import { DollarSign, LineChart, ShoppingBag, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get(`/admin/dashboard-analytics?period=${period}`);
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [period]);

    if (loading) return <div style={{display: 'flex', justifyContent: 'center', padding: '5rem'}}><Loader2 className="lucide-spin" size={48} color="#94a3b8" /></div>;

    return (
        <div>
            <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.25rem' }}>Analytics Overview</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Real-time data for global operations</p>
                </div>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
                    <option value="all">All Time</option>
                    <option value="today">Today's Sales</option>
                    <option value="month">This Month</option>
                </select>
            </div>

            <div className="dash-grid">
                <Link to="/admin/payments" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="dash-card">
                        <div className="dash-icon-box icon-red">
                            <DollarSign />
                        </div>
                        <div className="dash-info">
                            <h4>Revenue ({period === 'all' ? 'All Time' : period === 'today' ? 'Today' : 'Month'})</h4>
                            <h2>₦{stats?.totalRevenue?.toLocaleString()}</h2>
                            <p>Click to view payments</p>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/orders" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="dash-card">
                        <div className="dash-icon-box icon-teal">
                            <LineChart />
                        </div>
                        <div className="dash-info">
                            <h4>Today's Sales</h4>
                            <h2>₦{stats?.todaySales?.toLocaleString()}</h2>
                            <p>View today's orders</p>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/orders" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="dash-card">
                        <div className="dash-icon-box icon-purple">
                            <ShoppingBag />
                        </div>
                        <div className="dash-info">
                            <h4>Orders ({period === 'all' ? 'All Time' : period === 'today' ? 'Today' : 'Month'})</h4>
                            <h2>{stats?.totalOrders?.toLocaleString()}</h2>
                            <p>Click to view orders</p>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/orders" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="dash-card">
                        <div className="dash-icon-box icon-yellow">
                            <Clock />
                        </div>
                        <div className="dash-info">
                            <h4>Action Required</h4>
                            <h2>{stats?.pendingOrdersCount?.toLocaleString()}</h2>
                            <p>View pending orders</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Minor extension for Low Stock visualization */}
            {stats?.lowStockCount > 0 && (
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', marginBottom: '2.5rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Clock size={24} /> <strong>Inventory Alert:</strong> You have {stats.lowStockCount} active products with critical low stock (under 5 units).
                </div>
            )}

            <div className="admin-table-panel">
                <div className="admin-table-panel-header">
                    <h3>Recent Orders</h3>
                    <Link to="/admin/orders">
                        <button className="admin-btn-primary" style={{cursor: 'pointer'}}>View All</button>
                    </Link>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order Ref</th>
                                <th>Customer Details</th>
                                <th>Delivery Address</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentOrders?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: '3rem 1rem'}}>
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                stats?.recentOrders?.map((o: any) => (
                                    <tr key={o.id}>
                                        <td><strong>{o.order_reference}</strong><br/><span style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(o.created_at).toLocaleString()}</span></td>
                                        <td>{o.customer_name || 'Guest User'}<br/><span style={{color: '#ff6b6b'}}>{o.customer_phone || '-'}</span></td>
                                        <td style={{maxWidth: '200px', alignContent: 'center'}}>{o.delivery_type === 'store_pickup' ? <strong>Store Pickup</strong> : <span style={{fontSize: '0.9rem'}}>{o.delivery_address}</span>}</td>
                                        <td style={{fontWeight: 600}}>₦{Number(o.total_amount).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${o.payment_status === 'paid' ? 'status-paid' : 'status-pending'}`} style={{display: 'block', marginBottom: '0.25rem', textAlign: 'center'}}>
                                                {o.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td><button className="btn-action">Prepare</button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
