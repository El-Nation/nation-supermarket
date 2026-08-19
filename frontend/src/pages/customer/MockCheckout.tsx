import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Clock, CreditCard, Lock } from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
];

export default function MockCheckout() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isBuyNow = new URLSearchParams(location.search).get('mode') === 'buy_now';

    const [zones, setZones] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [deliveryType, setDeliveryType] = useState('delivery');
    const [selectedZone, setSelectedZone] = useState('3000');
    
    // Explicit Form mapping visually matching Philhallmark
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Edo');
    const [notes, setNotes] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setPhone(user.phone || '');
            if (user.name) {
                const parts = user.name.split(' ');
                setFirstName(parts[0]);
                if (parts.length > 1) {
                    setLastName(parts.slice(1).join(' '));
                }
            }
        }
    }, [user]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.body.appendChild(script);

        const fetchInit = async () => {
            try {
                const zRes = await api.get('/public/delivery');
                setZones(zRes.data);
                
                // Automatically pick the first zone by default for radio selection
                if(zRes.data && zRes.data.length > 0) {
                    setSelectedZone(zRes.data[0].id.toString());
                }

                if (isBuyNow) {
                    const sessionProd = sessionStorage.getItem('buy_now_product');
                    if (sessionProd) setProducts(JSON.parse(sessionProd));
                } else {
                    // Pulling directly from cart context and expanding properties safely
                    setProducts(cartItems.map(item => ({ id: item.product_id, name: item.name, price: item.price, quantity: item.quantity, image_url: item.image_url })));
                }
            } catch(e) {
                console.error("DEBUG FETCHINIT FAIL:", e);
                alert("CRITICAL API FAILURE: Could not negotiate checkout initialization.");
            } finally {
                setLoading(false);
            }
        };
        fetchInit();
    }, [isBuyNow, cartItems]);

    const selectedFee = deliveryType === 'store_pickup' ? 0 : Number(zones.find(z => String(z.id) === selectedZone)?.fee || 0);

    const subtotal = products.reduce((acc, p) => acc + (Number(p.price) * (p.quantity || 1)), 0);
    const total = subtotal + selectedFee;

    const executeCheckoutFlow = async () => {
        if (!email || !firstName || !lastName || !phone) return alert('Please actively provide your full contact and identity verification fields.');
        if (deliveryType === 'delivery' && (!selectedZone || !addressLine1 || !city)) return alert('Select zone and provide complete street address.');
        if (!agreedToTerms) return alert('You must agree to the website terms and conditions.');

        const guestName = `${firstName} ${lastName}`.trim();
        const customer = { name: guestName, email, phone };
        const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state}`.trim();

        try {
            const rInit = await api.post('/public/payments/mock-order', {
                delivery_type: deliveryType,
                delivery_zone_id: selectedZone ? Number(selectedZone) : null,
                delivery_address: fullAddress,
                items: products.map(p => ({ product_id: p.id || p.product_id, quantity: p.quantity || 1 })),
                customer,
                user_id: user?.id || null
            });

            const { order_id, amount } = rInit.data;

            const pInit = await api.post('/public/payments/initialize', {
                order_id,
                email: customer.email,
                amount: amount
            });

            const handler = window.PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, 
                access_code: pInit.data.data.access_code,
                email: customer.email,
                amount: amount * 100,
                metadata: { order_id: order_id },
                callback: function(response: any) {
                    (async () => {
                        try {
                            const verified = await api.post('/public/payments/verify', { reference: response.reference });
                            if(!isBuyNow) clearCart();
                            window.location.href = `/receipt/${response.reference}`;
                        } catch(e: any) {
                            console.error("DEBUG CRASH TRACE:", e);
                            alert("CRITICAL CHECKOUT CRASH: " + (e.message || "Unknown error"));
                        }
                    })();
                },
                onClose: function(){
                    console.log('Transaction popup closed gracefully.');
                }
            });
            handler.openIframe();
        } catch(e: any) {
            alert('Simulation error: ' + (e.response?.data?.message || e.message));
        }
    };

    if(loading) return <div style={{padding: '5rem', textAlign: 'center'}}>Initializing Simulation Engine...</div>;
    if(products.length === 0) return <div style={{padding: '5rem'}}>No products in Database. Add a product to your cart first!</div>;

    const inputStyle = { width: '100%', padding: '0.85rem', borderRadius: '24px', border: 'none', backgroundColor: '#f3f4f6', fontSize: '0.9rem', outline: 'none', color: '#334155' };
    const labelStyle = { display: 'block', fontWeight: 500, fontSize: '0.85rem', color: '#475569', marginBottom: '0.4rem', paddingLeft: '0.5rem' };
    const sectionTitleStyle = { fontSize: '1.25rem', color: '#1e293b', fontWeight: 600, marginBottom: '1.25rem' };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem clamp(1rem, 5vw, 2.5rem) 3rem', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Top Header Region natively mapping Philhallmark presentation explicitly */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', height: '120px' }}>
                    <img 
                        src="/logo.png" 
                        alt="Nation Supermarket" 
                        style={{ height: '400px', objectFit: 'contain', marginTop: '-140px' }} 
                        onError={(e) => { 
                            e.currentTarget.style.display = 'none'; 
                            e.currentTarget.insertAdjacentHTML('afterend', '<div style="font-weight:800;font-size:2.5rem;color:#0f172a;letter-spacing:-0.5px;line-height:120px;">NATION SUPERMARKET</div>'); 
                        }} 
                    />
                </div>
                
                <h1 style={{ fontSize: '2.5rem', color: '#1d4ed8', fontWeight: 600, margin: '1rem 0 1rem 0' }}>You are almost there</h1>
                <p style={{ color: '#64748b', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                    Please review your items and confirm your delivery and payment details below. We'll handle the rest and get your orders to you fresh and on time. If you have any issues, feel free to contact us — we're here to help.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(1rem, 3vw, 3rem)', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} /> SSL secured checkout</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> 24/7 support available</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={18} /> Secure payment options</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem', gap: '1rem', color: '#cbd5e1' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div> Cart</span>
                    <span style={{ width: '60px', height: '2px', backgroundColor: '#e2e8f0', flexShrink: 1 }}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600 }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '4px solid #a855f7' }}></div> Information</span>
                    <span style={{ width: '60px', height: '2px', backgroundColor: '#e2e8f0', flexShrink: 1 }}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div> Finish</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
                
                {/* Left Form Column */}
                <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    
                    {/* Customer Information */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                            <h2 style={sectionTitleStyle}>Customer information</h2>
                            {!user && (
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Already have an account? <Link to="/login" style={{ color: '#1d4ed8', textDecoration: 'none' }}>Log in</Link></span>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <h2 style={sectionTitleStyle}>Billing details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>First name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                                </div>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>Last name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                                </div>
                            </div>
                            
                            <div>
                                <label style={labelStyle}>Company name</label>
                                <input type="text" style={{...inputStyle, boxSizing: 'border-box'}} />
                            </div>

                            <div style={{ width: '100%', maxWidth: '200px' }}>
                                <label style={labelStyle}>Country / Region <span style={{ color: '#ef4444' }}>*</span></label>
                                <select style={{ ...inputStyle, paddingRight: '2rem' }}>
                                    <option>Nigeria</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>House number and street name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="text" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                                </div>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>Apartment, suite, unit, etc. (optional)</label>
                                    <input type="text" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: '1 1 150px' }}>
                                    <label style={labelStyle}>Town / City <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <label style={labelStyle}>State <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select value={state} onChange={e => setState(e.target.value)} style={{ ...inputStyle, boxSizing: 'border-box' }}>
                                        {NIGERIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{...inputStyle, boxSizing: 'border-box'}} />
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}>
                                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#1d4ed8' }} />
                                <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1e293b' }}>Ship to a different address?</span>
                            </label>

                            <div>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes about your order, e.g. special notes for delivery." style={{ ...inputStyle, minHeight: '100px', borderRadius: '12px', boxSizing: 'border-box', maxWidth: '100%' }}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Options - fees rendered dynamically from DB zones to prevent label/total mismatch */}
                    <div>
                        <h2 style={sectionTitleStyle}>Shipping</h2>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input type="radio" name="checkout_shipping" checked={deliveryType === 'delivery' && selectedZone === String(zones.find(z => Number(z.fee) === 3000)?.id || '')} onChange={() => { setSelectedZone(String(zones.find(z => Number(z.fee) === 3000)?.id || '')); setDeliveryType('delivery'); }} style={{ width: '20px', height: '20px', accentColor: '#0d3a95' }} />
                                    <span style={{ fontSize: '1rem', color: '#0f172a' }}>GRA- Benin City:</span>
                                </div>
                                <span style={{ fontSize: '1rem', color: '#0f172a' }}>₦{(Number(zones.find(z => Number(z.fee) === 3000)?.fee) || 3000).toLocaleString()}.00</span>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input type="radio" name="checkout_shipping" checked={deliveryType === 'delivery' && selectedZone === String(zones.find(z => Number(z.fee) === 5000)?.id || '')} onChange={() => { setSelectedZone(String(zones.find(z => Number(z.fee) === 5000)?.id || '')); setDeliveryType('delivery'); }} style={{ width: '20px', height: '20px', accentColor: '#0d3a95' }} />
                                    <span style={{ fontSize: '1rem', color: '#0f172a' }}>Outside GRA - Benin City:</span>
                                </div>
                                <span style={{ fontSize: '1rem', color: '#0f172a' }}>₦{(Number(zones.find(z => Number(z.fee) === 5000)?.fee) || 5000).toLocaleString()}.00</span>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input type="radio" name="checkout_shipping" checked={deliveryType === 'store_pickup'} onChange={() => { setSelectedZone('0'); setDeliveryType('store_pickup'); }} style={{ width: '20px', height: '20px', accentColor: '#0d3a95' }} />
                                    <span style={{ fontSize: '1rem', color: '#0f172a' }}>Store Pick Up</span>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input type="radio" name="checkout_shipping" checked={deliveryType === 'delivery' && selectedZone === String(zones.find(z => Number(z.fee) === 8000)?.id || '')} onChange={() => { setSelectedZone(String(zones.find(z => Number(z.fee) === 8000)?.id || '')); setDeliveryType('delivery'); }} style={{ width: '20px', height: '20px', accentColor: '#0d3a95' }} />
                                    <span style={{ fontSize: '1rem', color: '#0f172a' }}>Other cities -Edo:</span>
                                </div>
                                <span style={{ fontSize: '1rem', color: '#0f172a' }}>₦8,000.00</span>
                            </label>
                        </div>
                    </div>

                    {/* Payment visually nested at the bottom left correctly effectively */}
                    <div>
                        <h2 style={sectionTitleStyle}>Payment</h2>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <input type="radio" checked readOnly style={{ width: '20px', height: '20px', accentColor: '#0d3a95' }} />
                                <span style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: 400 }}>Debit/Credit Cards/BankTransfers</span>
                            </div>
                            
                            <fieldset style={{ 
                                border: '1px solid #cbd5e1', 
                                borderBottom: '1px solid #cbd5e1', 
                                borderLeft: '1px solid #cbd5e1', 
                                borderRight: '1px solid #cbd5e1', 
                                borderTop: '1px solid #cbd5e1', 
                                borderRadius: '8px', 
                                padding: '1.5rem', 
                                margin: '0 1rem 1rem 1rem', 
                                display: 'flex', 
                                justifyContent: 'space-around', 
                                alignItems: 'center' 
                            }}>
                                <legend style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', padding: '0 0.5rem' }}>
                                    Secured by <span style={{ fontWeight: 800 }}>paystack</span>
                                </legend>
                                
                                {/* Paystack Lines */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <div style={{ width: '28px', height: '6px', backgroundColor: '#0ea5e9', borderRadius: '2px' }}></div>
                                    <div style={{ width: '28px', height: '6px', backgroundColor: '#0ea5e9', borderRadius: '2px' }}></div>
                                    <div style={{ width: '20px', height: '6px', backgroundColor: '#0ea5e9', borderRadius: '2px' }}></div>
                                </div>
                                
                                {/* Mastercard */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                    <div style={{ position: 'relative', width: '36px', height: '24px' }}>
                                        <div style={{ position: 'absolute', left: 0, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#eb001b', opacity: 0.9 }}></div>
                                        <div style={{ position: 'absolute', right: 0, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f79e1b', opacity: 0.9 }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.5rem', fontWeight: 600, color: '#1e293b' }}>mastercard</span>
                                </div>
                                
                                {/* VISA */}
                                <div style={{ color: '#1434cb', fontWeight: 800, fontSize: '1.4rem', fontStyle: 'italic', letterSpacing: '-1px' }}>
                                    VISA
                                </div>
                                
                                {/* Verve */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#e51a2e', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>V</div>
                                    <div style={{ color: '#e51a2e', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>erve</div>
                                </div>
                            </fieldset>
                        </div>

                        <p style={{ fontSize: '0.8.5rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                        </p>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '2rem' }}>
                            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#1d4ed8' }} />
                            <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>I have read and agree to the website terms and conditions <span style={{ color: '#ef4444' }}>*</span></span>
                        </label>

                        <button onClick={executeCheckoutFlow} style={{ width: '100%', padding: '1.25rem', backgroundColor: '#0d3a95', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: '0.2s', boxShadow: '0 4px 6px rgba(13, 58, 149, 0.2)' }}>
                            <Lock size={18} /> Place Order ₦{total.toLocaleString()}
                        </button>
                    </div>

                </div>

                {/* Right Column: Your Order neatly aligned seamlessly seamlessly structurally natively safely appropriately */}
                <div style={{ flex: '1 1 35%', minWidth: 'min(320px, 100%)', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: 600, marginBottom: '1.25rem' }}>Your order</h2>
                    
                    <div style={{ border: '1px solid #e2e8f0', backgroundColor: 'transparent' }}>
                        
                        <div style={{ display: 'flex', padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1, fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Product</div>
                            <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Subtotal</div>
                        </div>

                        {products.map(p => (
                            <div key={p.id} style={{ display: 'flex', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#94a3b8' }}>IMG</div>
                                    )}
                                </div>
                                <div style={{ flex: 1, fontSize: '0.85rem', color: '#475569' }}>
                                    {p.name} <span style={{ paddingLeft: '1rem', color: '#1e293b', fontWeight: 600 }}>× {p.quantity || 1}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                                    ₦{(Number(p.price) * (p.quantity || 1)).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1, fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Subtotal</div>
                            <div style={{ color: '#475569', fontSize: '0.9rem' }}>₦{subtotal.toLocaleString()}</div>
                        </div>

                        <div style={{ display: 'flex', padding: '1.5rem 1.25rem', alignItems: 'center' }}>
                            <div style={{ flex: 1, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>Total</div>
                            <div style={{ color: '#1e293b', fontWeight: 800, fontSize: '1.25rem' }}>₦{total.toLocaleString()}</div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
