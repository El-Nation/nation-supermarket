import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
