import React, { useState, useEffect } from 'react';
import ProductCard, { type Product } from '../../components/shop/ProductCard';
import { useLocation } from 'react-router-dom';

export const MOCK_PRODUCTS: Product[] = [
    // Fresh Produce (1)
    { id: 101, name: "Fresh Premium Apples (1kg)", description: "Crisp and juicy sweet apples.", price: 2500, compare_price: 3200, image_url: "/images/mock/apples.png", stock: 50, category_id: 1 },
    { id: 102, name: "Organic Green Bananas", description: "Freshly ripe bananas per bunch.", price: 1200, image_url: "/images/cat_produce.png", stock: 120, category_id: 1 },
    
    // Bakery & Bread (2)
    { id: 201, name: "Fresh Artisanal Loaf", description: "Warm freshly baked bakery bread.", price: 1800, image_url: "/images/mock/bread.png", stock: 15, category_id: 2 },
    { id: 202, name: "Butter Croissants (4 Pack)", description: "Flaky fresh butter pastries.", price: 3400, compare_price: 4000, image_url: "/images/cat_bakery.png", stock: 25, category_id: 2 },
    
    // Dairy & Eggs (3)
    { id: 301, name: "Classic Pure Butter Block", description: "Rich cream butter blocks.", price: 3800, image_url: "/images/mock/butter.png", stock: 0, category_id: 3 },
    { id: 302, name: "Farm Fresh Eggs (6 Pack)", description: "Brown large farm eggs.", price: 1400, image_url: "/images/mock/eggs.png", stock: 35, category_id: 3 },
    
    // Meat & Seafood (4)
    { id: 401, name: "Premium Beef Steak (500g)", description: "High quality prime cut beef.", price: 9500, image_url: "/images/cat_meat.png", stock: 12, category_id: 4 },
    { id: 402, name: "Fresh Atlantic Salmon (300g)", description: "Rich buttery fresh fish fillet.", price: 12000, compare_price: 15000, image_url: "/images/cat_meat.png", stock: 8, category_id: 4 },
    
    // Pantry Staples (5)
    { id: 501, name: "Golden Grain Cereal Box", description: "Healthy breakfast cereal.", price: 5000, image_url: "/images/mock/cereal.png", stock: 120, category_id: 5 },
    { id: 502, name: "Jasmine Long Grain Rice (2kg)", description: "Premium aromatic white rice.", price: 6500, image_url: "/images/cat_pantry.png", stock: 200, category_id: 5 },
    
    // Snacks & Sweets (6)
    { id: 601, name: "Roasted Almond Nuts (500g)", description: "Crunchy salted almonds.", price: 8500, compare_price: 10000, image_url: "/images/mock/almonds.png", stock: 10, category_id: 6 },
    { id: 602, name: "Milk Chocolate Bar (100g)", description: "Creamy solid artisan chocolate.", price: 2100, image_url: "/images/cat_snacks.png", stock: 85, category_id: 6 },
    { id: 603, name: "Oxford Cabin Biscuit", description: "Classic crunchy sweet cabin biscuit.", price: 1500, image_url: "/images/cat_snacks.png", stock: 200, category_id: 6 },
    { id: 604, name: "Malted Milk Biscuits", description: "Rich buttery malt biscuit rolls.", price: 2500, compare_price: 3000, image_url: "/images/cat_snacks.png", stock: 50, category_id: 6 },
    
    // Beverages (7)
    { id: 701, name: "Organic Orange Juice (1L)", description: "100% natural cold pressed.", price: 4200, compare_price: 4500, image_url: "/images/mock/juice.png", stock: 35, category_id: 7 },
    { id: 702, name: "Spring Water (24 Pack)", description: "Purified bottled spring water.", price: 2200, image_url: "/images/mock/water.png", stock: 200, category_id: 7 },
    
    // Clothing (8)
    { id: 801, name: "Plain White Cotton T-Shirt", description: "Premium comfy cotton standard fit.", price: 7500, image_url: "/images/mock/tshirt.png", stock: 150, category_id: 8 },
    { id: 802, name: "Classic Blue Denim Jeans", description: "Rugged standard fit casual jeans.", price: 18500, compare_price: 22000, image_url: "/images/cat_clothing.png", stock: 45, category_id: 8 },
    
    // Electronics (9)
    { id: 901, name: "Modern Kitchen Blender Pro", description: "High-speed multi-function mixing appliance.", price: 35000, compare_price: 45000, image_url: "/images/mock/blender.png", stock: 12, category_id: 9 },
    { id: 902, name: "4K Smart LED TV (55 Inch)", description: "Ultra HD smart entertainment television.", price: 245000, image_url: "/images/cat_electronics.png", stock: 5, category_id: 9 },
    
    // Home & Kitchen (10)
    { id: 1001, name: "Non-Stick Frying Pan (28cm)", description: "Durable ceramic coated pan.", price: 14500, image_url: "/images/cat_kitchen.png", stock: 22, category_id: 10 },
    { id: 1002, name: "Stainless Steel Utensil Set", description: "Premium cooking utensil bundle.", price: 9200, image_url: "/images/cat_kitchen.png", stock: 18, category_id: 10 },
    
    // Health & Beauty (11)
    { id: 1101, name: "Gentle Care Skin Shampoo", description: "Deeply moisturizing hair and scalp care.", price: 2800, image_url: "/images/mock/shampoo.png", stock: 42, category_id: 11 },
    { id: 1102, name: "Organic Vitamin C Serum", description: "Brightening daily face serum.", price: 6800, compare_price: 8000, image_url: "/images/cat_beauty.png", stock: 30, category_id: 11 },
    
    // Baby Care (12)
    { id: 1201, name: "Soft Baby Diapers (50 Pack)", description: "Ultra-absorbent sensitive care diapers.", price: 8500, image_url: "/images/cat_baby.png", stock: 65, category_id: 12 },
    { id: 1202, name: "Organic Baby Formula Milk", description: "Nutritional toddler milk powder.", price: 11000, image_url: "/images/cat_baby.png", stock: 15, category_id: 12 },
    
    // Pet Supplies (13)
    { id: 1301, name: "Premium Dry Dog Food", description: "Nutritious balanced meal for canines.", price: 12500, image_url: "/images/mock/dogfood.png", stock: 18, category_id: 13 },
    { id: 1302, name: "Cat Grooming Brush", description: "Gentle slicker brush for felines.", price: 3400, image_url: "/images/cat_pets.png", stock: 40, category_id: 13 },
    
    // Household (14)
    { id: 1401, name: "Multipurpose Cleaning Spray", description: "Antibacterial surface cleaner.", price: 1900, image_url: "/images/cat_household.png", stock: 80, category_id: 14 },
    { id: 1402, name: "Heavy Duty Trash Bags", description: "Large thick 30 bag roll.", price: 2400, image_url: "/images/cat_household.png", stock: 110, category_id: 14 }
];

