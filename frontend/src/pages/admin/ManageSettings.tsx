import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Camera, Server, Mail, Shield, Smartphone, Key, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ManageSettings() {
    const { updateUser } = useAuth();
    const [storeAddress, setStoreAddress] = useState('');
    const [saving, setSaving] = useState(false);

    // Profile State
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // 2FA State
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                const addressObj = res.data.find((s: any) => s.key === 'store_pickup_address');
                if (addressObj) setStoreAddress(addressObj.value);
            } catch (error) {}
        };
        const fetchProfile = async () => {
            try {
                const res = await api.get('/admin/profile');
                setTwoFactorEnabled(res.data.two_factor_enabled);
                setAvatarUrl(res.data.avatar_url || '');
                setEmail(res.data.email || '');
                setPhone(res.data.phone || '');
            } catch (e) {}
        };
        fetchSettings();
        fetchProfile();
    }, []);

    const handleSaveStoreAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/admin/settings', { key: 'store_pickup_address', value: storeAddress });
            alert('Store Pickup configuration correctly bound to database global state.');
        } catch (e) {
            alert('Settings persist failure');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', e.target.files[0]);
            
            const res = await api.post('/admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.avatar_url) {
                setAvatarUrl(res.data.avatar_url);
                updateUser({ avatar_url: res.data.avatar_url });
            }
        } catch(e) {
            alert('Avatar upload failed. Check server logs.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!window.confirm("Are you sure you want to remove your profile image?")) return;
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('remove_avatar', 'true');
            await api.post('/admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl('');
            updateUser({ avatar_url: '' });
        } catch(e) {
            alert('Failed to remove avatar.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('current_password', pass);
            if(newPass) formData.append('new_password', newPass);
            if(email) formData.append('new_email', email);
            if(phone) formData.append('new_phone', phone);

            await api.post('/admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Admin profile updated successfully.');
            setPass(''); setNewPass('');
        } catch(e: any) {
            alert(e.response?.data?.message || 'Access blocked. Current strict password incorrect.');
        }
    };

    const handleGenerate2FA = async () => {
        try {
            const res = await api.post('/auth/2fa/generate');
            setQrCode(res.data.qrCode);
            setSecret(res.data.secret);
        } catch(e) {
            alert('Error generating secure key.');
        }
    };

    const handleVerify2FA = async () => {
        try {
            await api.post('/auth/2fa/verify', { token });
            alert('2FA active successfully!');
            setQrCode(''); setToken('');
            setTwoFactorEnabled(true);
        } catch(e) {
            alert('Invalid verification token.');
        }
    };

    const handleDisable2FA = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA?")) return;
        try {
            await api.post('/auth/2fa/disable');
            alert('2FA security constraint successfully removed.');
            setTwoFactorEnabled(false);
        } catch(e) { alert('Failed disabling 2FA'); }
    };

    return (
        <div style={{maxWidth: 1000, color: '#1e293b'}}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Global Command Center</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Configure structural environment states, security limits, and system integrations.</p>
                </div>
            </div>
            <div className="settings-grid">
                
                {/* Main Settings Column */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                    
                    {/* Graphic Profile Avatar Module (Moved to Top) */}
                    <div className="admin-card" style={{padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', textAlign: 'center'}}>
                        <h3 style={{margin: '0 0 1.5rem 0', color: '#0f172a', fontWeight: 600, fontSize: '1.1rem'}}>Administrative Avatar</h3>
                        <div style={{
                            width: 140, height: 140, borderRadius: '50%', backgroundColor: '#f1f5f9', 
                            overflow: 'hidden', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', border: '3px solid #e2e8f0', position: 'relative'
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Admin Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            ) : (
                                <Camera size={48} color="#94a3b8" />
                            )}
                            {uploadingAvatar && (
                                <div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <div className="admin-spinner" style={{width: 24, height: 24, borderColor: '#0f172a', borderTopColor: 'transparent'}}></div>
                                </div>
                            )}
                        </div>
                        
                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleAvatarUpload} 
                                    style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10}}
                                    title="Upload Profile Picture"
                                    disabled={uploadingAvatar}
                                />
                                <button type="button" className="admin-btn-primary" style={{backgroundColor: '#0f172a', color: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <UploadCloud size={18} /> {uploadingAvatar ? 'Uploading...' : 'Upload Profile Image'}
                                </button>
                            </div>
                            {avatarUrl && (
                                <button type="button" onClick={handleRemoveAvatar} className="admin-btn-primary" style={{backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem'}} disabled={uploadingAvatar}>
                                    Remove
                                </button>
                            )}
                        </div>
                        <p style={{margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.8rem'}}>PNG, JPG up to 5MB.</p>
                    </div>

                    {/* Security Management Panel */}
                    <div className="admin-card" style={{padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                            <Shield color="#0f172a" size={24} />
                            <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.2rem'}}>Admin Identity & Security</h3>
                        </div>
                        
                        <form onSubmit={handleUpdateProfile} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            
                            <div className="settings-form-grid">
                                <div>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                        <Mail size={16} /> Email
                                    </label>
                                    <input type="email" required className="form-input" style={{backgroundColor: '#f8fafc', borderColor: '#cbd5e1'}} value={email} onChange={e=>setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                        <Smartphone size={16} /> Phone Number
                                    </label>
                                    <input type="text" className="form-input" style={{backgroundColor: '#f8fafc', borderColor: '#cbd5e1'}} value={phone} onChange={e=>setPhone(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ef4444', fontWeight: 600}}>
                                        <Key size={16} /> Current Password (Required)
                                    </label>
                                    <input type="password" required className="form-input" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Auth Key" style={{border: '1px solid #fca5a5'}} />
                                </div>
                                <div>
                                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500}}>
                                        <Key size={16} /> New Password (Optional)
                                    </label>
                                    <input type="password" className="form-input" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Leave blank to preserve" />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                                <button type="submit" className="admin-btn-primary" style={{backgroundColor: '#0f172a', display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 500}}>
                                    Lock Security Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2FA Panel */}
                    <div className="admin-card" style={{padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                            <Smartphone color="#0f172a" size={24} />
                            <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1.2rem'}}>Multi-Factor Protection Engine</h3>
                        </div>
                        {twoFactorEnabled ? (
                            <div style={{backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: 8, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                    <Shield color="#10b981" size={32} />
                                    <div>
                                        <h4 style={{margin: '0 0 0.25rem 0', color: '#065f46', fontSize: '1.1rem'}}>2FA Array Active</h4>
                                        <p style={{margin: 0, color: '#047857', fontSize: '0.9rem'}}>Your digital limits are actively intercepting authentication routines securely.</p>
                                    </div>
                                </div>
                                <button onClick={handleDisable2FA} className="admin-btn-primary" style={{backgroundColor: '#ef4444'}}>Destabilize 2FA</button>
                            </div>
                        ) : !qrCode ? (
                            <div style={{backgroundColor: '#f8fafc', padding: '2rem', borderRadius: 8, border: '1px dashed #cbd5e1', textAlign: 'center'}}>
                                <Shield color="#94a3b8" size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
                                <h4 style={{margin: '0 0 0.5rem 0', color: '#334155'}}>2FA Authentication</h4>
                                <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Secure your administrative account strictly against unauthorized access by enabling Two-Factor Authentication. This integrates seamlessly with Google Authenticator or Authy natively.</p>
                                <button onClick={handleGenerate2FA} className="admin-btn-primary" style={{backgroundColor: '#0f172a'}}>Provision Secure Key</button>
                            </div>
                        ) : (
                            <div style={{backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap'}}>
                                <div style={{backgroundColor: 'white', padding: 8, borderRadius: 12, border: '1px solid #cbd5e1', margin: '0 auto'}}>
                                    <img src={qrCode} alt="2FA QR" style={{display: 'block'}}/>
                                </div>
                                <div style={{flex: 1}}>
                                    <p style={{margin: '0 0 0.75rem 0', color: '#334155', fontWeight: 500, fontSize: '0.95rem'}}>1. Mount this visual node securely via Authenticator.</p>
                                    <p style={{margin: '0 0 1.25rem 0', color: '#334155', fontWeight: 500, fontSize: '0.95rem'}}>
                                        Fallback Base32 Vector:<br/>
                                        <code style={{background: 'white', padding: '6px 12px', borderRadius: 6, color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', border: '1px solid #e2e8f0', display: 'inline-block', marginTop: '6px', letterSpacing: '2px', wordBreak: 'break-all'}}>{secret}</code>
                                    </p>
                                    <div style={{display: 'flex', gap: '1rem'}}>
                                        <input type="text" className="form-input" placeholder="6-digit verification code" value={token} onChange={e=>setToken(e.target.value)} style={{flex: 1, letterSpacing: '2px', textAlign: 'center', fontWeight: 'bold'}} />
                                        <button onClick={handleVerify2FA} className="admin-btn-primary" style={{backgroundColor: '#0f172a'}}>Lock Key</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side Column */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                    
                    {/* System Configuration Block */}
                    <div className="admin-card" style={{padding: '1.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                            <Server color="#0f172a" size={20} />
                            <h3 style={{margin: 0, color: '#0f172a', fontWeight: 600, fontSize: '1rem'}}>Server Integrations</h3>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'white', borderRadius: 6, border: '1px solid #e2e8f0'}}>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: 500}}>
                                    <Mail size={16} color="#64748b" /> SMTP Engine
                                </span>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600}}>
                                    <CheckCircle2 size={14} /> ACTIVE
                                </span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'white', borderRadius: 6, border: '1px solid #e2e8f0'}}>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: 500}}>
                                    <Server size={16} color="#64748b" /> Cloudinary Proxy
                                </span>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600}}>
                                    <CheckCircle2 size={14} /> ROUTED
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Physical Store Config */}
                    <div className="admin-card" style={{padding: '1.5rem', border: '1px solid #e2e8f0'}}>
                        <h3 style={{margin: '0 0 1rem 0', color: '#0f172a', fontWeight: 600, fontSize: '1rem'}}>Store Pickup Location</h3>
                        <form onSubmit={handleSaveStoreAddress}>
                            <textarea 
                                className="form-input" 
                                required rows={3} value={storeAddress} onChange={e=>setStoreAddress(e.target.value)} 
                                placeholder="16 Ihama Road Boundary"
                                style={{backgroundColor: '#f8fafc', marginBottom: '0.75rem'}}
                            />
                            <button type="submit" disabled={saving} className="admin-btn-primary" style={{width: '100%', backgroundColor: '#0f172a'}}>
                                {saving ? 'Writing...' : 'Update Base Parameters'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
