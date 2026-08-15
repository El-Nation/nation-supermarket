import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
];

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingCost, setShippingCost] = useState(3000); // Default to GRA Benin
    const [showAddressForm, setShowAddressForm] = useState(false);

    const finalTotal = cartTotal + shippingCost;

    const proceedToCheckout = () => {
        navigate('/checkout-test');
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                    <ShoppingCart size={40} color="#94a3b8" />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Your Cart is Empty</h2>
                <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Looks like you haven't added any products yet.</p>
                <Link to="/shop" style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '1rem 3rem', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', transition: '0.2s' }}>Return to Shop</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
                
                {/* Cart Table Area (Left) */}
                <div style={{ flex: '1 1 60%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500, color: '#334155', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>Product</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 500, color: '#334155' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 500, color: '#334155' }}>Quantity</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 500, color: '#334155', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.product_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button onClick={() => removeFromCart(item.product_id)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #fecaca', backgroundColor: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', flexShrink: 0, paddingBottom: '2px' }}>×</button>
                                        <div style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#94a3b8' }}>IMG</div>
                                            )}
                                        </div>
                                        <Link to={`/product/${item.product_id}`} style={{ textDecoration: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</Link>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>₦{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', border: '1px solid #1d4ed8', borderRadius: '4px', overflow: 'hidden' }}>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={item.quantity} 
                                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                                style={{ width: '45px', padding: '0.4rem', textAlign: 'center', border: 'none', borderRight: '1px solid #1d4ed8', fontSize: '0.9rem', fontWeight: 600, color: '#1d4ed8', outline: 'none' }}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} style={{ padding: '0.1rem 0.3rem', border: 'none', background: 'white', color: '#1d4ed8', cursor: 'pointer', fontSize: '0.5rem', borderBottom: '1px solid #1d4ed8' }}>▲</button>
                                                <button onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))} style={{ padding: '0.1rem 0.3rem', border: 'none', background: 'white', color: '#1d4ed8', cursor: 'pointer', fontSize: '0.5rem' }}>▼</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: '#64748b', fontSize: '0.9rem' }}>₦{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Cart Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem', paddingRight: '1rem' }}>
                        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#93c5fd', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'not-allowed', fontSize: '0.9rem' }}>Update cart</button>
                        <button onClick={clearCart} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Empty Cart</button>
                    </div>
                </div>

                {/* Cart Totals Sidebar (Right) */}
                <div style={{ flex: '1 1 35%', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginBottom: '1.5rem' }}>Cart totals</h2>
                    <div style={{ border: '1px solid #f1f5f9', backgroundColor: 'transparent' }}>
                        
                        <div style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ width: '35%', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Subtotal</div>
                            <div style={{ width: '65%', color: '#1d4ed8', textAlign: 'left', fontSize: '0.9rem' }}>₦{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        </div>

                        <div style={{ display: 'flex', padding: '1.5rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ width: '35%', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Shipment</div>
                            <div style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="shipping" checked={shippingCost === 3000} onChange={() => setShippingCost(3000)} style={{ accentColor: '#1d4ed8', marginTop: '2px' }} />
                                    <span>GRA- Benin City: <strong style={{ color: '#1d4ed8' }}>₦3,000.00</strong></span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="shipping" checked={shippingCost === 4000} onChange={() => setShippingCost(4000)} style={{ accentColor: '#1d4ed8', marginTop: '2px' }} />
                                    <span>Outside GRA - Benin City: <strong style={{ color: '#1d4ed8' }}>₦4,000.00</strong></span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="shipping" checked={shippingCost === 0} onChange={() => setShippingCost(0)} style={{ accentColor: '#1d4ed8', marginTop: '2px' }} />
                                    <span>Store Pick Up</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="shipping" checked={shippingCost === 8000} onChange={() => setShippingCost(8000)} style={{ accentColor: '#1d4ed8', marginTop: '2px' }} />
                                    <span>Other cities -Edo: <strong style={{ color: '#1d4ed8' }}>₦8,000.00</strong></span>
                                </label>

                                <div style={{ marginTop: '0.5rem', color: '#334155' }}>
                                    Shipping to <strong>Edo</strong>.
                                </div>
                                <div onClick={() => setShowAddressForm(!showAddressForm)} style={{ color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                                    Change address 🚚
                                </div>
                                
                                {showAddressForm && (
                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Country / Region <span style={{ color: '#ef4444' }}>*</span></label>
                                            <select style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#0f172a' }}>
                                                <option value="NG">Nigeria</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>State <span style={{ color: '#ef4444' }}>*</span></label>
                                            <select defaultValue="Edo" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#0f172a' }}>
                                                {NIGERIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Town / City <span style={{ color: '#ef4444' }}>*</span></label>
                                            <input type="text" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#0f172a' }} />
                                        </div>
                                        <button onClick={() => setShowAddressForm(false)} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                                            Update
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', padding: '1.25rem 1rem', alignItems: 'center' }}>
                            <div style={{ width: '35%', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Total</div>
                            <div style={{ width: '65%', color: '#1d4ed8', fontWeight: 700, fontSize: '1rem', textAlign: 'left' }}>₦{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    <button onClick={proceedToCheckout} style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', marginTop: '1.5rem', transition: '0.2s', textAlign: 'center' }}>
                        Proceed to checkout
                    </button>
                </div>

            </div>
        </div>
    );
}