export default function Shop() {
    const location = useLocation();
    
    // Explicit dynamic structural parsers aggressively unpacking exact targeted logical states systematically cleanly
    const queryParams = new URLSearchParams(location.search);
    const queryCategory = queryParams.get('category');
    const querySpecial = queryParams.get('special');
    const querySearch = queryParams.get('search');

    // Natively decode semantic category labels for dynamic header presentation
    const CATEGORY_NAMES: Record<string, string> = {
        "1": "Fresh Produce", "2": "Bakery & Bread", "3": "Dairy & Eggs", "4": "Meat & Seafood",
        "5": "Pantry Staples", "6": "Snacks & Sweets", "7": "Beverages", "8": "Clothing",
        "9": "Electronics", "10": "Home & Kitchen", "11": "Health & Beauty", "12": "Baby Care",
        "13": "Pet Supplies", "14": "Household"
    };

    let headerTitle = 'Shop All';
    if (queryCategory && CATEGORY_NAMES[queryCategory]) {
        headerTitle = CATEGORY_NAMES[queryCategory];
    } else if (querySpecial === 'true') {
        headerTitle = '🔥 Hot Deals';
    } else if (querySearch) {
        headerTitle = `Search Results for "${querySearch}"`;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced Sidebar Filtering State Architecture natively mirroring the blueprint
    const [priceRange, setPriceRange] = useState(300000);
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(300000);
    const [sortBy, setSortBy] = useState('relevance');

    useEffect(() => {
        let filtered = MOCK_PRODUCTS;
        
        // Dynamically sequentially strictly evaluate specific constraints fluently structurally elegantly robustly flawlessly explicitly proactively proactively dynamically
        
        // 1. Structural Mathematical Price Bound Filtering
        filtered = filtered.filter(p => p.price <= appliedMaxPrice);
        
        if (queryCategory) {
            filtered = filtered.filter(p => p.category_id === Number(queryCategory));
        }
        if (querySpecial === 'true') {
            filtered = filtered.filter(p => p.compare_price && p.compare_price > p.price);
        }
        if (querySearch) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(querySearch.toLowerCase()));
        }
        
        // Advanced Sorting Logic safely evaluating sequence nodes dynamically
        if (sortBy === 'price_asc') {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        }
        
        setTimeout(() => {
            setProducts(filtered);
            setLoading(false);
        }, 300);
    }, [queryCategory, querySpecial, querySearch, appliedMaxPrice, sortBy]);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            
            {/* Left Sidebar Filter Column */}
            <aside style={{ flex: '0 0 280px', position: 'sticky', top: '2rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0', letterSpacing: '-0.5px' }}>Filter by price</h3>
                    <div style={{ height: '2px', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }}></div>
                    
                    {/* Native Input Range Controller securely managed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input 
                            type="range" 
                            min={0} 
                            max={300000} 
                            step={100} 
                            value={priceRange} 
                            onChange={e => setPriceRange(Number(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '4px', appearance: 'none', backgroundColor: '#e2e8f0', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => setAppliedMaxPrice(priceRange)} style={{ backgroundColor: '#1d4ed8', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
                                Filter
                            </button>
                            <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                                Price: ₦0 — ₦{priceRange.toLocaleString()}
                            </span>
                        </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
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
