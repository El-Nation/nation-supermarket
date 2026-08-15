import React from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
    const categories = [
        { id: 1, title: 'Fresh Produce', desc: 'Crisp fruits and vegetables', imgSrc: '/images/cat_produce.png', bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', shadow: 'rgba(34,197,94,0.3)' },
        { id: 2, title: 'Bakery & Bread', desc: 'Freshly baked daily', imgSrc: '/images/cat_bakery.png', bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', shadow: 'rgba(249,115,22,0.3)' },
        { id: 3, title: 'Dairy & Eggs', desc: 'Milk, cheese, and farm eggs', imgSrc: '/images/cat_dairy.png', bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', shadow: 'rgba(14,165,233,0.3)' },
        { id: 4, title: 'Meat & Seafood', desc: 'Premium cuts and fresh catch', imgSrc: '/images/cat_meat.png', bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', shadow: 'rgba(239,68,68,0.3)' },
        { id: 5, title: 'Pantry Staples', desc: 'Rice, pasta, and spices', imgSrc: '/images/cat_pantry.png', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', shadow: 'rgba(245,158,11,0.3)' },
        { id: 6, title: 'Snacks & Sweets', desc: 'Chips, crackers, chocolates', imgSrc: '/images/cat_snacks.png', bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', shadow: 'rgba(168,85,247,0.3)' },
        { id: 7, title: 'Beverages', desc: 'Juices, water, and sodas', imgSrc: '/images/cat_beverage.png', bg: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 100%)', shadow: 'rgba(56,189,248,0.3)' },
        { id: 8, title: 'Clothing & Apparel', desc: 'T-shirts, jeans, and fashion', imgSrc: '/images/cat_clothing.png', bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', shadow: 'rgba(99,102,241,0.3)' },
        { id: 9, title: 'Electronics', desc: 'Appliances, TVs, gadgets', imgSrc: '/images/cat_electronics.png', bg: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', shadow: 'rgba(100,116,139,0.3)' },
        { id: 10, title: 'Home & Kitchen', desc: 'Cookware down to utensils', imgSrc: '/images/cat_kitchen.png', bg: 'linear-gradient(135deg, #ffedd5 0%, #fdba74 100%)', shadow: 'rgba(249,115,22,0.3)' },
        { id: 11, title: 'Health & Beauty', desc: 'Personal care and skincare', imgSrc: '/images/cat_beauty.png', bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', shadow: 'rgba(236,72,153,0.3)' },
        { id: 12, title: 'Baby Care', desc: 'Diapers, wipes, and food', imgSrc: '/images/cat_baby.png', bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', shadow: 'rgba(20,184,166,0.3)' },
        { id: 13, title: 'Pet Supplies', desc: 'Dog food, toys, and care', imgSrc: '/images/cat_pets.png', bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', shadow: 'rgba(139,92,246,0.3)' },
        { id: 14, title: 'Household', desc: 'Cleaning and laundry needs', imgSrc: '/images/cat_household.png', bg: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', shadow: 'rgba(234,179,8,0.3)' },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
            <style>
                {`
                    .category-card {
                        text-decoration: none;
                        display: block;
                        background-color: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 16px;
                        padding: 2rem 1.5rem;
                        text-align: center;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                        position: relative;
                        overflow: hidden;
                    }
                    .category-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                        border-color: #cbd5e1;
                    }
                    .category-card-icon {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem auto;
                        font-size: 2.8rem;
                        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    .category-card:hover .category-card-icon {
                        transform: scale(1.15) rotate(5deg);
                    }
                `}
            </style>
            
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.8rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-1px' }}>Explore Avenues</h1>
                <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>Navigate through our distinct beautifully organized aisles and systematically find exactly what you need.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                {categories.map(cat => (
                    <Link key={cat.id} to={`/shop?category=${cat.id}`} className="category-card">
                        <div className="category-card-icon" style={{ background: cat.bg, boxShadow: `0 8px 16px ${cat.shadow}` }}>
                            <img 
                                src={cat.imgSrc} 
                                alt={cat.title} 
                                style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const parent = (e.target as HTMLImageElement).parentElement;
                                    if(parent) {
                                        parent.innerHTML = '<span style="font-size: 1rem; color: #64748b; text-align: center; font-weight: 700; line-height: 1.2;">IMG<br/>REQ</span>';
                                    }
                                }} 
                            />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{cat.title}</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>{cat.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
