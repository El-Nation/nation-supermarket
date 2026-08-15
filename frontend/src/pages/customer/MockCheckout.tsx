import React, { useState, useEffect } from 'react';
import api from '../../services/api';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function MockCheckout() {
    const [zones, setZones] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [deliveryType, setDeliveryType] = useState('store_pickup');
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [address, setAddress] = useState('');

    const customer = { name: 'Demo Shopper', email: 'demo@gmail.com', phone: '08123456789' };

    useEffect(() => {
        // Load external JS seamlessly
        const script = document.createElement('script');
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.body.appendChild(script);

        const fetchInit = async () => {
            try {
                const [zRes, pRes] = await Promise.all([
                    api.get('/admin/delivery'),
                    api.get('/admin/products')
                ]);
                setZones(zRes.data);
                // Just snag 2 products simulating an active cart
                setProducts(pRes.data.slice(0, 2));
                setLoading(false);
            } catch(e) {
                console.error(e);
            }
        };
        fetchInit();
    }, []);

    const selectedFee = deliveryType === 'delivery' 
        ? Number(zones.find(z => z.id === Number(selectedZone))?.fee || 0)
        : 0;

    const locationOptions = zones.flatMap(z => {
        const sourceString = z.areas || z.name;
        // Split by comma, slash, or -> 
        const splits = sourceString.split(/[\/,]|->/);
        const cleaned = splits.map((s: string) => s.trim().replace(/\s*axis\s*/i, ' ').replace(/\s*\(Specific\)/i, '').trim()).filter((s: string) => s.length > 0);
        return cleaned.map((c: string) => ({
            id: z.id,
            label: c,
            zoneName: z.name.replace(/\s*\(Specific\)/i, ''),
            fee: z.fee
        }));
    });

    const subtotal = products.reduce((acc, p) => acc + (Number(p.price) * 1), 0);
    const total = subtotal + selectedFee;

    const executeCheckoutFlow = async () => {
        if(deliveryType === 'delivery' && (!selectedZone || !address)) return alert('Select zone and address.');

        try {
            // 1. Generate local backend order
            const rInit = await api.post('/admin/payments/mock-order', {
                delivery_type: deliveryType,
                delivery_zone_id: selectedZone || null,
                delivery_address: address,
                items: products.map(p => ({ product_id: p.id, quantity: 1 })),
                customer
            });

            const { order_id, amount } = rInit.data;

            // 2. Negotiate Paystack URL (we use Inline popup for seamless React control)
            const pInit = await api.post('/admin/payments/initialize', {
                order_id,
                email: customer.email,
                amount: amount
            });

            // 3. Mount popup natively
            const handler = window.PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // Needs VITE env mapping or works directly if provided 
                // We'll fall back to init data securely provided by backend or standard auth mechanisms inline.
                // Wait, if we use the backend init, we can just use the popup natively:
                access_code: pInit.data.data.access_code,
                email: customer.email,
                amount: amount * 100,
                metadata: {
                    order_id: order_id
                },
                callback: function(response: any) {
                    (async () => {
                        try {
                            const verified = await api.post('/admin/payments/verify', { reference: response.reference });
                            // Redirect dynamically to premium receipt page
                            window.location.href = `/receipt/${response.reference}`;
                        } catch(e: any) {
                            console.error("DEBUG CRASH TRACE:", e);
                            alert("CRITICAL CHECKOUT CRASH: " + (e.message || "Unknown error") + " | DATA: " + JSON.stringify(e.response?.data || {}));
                        }
                    })();
                },
                onClose: function(){
                    alert('Transaction popup closed gracefully.');
                }
            });
            handler.openIframe();
        } catch(e: any) {
            alert('Simulation error: ' + (e.response?.data?.message || e.message));
        }
    };

    if(loading) return <div style={{padding: '5rem', textAlign: 'center'}}>Initializing Simulation Engine...</div>;
    if(products.length === 0) return <div style={{padding: '5rem'}}>No products in Database. Add a product in Admin Dashboard first!</div>;

    return (
        <div style={{ maxWidth: 800, margin: '4rem auto', fontFamily: 'sans-serif', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <h1 style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>Checkout Simulation (Stage 4)</h1>
            <p style={{color: '#64748b', marginBottom: '2rem'}}>Generates an exact order -&gt; computes matrices -&gt; verifies Test Card via Paystack -&gt; outputs digital receipt mapping.</p>
            
            <div style={{background: '#f8fafc', padding: '1rem', borderRadius: 8, marginBottom: '2rem'}}>
                <h3>Simulated Cart</h3>
                {products.map(p => (
                    <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0'}}>
                        <span style={{fontWeight: 600}}>{p.name} (x1)</span><span>₦{Number(p.price).toLocaleString()}</span>
                    </div>
                ))}
                <div style={{textAlign: 'right', marginTop: '1rem', fontWeight: 600}}>
                    Subtotal: ₦{subtotal.toLocaleString()}
                </div>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <h3>Fulfilment Constraint</h3>
                <div style={{display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '1.5rem'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                        <input type="radio" name="d_type" checked={deliveryType === 'store_pickup'} onChange={()=>setDeliveryType('store_pickup')} />
                        Store Pickup (Free)
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                        <input type="radio" name="d_type" checked={deliveryType === 'delivery'} onChange={()=>setDeliveryType('delivery')} />
                        Home Delivery Active
                    </label>
                </div>

                {deliveryType === 'delivery' && (
                    <div style={{background: '#eff6ff', padding: '1.5rem', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div style={{position: 'relative'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 600}}>Select Delivery Algorithm Node</label>
                            
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="text" 
                                    style={{width: 'calc(100% - 1.5rem)', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'text'}} 
                                    placeholder="Search specific delivery locations or zones..." 
                                    value={selectedZone ? selectedLabel : searchQuery}
                                    onClick={(e) => {
                                        setSelectedZone('');
                                        setSelectedLabel('');
                                        setSearchQuery('');
                                        const dropdown = document.getElementById('deliverySearchDropdown');
                                        if (dropdown) dropdown.style.display = 'block';
                                    }}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearchQuery(val);
                                        const searchStr = val.toLowerCase();
                                        const dropdown = document.getElementById('deliverySearchDropdown');
                                        if (dropdown) dropdown.style.display = 'block';
                                        
                                        const options = dropdown?.querySelectorAll('.zone-option');
                                        options?.forEach((opt: any) => {
                                            const text = opt.innerText.toLowerCase();
                                            opt.style.display = text.includes(searchStr) ? 'block' : 'none';
                                        });
                                    }}
                                />
                                
                                <div id="deliverySearchDropdown" style={{display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px', zIndex: 10, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}>
                                    {locationOptions.map((loc, idx) => (
                                        <div 
                                            key={`${loc.id}-${idx}`} 
                                            className="zone-option"
                                            style={{padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem'}}
                                            onClick={() => {
                                                setSelectedZone(loc.id.toString());
                                                setSelectedLabel(loc.label);
                                                document.getElementById('deliverySearchDropdown')!.style.display = 'none';
                                            }}
                                        >
                                            <strong>{loc.label}</strong> 
                                        </div>
                                    ))}
                                    <div className="zone-option" style={{padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', display: 'none'}}>No matching zones found.</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 600}}>Customer Exact Coordinate Mapping (Address)</label>
                            <input type="text" style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1'}} value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. 23 Test Avenue, Benin City" />
                        </div>
                    </div>
                )}
            </div>

            <div style={{textAlign: 'right', marginBottom: '2rem'}}>
                <div style={{fontSize: '1.25rem', fontWeight: 700}}>Total: ₦{total.toLocaleString()}</div>
                {deliveryType === 'delivery' && <small style={{color: '#64748b'}}>Includes ₦{selectedFee.toLocaleString()} delivery route parameter.</small>}
            </div>

            <button onClick={executeCheckoutFlow} style={{width: '100%', padding: '1rem', background: '#09090b', color: 'white', border: 'none', borderRadius: 8, fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer'}}>
                Execute Complete Validation Flow (Paystack)
            </button>
        </div>
    );
}
