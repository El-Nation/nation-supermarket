import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Grid, ChevronDown, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
    { id: 1, name: "Fresh Produce", icon: "🥬" },
    { id: 2, name: "Bakery & Bread", icon: "🥐" },
    { id: 3, name: "Dairy & Eggs", icon: "🥚" },
    { id: 4, name: "Meat & Seafood", icon: "🥩" },
    { id: 5, name: "Pantry Staples", icon: "🥫" },
    { id: 6, name: "Snacks & Sweets", icon: "🍫" },
    { id: 7, name: "Beverages", icon: "🧃" },
    { id: 8, name: "Clothing", icon: "👕" },
    { id: 9, name: "Electronics", icon: "🔌" },
    { id: 10, name: "Home & Kitchen", icon: "🍳" },
    { id: 11, name: "Health & Beauty", icon: "🧴" },
    { id: 12, name: "Baby Care", icon: "🍼" },
    { id: 13, name: "Pet Supplies", icon: "🐕" },
    { id: 14, name: "Household", icon: "🧽" },
];

export default function Navbar() {
    const { cartCount, cartItems, cartTotal, removeFromCart, clearCart } = useCart();
    const { wishlist } = useWishlist();
    const { user } = useAuth();
    
    // Explicit dynamic structural UI parsers handling routing inherently effortlessly
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartHover, setCartHover] = useState(false);
    const [cartClicked, setCartClicked] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}>
            {/* Top Tier: Logo, Search, Accounts */}
            <div className="mobile-padding mobile-col" style={{ padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', gap: '2rem' }}>
                
                {/* Mobile Top Row: Logo + Icons */}
                <div className="mobile-nav-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1' }}>
                    {/* Logo Section */}
                    <Link to="/" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Nation Supermarket" style={{ height: '90px', objectFit: 'contain', transform: 'scale(1.8)', transformOrigin: 'left center', margin: '0 10px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-weight:800;font-size:1.5rem;color:#0f172a;letter-spacing:-0.5px;">NATION SP</span>'; }} />
                    </Link>

                    {/* Icons Section FOR MOBILE ONLY - To keep them on top alongside logo. In desktop they go right of search */}
                    <div className="desktop-hide" style={{ display: 'none' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                            <Link to="/wishlist" style={{ ...iconLinkStyle, position: 'relative' }}>
                                <Heart size={24} color="#0f172a" />
                                {wishlist.length > 0 && <span style={badgeStyle}>{wishlist.length}</span>}
                            </Link>

                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div onClick={() => setCartClicked(prev => !prev)} style={{ ...iconLinkStyle, position: 'relative', cursor: 'pointer' }}>
                                    <ShoppingCart size={24} color="#0f172a" />
                                    {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                                </div>
                                {cartClicked && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, width: 'max(280px, calc(100vw - 20px))', maxWidth: 'calc(100vw - 20px)', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 60, padding: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {cartItems.length > 0 ? (
                                            <>
                                                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
                                                    {cartItems.map(item => (
                                                        <div key={item.product_id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                            <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                                                {item.image_url ? (
                                                                    <img src={item.image_url} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                                ) : (
                                                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8' }}>{item.name.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{item.name}</span>
                                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{item.quantity} ×</span>
                                                                    <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 800 }}>₦{item.price.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                        <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Subtotal:</span>
                                                        <span style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '1rem' }}>₦{cartTotal.toLocaleString()}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <Link to="/cart" onClick={() => setCartClicked(false)} style={{ flex: 1, padding: '0.5rem', textAlign: 'center', backgroundColor: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>View cart</Link>
                                                        <Link to="/checkout-test" onClick={() => setCartClicked(false)} style={{ flex: 1, padding: '0.5rem', textAlign: 'center', backgroundColor: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>Checkout</Link>
                                                        <button onClick={() => { clearCart(); setCartClicked(false); }} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Empty</button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem 0', fontWeight: 500 }}>Your cart is empty.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {user && user.role !== 'admin' ? (
                                <Link to="/dashboard" style={iconLinkStyle}>
                                    <User size={24} color="#0f172a" />
                                </Link>
                            ) : user && user.role === 'admin' ? (
                                <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#ea580c', fontWeight: 600 }}>Admin</Link>
                            ) : (
                                <Link to="/login" style={iconLinkStyle}>
                                    <User size={24} color="#0f172a" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Massive Search Bar (Active Primary Instance) */}
                <form className="mobile-search-bar" onSubmit={handleSearchSubmit} style={{ flex: '1 1 auto', maxWidth: '600px', display: 'flex', width: '100%' }}>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Nation Supermarket..." 
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '6px 0 0 6px', fontSize: '0.95rem', outline: 'none' }} 
                    />
                    <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}>
                        <Search size={20} />
                    </button>
                </form>
                
                {/* Icons Section (DESKTOP) */}
                <div className="mobile-hide" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: '0 0 auto' }}>
                    <Link to="/wishlist" style={iconLinkStyle}>
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Heart size={24} color="#0f172a" />
                                {wishlist.length > 0 && <span style={badgeStyle}>{wishlist.length}</span>}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>Wishlist</span>
                        </div>
                    </Link>
                    
                    {/* Advanced Interactive Dropdown Mini-Cart Architecture seamlessly cleanly implicitly fully structurally intuitively safely fluently rapidly securely expertly smartly neatly elegantly functionally actively gracefully naturally proactively perfectly */}
                    <div 
                        onMouseEnter={() => setCartHover(true)}
                        onMouseLeave={() => setCartHover(false)}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}
                    >
                        <div onClick={() => setCartClicked(prev => !prev)} style={{ ...iconLinkStyle, cursor: 'pointer' }}>
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <ShoppingCart size={24} color="#0f172a" />
                                    {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>Cart</span>
                            </div>
                        </div>

                        {/* Sub-menu Dropdown natively safely gracefully elegantly actively securely */}
                        {(cartHover || cartClicked) && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, width: '380px', maxWidth: 'calc(100vw - 20px)', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 60, padding: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {cartItems.length > 0 ? (
                                    <>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.5rem' }}>
                                            {cartItems.map(item => (
                                                <div key={item.product_id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                        ) : (
                                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#94a3b8' }}>{item.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{item.name}</span>
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{item.quantity} ×</span>
                                                            <span style={{ fontSize: '0.85rem', color: '#1d4ed8', fontWeight: 800 }}>₦{item.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: '0.2s', flexShrink: 0 }}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                                <span style={{ fontWeight: 600, color: '#64748b' }}>Subtotal:</span>
                                                <span style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '1.15rem' }}>₦{cartTotal.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link to="/cart" onClick={() => { setCartHover(false); setCartClicked(false); }} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', backgroundColor: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', transition: '0.2s' }}>View cart</Link>
                                                <Link to="/checkout-test" onClick={() => { setCartHover(false); setCartClicked(false); }} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', backgroundColor: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', transition: '0.2s' }}>Checkout</Link>
                                                <button onClick={() => { clearCart(); setCartHover(false); setCartClicked(false); }} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}>Empty Cart</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontWeight: 500 }}>Your cart is empty.</div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {user && user.role !== 'admin' ? (
                        <Link to="/dashboard" style={{ ...iconLinkStyle, flexDirection: 'column', gap: '0.25rem' }}>
                            <User size={24} color="#0f172a" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>Account</span>
                        </Link>
                    ) : user && user.role === 'admin' ? (
                        <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#ea580c', fontWeight: 600 }}>Admin</Link>
                    ) : (
                        <Link to="/login" style={{ ...iconLinkStyle, flexDirection: 'column', gap: '0.25rem' }}>
                            <User size={24} color="#0f172a" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Bottom Tier: Browse Categories & Quick Links */}
            <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: 'white' }}>
                <div className="mobile-col mobile-padding" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                    
                    {/* Browse Categories Dropdown */}
                    <div className="mobile-w-full"
                        style={{ position: 'relative' }}
                        tabIndex={0}
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(false);
                        }}
                    >
                        <button className="mobile-w-full" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0.85rem 1.5rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                <Grid size={18} />
                                Browse All Categories
                            </div>
                            <ChevronDown size={16} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="mobile-w-full xs-grid-1" style={{ position: 'absolute', top: '100%', left: 0, width: '600px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {CATEGORIES.map(cat => (
                                    <Link key={cat.id} to={`/shop?category=${cat.id}`} onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', color: '#0f172a', border: '1px solid #f1f5f9', borderRadius: '6px', transition: '0.2s', backgroundColor: '#fafaf9' }}>
                                        <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Horizontal Quick Links */}
                    <nav className="mobile-w-full mobile-padding hide-scrollbar" style={{ display: 'flex', gap: '2rem', paddingLeft: '2rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
                        <Link to="/shop?special=true" style={{ ...linkStyle, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Flame size={16} /> Hot Deals</Link>
                        <Link to="/shop" style={linkStyle}>Shop All</Link>
                        <Link to="/shop?category=11" style={linkStyle}>Fragrance</Link>
                        <Link to="/shop?category=14" style={linkStyle}>Household</Link>
                        <Link to="/shop?category=12" style={linkStyle}>Kids Provisions</Link>
                        <Link to="/shop?category=10" style={linkStyle}>Kitchen Appliances</Link>
                        <Link to="/shop?category=14" style={linkStyle}>Laundry</Link>
                        <Link to="/shop?category=5" style={linkStyle}>Provisions</Link>
                        <Link to="/shop?category=6" style={linkStyle}>Snacks & Sweets</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

const linkStyle = { textDecoration: 'none', color: '#334155', fontWeight: 700, fontSize: '0.9rem' };
const iconLinkStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' };
const badgeStyle: React.CSSProperties = { position: 'absolute', top: '-6px', right: '-8px', background: '#38bdf8', color: 'white', fontSize: '0.7rem', fontWeight: 800, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
