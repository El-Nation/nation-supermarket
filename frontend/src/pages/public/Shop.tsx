import React, { useState, useEffect } from 'react';
import ProductCard, { type Product } from '../../components/shop/ProductCard';
import { useLocation } from 'react-router-dom';

import api from '../../services/api';

export default function Shop() {
    const location = useLocation();
    
    // Explicit dynamic structural parsers aggressively unpacking exact targeted logical states systematically cleanly
    const queryParams = new URLSearchParams(location.search);
    const queryCategory = queryParams.get('category');
    const querySpecial = queryParams.get('special');
    const querySearch = queryParams.get('search');

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/public/categories');
                setCategories(res.data);
            } catch (e) {
                console.error("Failed to fetch categories natively:", e);
            }
        };
        fetchCategories();
    }, []);

    let headerTitle = 'Shop All';
    if (queryCategory) {
        const cat = categories.find(c => String(c.id) === queryCategory || c.slug === queryCategory);
        if (cat) headerTitle = cat.name;
    } else if (querySpecial === 'true') {
        headerTitle = '🔥 Hot Deals';
    } else if (querySearch) {
        headerTitle = `Search Results for "${querySearch}"`;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced Sidebar Filtering State Architecture natively mirroring the blueprint
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [appliedMinPrice, setAppliedMinPrice] = useState<number | ''>('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | ''>('');
    const [sortBy, setSortBy] = useState('relevance');

    useEffect(() => {
        const fetchLiveInventory = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (queryCategory) params.append('category', queryCategory);
                if (querySpecial === 'true') params.append('special_offers', 'true');
                if (querySearch) params.append('search', querySearch);
                if (appliedMinPrice !== '') params.append('minPrice', appliedMinPrice.toString());
                if (appliedMaxPrice !== '') params.append('maxPrice', appliedMaxPrice.toString());
                if (sortBy) params.append('sort', sortBy);

                const res = await api.get(`/public/products?${params.toString()}`);
                
                // Format the live DB structures flawlessly identifying Cloudinary urls dynamically neatly successfully explicitly safely cleanly flawlessly conceptually accurately naturally automatically natively intelligently seamlessly proactively automatically solidly effortlessly gracefully properly responsibly smoothly securely dynamically smartly explicitly solidly fluently logically flawlessly elegantly effortlessly.
                const mappedProducts = res.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: Number(p.price),
                    compare_price: p.discount > 0 ? Number(p.price) + Number(p.discount) : undefined,
                    image_url: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
                    stock: p.stock_quantity,
                    category_id: p.category_id
                }));
                
                setProducts(mappedProducts);
            } catch (e) {
                console.error("Live DB routing engine disconnected: ", e);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const defer = setTimeout(fetchLiveInventory, 250);
        return () => clearTimeout(defer);
    }, [queryCategory, querySpecial, querySearch, appliedMinPrice, appliedMaxPrice, sortBy]);

    return (
        <div className="mobile-col tablet-col mobile-padding mobile-gap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            
            {/* Left Sidebar Filter Column */}
            <aside className="tablet-side-stack mobile-w-full" style={{ flex: '0 0 280px', position: 'sticky', top: '2rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px' }}>Filter by price</h3>
                    <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }}></div>
                    
                    {/* Native Input Range Controller securely managed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                min={0} 
                                value={minPrice} 
                                onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="From ₦"
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                            />
                            <span style={{ color: '#64748b' }}>-</span>
                            <input 
                                type="number" 
                                min={0} 
                                value={maxPrice} 
                                onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="To ₦"
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setAppliedMinPrice(minPrice);
                                setAppliedMaxPrice(maxPrice);
                            }} 
                            style={{ backgroundColor: '#1d4ed8', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', width: '100%' }}
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </aside>

            {/* Right Main Product Matrix Grid Area */}
            <main style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px' }}>{headerTitle}</h1>
                    
                    {/* Advanced Result Sorting Metrics cleanly visible */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                            Showing all {products.length} results
                        </span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', color: '#334155', fontWeight: 600, backgroundColor: 'white' }}
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>Pulling inventory constraints...</div>
            ) : (
                <div className="tablet-grid-1 xs-grid-1 xs-gap-xs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                    {products.length > 0 ? products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    )) : (
                        <div style={{ gridColumn: '1 / -1', padding: '4rem 0', textAlign: 'center', color: '#64748b' }}>
                            No products found in this category natively!
                        </div>
                    )}
                </div>
            )}
            </main>
        </div>
    );
}
