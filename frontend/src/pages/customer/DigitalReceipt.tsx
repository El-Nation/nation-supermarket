import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function DigitalReceipt() {
    const { reference } = useParams();
    const [receipt, setReceipt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getReceiptMap = async () => {
            try {
                const res = await api.get(`/receipt/${reference}`); // Our new public route!
                setReceipt(res.data);
            } catch(e) {
                console.error("Receipt loading failed", e);
            } finally {
                setLoading(false);
            }
        };
        getReceiptMap();
    }, [reference]);

    if(loading) return <div style={{padding: '5rem', textAlign: 'center', fontFamily: 'sans-serif'}}>Compiling Receipt Data Map...</div>;
    
    // Exact rendering of the visual error state if undefined
    if(!receipt) return <div style={{padding: '5rem', textAlign: 'center', color: '#ef4444', fontFamily: 'sans-serif'}}>Receipt reference unresolved or payment pending verification. <br/><br/><Link to="/checkout-test" style={{color: '#0f172a'}}>Back to Simulation</Link></div>;

    const formattedDate = new Date(receipt.date).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', '');

    const isPickup = receipt.fulfilment_method === 'store_pickup';

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
            
            <button onClick={() => window.print()} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>🖨️ Print Receipt</button>

            <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '8px', padding: '1.25rem 1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', position: 'relative' }}>
                
                {/* Header Sequence */}
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                    <h1 style={{ color: '#ef4444', margin: 0, fontSize: '1.3rem', letterSpacing: '1px', fontWeight: 800 }}>NATION SUPERMARKET</h1>
                    <p style={{ margin: '0.15rem 0', color: '#334155', fontSize: '1rem', fontWeight: 600 }}>Official Digital Receipt</p>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>{isPickup ? receipt.pickup_location : 'Online Delivery Ecosystem'}</p>
                </div>

                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '0.5rem 0 1rem' }}></div>

                {/* Customer Matrix Data */}
                <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px dotted #e2e8f0' }}>
                        <span style={{ color: '#475569' }}>Order Reference:</span>
                        <span style={{ color: '#ef4444', letterSpacing: '1px' }}>{receipt.order_reference}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px dotted #e2e8f0' }}>
                        <span style={{ color: '#475569' }}>Date:</span>
                        <span style={{ color: '#334155' }}>{formattedDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px dotted #e2e8f0' }}>
                        <span style={{ color: '#475569' }}>Customer:</span>
                        <span style={{ color: '#334155' }}>{receipt.customer.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px dotted #e2e8f0' }}>
                        <span style={{ color: '#475569' }}>Phone:</span>
                        <span style={{ color: '#ef4444' }}>{receipt.customer.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px dotted #e2e8f0' }}>
                        <span style={{ color: '#475569' }}>Email:</span>
                        <span style={{ color: '#334155' }}>{receipt.customer.email}</span>
                    </div>
                </div>

                {/* Items Architecture */}
                <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>ITEMS PURCHASED</h3>
                    
                    <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                        {receipt.items.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                       {item.image ? (
                                           <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                       ) : (
                                           <span style={{ fontSize: '0.5rem', color: '#94a3b8' }}>IMG</span>
                                       )}
                                    </div>
                                    <div>
                                        <div style={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.1rem' }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Qty: {item.quantity} × ₦{item.unit_price.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>
                                    ₦{item.item_total.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'grid', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem' }}>
                                <span>Subtotal</span>
                                <span>₦{receipt.subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem' }}>
                                <span>Delivery Fee</span>
                                <span style={{ color: isPickup ? '#10b981' : '#64748b', fontWeight: isPickup ? 700 : 'normal' }}>
                                    {isPickup ? 'FREE (Pickup)' : `₦${receipt.delivery_fee.toLocaleString()}`}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
                                <span>Total Paid</span>
                                <span style={{ color: '#ef4444' }}>₦{receipt.total_paid.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Target Area */}
                <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>{isPickup ? 'PICKUP LOCATION' : 'DELIVERY ADDRESS'}</h3>
                    <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem' }}>
                        {isPickup ? `Store Pickup – ${receipt.pickup_location}` : receipt.delivery_address}
                    </p>
                </div>

                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '1rem 0' }}></div>

                {/* Validation Footer Token */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, backgroundColor: '#10b981', borderRadius: '50%', marginBottom: '0.25rem' }}>
                        <CheckCircle2 color="white" size={14} />
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>Payment verified via Paystack • NATION SUPERMARKET © {new Date().getFullYear()}</p>
                </div>
            </div>
            
            <style>{`
                @media print {
                    body { background: white !important; }
                    button { display: none !important; }
                    .receipt-boundary { box-shadow: none !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    );
}
