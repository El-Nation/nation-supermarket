import React from 'react';

export default function PlaceholderView({ title, description }: { title: string, description?: string }) {
    return (
        <div>
            <div style={{marginBottom: '2rem'}}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem', fontWeight: 700 }}>{title}</h2>
                {description && <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>{description}</p>}
            </div>
            
            <div className="admin-table-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{color: '#cbd5e1', marginBottom: '1.5rem'}}>
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{margin: '0 auto'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h3 style={{color: '#334155', margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Module under construction</h3>
                <p style={{color: '#64748b', margin: 0}}>The administrative logic for {title} is strictly planned for a future iterative phase.</p>
            </div>
        </div>
    );
}
