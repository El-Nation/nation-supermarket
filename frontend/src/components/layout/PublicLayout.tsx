import React from 'react';

import { Outlet as RouterOutlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

export default function PublicLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Helmet>
                <title>Nation Supermarket | Fresh Produce & Daily Groceries</title>
                <meta name="description" content="Shop online at Nation Supermarket for fresh groceries, fast delivery, and premium household items in Nigeria." />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Nation Supermarket" />
            </Helmet>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
                <RouterOutlet />
            </main>
            <Footer />
        </div>
    );
}
