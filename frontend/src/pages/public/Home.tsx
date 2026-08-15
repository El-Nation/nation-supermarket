import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/shop/ProductCard';
import { MOCK_PRODUCTS } from './Shop';

// Utilizing the 14 physical categories natively mapping to the API seed sequences 
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

export default function Home() {
    const popularProducts = MOCK_PRODUCTS.slice(0, 8);
    
    // Special Offers rigorously scans strictly for verified deal bounds cleanly natively
    const specialOffers = MOCK_PRODUCTS.filter(p => p.compare_price && p.compare_price > p.price).slice(0, 8);

    // Intelligent auto-scrolling matrix states
    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const [isSliderHovered, setIsSliderHovered] = useState(false);
    
    // Primary Dynamic Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const HERO_SLIDES = [
        {
            title: "A Clean, Fresh Home",
            subtitle: "Heavy detergents, bulk tissue, and home cleaners delivered straight to your door.",
            image: "/images/cat_household.png",
            bg: "#f8fafc",
            buttonLabel: "Shop Household"
        },
        {
            title: "Fresh Premium Groceries",
            subtitle: "Daily harvest fruits, vegetables, and organic farm produce natively sourced.",
            image: "/images/cat_produce.png",
            bg: "#f0fdf4",
            buttonLabel: "Shop Produce"
        },
        {
            title: "Premium Electronics",
            subtitle: "Upgrade your lifestyle with cutting-edge smart appliances and gadgets.",
            image: "/images/cat_electronics.png",
            bg: "#fdf4ff",
            buttonLabel: "Shop Electronics"
        }
    ];

    useEffect(() => {
        if (isSliderHovered) return;
        
        const sliderInterval = setInterval(() => {
            if (categoryScrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
                
                // If we reach the end natively, reset to start smoothly
                if (scrollLeft + clientWidth >= scrollWidth - 1) {
                    categoryScrollRef.current.scrollLeft = 0;
                } else {
                    categoryScrollRef.current.scrollLeft += 1;
                }
            }
        }, 20); // Fluid 20ms interval matching premium e-commerce mechanics

        return () => clearInterval(sliderInterval);
    }, [isSliderHovered]);

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh', paddingBottom: '5rem' }}>
            
            {/* 0. Primary Featured Categories Carousel */}
            <section style={{ backgroundColor: HERO_SLIDES[currentSlide].bg, transition: 'background-color 0.5s ease', padding: '0 2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', minHeight: '450px' }}>
                    
                    {/* Carousel Left Content */}
                    <div style={{ padding: '4rem 0', flex: '1 1 500px', minWidth: '300px', zIndex: 2 }}>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0', lineHeight: 1.05, letterSpacing: '-1.5px' }}>
                            {HERO_SLIDES[currentSlide].title}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#475569', margin: '0 0 2.5rem 0', fontWeight: 600, maxWidth: '450px' }}>
                            {HERO_SLIDES[currentSlide].subtitle}
                        </p>
                        <Link to="/shop" style={{ display: 'inline-block', backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'background-color 0.2s', textDecoration: 'none' }}>
                            {HERO_SLIDES[currentSlide].buttonLabel}
                        </Link>
                    </div>

                    {/* Carousel Right Graphic */}
                    <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'flex-end', alignSelf: 'center', position: 'relative', height: '100%', zIndex: 1 }}>
                        <img src={HERO_SLIDES[currentSlide].image} alt="Featured Slide" style={{ maxWidth: '400px', maxHeight: '350px', objectFit: 'contain', filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))', transform: 'scale(1.1)', transition: 'opacity 0.5s ease' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                </div>

                {/* Carousel Pagination Dots */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '1rem', zIndex: 10 }}>
                    {HERO_SLIDES.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            style={{ 
                                width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                                border: '2px solid #0f172a', padding: 0,
                                backgroundColor: currentSlide === i ? '#0f172a' : 'transparent',
                                transition: '0.2s'
                            }} 
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* 1. Shop by Categories (Elevated to top layout) */}
            <section style={{ maxWidth: '1200px', margin: '3rem auto 0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Shop by Category</h2>
                    <Link to="/shop" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        View all categories <ChevronRight size={16} />
                    </Link>
                </div>
                <div 
                    ref={categoryScrollRef}
                    onMouseEnter={() => setIsSliderHovered(true)}
                    onMouseLeave={() => setIsSliderHovered(false)}
                    onTouchStart={() => setIsSliderHovered(true)}
                    onTouchEnd={() => setIsSliderHovered(false)}
                    style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    {CATEGORIES.map(cat => {
                        // Dynamically resolve an authentic transparent mock product image mapping cleanly to the category
                        const referenceImage = MOCK_PRODUCTS.find(p => p.category_id === cat.id)?.image_url || '/images/cat_produce.png';
                        
                        return (
                            <Link key={cat.id} to={`/shop?category=${cat.id}`} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textDecoration: 'none', width: '100px', padding: '0.5rem', backgroundColor: 'transparent', transition: 'transform 0.2s', border: 'none' }}>
                                <img src={referenceImage} alt={cat.name} style={{ width: '75px', height: '75px', objectFit: 'contain', filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.08))', marginBottom: '0.75rem' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 3. Popular / Featured Products */}
            <section style={{ maxWidth: '1200px', margin: '3.5rem auto 0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Popular Items</h2>
                    <Link to="/shop" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        View all popular items <ChevronRight size={16} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {popularProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            {/* 4. Special Offers (Strict mathematical bounds conditionally rendering) */}
            {specialOffers.length > 0 && (
                <section style={{ maxWidth: '1200px', margin: '4rem auto 0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag color="#ef4444" size={24} />
                            <h2 style={{ fontSize: '1.25rem', color: '#ef4444', margin: 0, fontWeight: 800 }}>Special Offers</h2>
                        </div>
                        <Link to="/shop" style={{ color: '#ef4444', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            View all special offers <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {specialOffers.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}

            {/* 4. Supermarket Promotional Hero (Moved near footer) */}
            <section style={{ backgroundColor: '#e0f2fe', padding: '0 2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden', marginTop: '4rem' }}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap' }}>
                    
                    {/* Hero Left Content */}
                    <div style={{ padding: '6rem 0', flex: '1 1 500px', minWidth: '300px' }}>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.1, letterSpacing: '-1px' }}>
                            Stay home & get your daily needs delivered to you
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#475569', margin: '0 0 2.5rem 0' }}>
                            Start your daily shopping with <span style={{ color: '#0ea5e9', fontWeight: 700 }}>Nation Supermarket</span>
                        </p>
                        
                        {/* Subscription Input Layer */}
                        <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '50px', overflow: 'hidden', padding: '0.4rem', maxWidth: '500px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <input type="email" placeholder="Email address*" style={{ flex: 1, padding: '1rem 1.5rem', border: 'none', outline: 'none', fontSize: '1.05rem', backgroundColor: 'transparent' }} />
                            <button style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '50px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Hero Right Graphic */}
                    <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', alignSelf: 'flex-end', position: 'relative' }}>
                        <img src="/images/courier_hero.png" alt="Fast Supermarket Delivery" style={{ width: '100%', maxWidth: '550px', objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))', marginBottom: '-5px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                </div>
            </section>

            {/* 5. Explore All Products */}
            <section style={{ maxWidth: '1200px', margin: '4rem auto 0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                <Link to="/shop" style={{ display: 'inline-block', backgroundColor: 'transparent', border: '2px solid #0f172a', color: '#0f172a', textDecoration: 'none', padding: '1rem 3rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', transition: '0.2s' }}>
                    Explore All Products
                </Link>
            </section>
            
            <style>{`
                /* Hide scrollbar for category slider seamlessly gracefully */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
