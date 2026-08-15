import React from 'react';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', padding: '3rem 2rem', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.25rem' }}>Nation Supermarket</h3>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Shop online, pay securely, choose delivery or pickup.</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>&copy; {new Date().getFullYear()} Nation Supermarket. All rights reserved.</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1rem' }}>Contact Support</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Email: <span style={{ color: '#38bdf8' }}>eghedestiny10@gmail.com</span></p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Phone/WhatsApp: <strong>07066784058</strong></p>
                </div>
            </div>
        </footer>
    );
}
