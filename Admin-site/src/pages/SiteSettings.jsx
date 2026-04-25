import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    socialLinks: { instagram: '', twitter: '', facebook: '', youtube: '' },
    partners: [{ name: 'AZAM', url: '', isPrincipal: true }],
    quickLinks: [
      { name: 'Home', url: '/' },
      { name: 'Season Schedule', url: '/schedule' },
      { name: 'Team Roster', url: '/roster' },
      { name: 'Official Store', url: '/store' },
      { name: 'UGB TV', url: '/media' }
    ]
  });

  useEffect(() => {
    getDoc(doc(db, 'siteSettings', 'footer')).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          socialLinks: data.socialLinks || { instagram: '', twitter: '', facebook: '', youtube: '' },
          partners: data.partners || [],
          quickLinks: data.quickLinks || []
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, 'siteSettings', 'footer'), settings, { merge: true });
    setSaving(false);
    alert('Site settings saved successfully!');
  };

  const handleSocialChange = (platform, value) => {
    setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, [platform]: value } }));
  };

  // Partners
  const addPartner = () => {
    setSettings(s => ({ ...s, partners: [...s.partners, { name: '', url: '', isPrincipal: false }] }));
  };
  const updatePartner = (index, field, value) => {
    const newP = [...settings.partners];
    newP[index][field] = value;
    setSettings(s => ({ ...s, partners: newP }));
  };
  const removePartner = (index) => {
    setSettings(s => ({ ...s, partners: s.partners.filter((_, i) => i !== index) }));
  };

  // Quick Links
  const addLink = () => {
    setSettings(s => ({ ...s, quickLinks: [...s.quickLinks, { name: '', url: '' }] }));
  };
  const updateLink = (index, field, value) => {
    const newL = [...settings.quickLinks];
    newL[index][field] = value;
    setSettings(s => ({ ...s, quickLinks: newL }));
  };
  const removeLink = (index) => {
    setSettings(s => ({ ...s, quickLinks: s.quickLinks.filter((_, i) => i !== index) }));
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Site Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your footer links, social accounts, and partners.</p>
      </div>

      <form onSubmit={handleSave} className="admin-form" style={{ maxWidth: 800 }}>
        
        {/* Social Links */}
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Social Accounts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="admin-form__group">
            <label className="admin-form__label">Instagram URL</label>
            <input type="url" className="admin-form__input" placeholder="https://instagram.com/..." value={settings.socialLinks.instagram} onChange={e => handleSocialChange('instagram', e.target.value)} />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">X / Twitter URL</label>
            <input type="url" className="admin-form__input" placeholder="https://x.com/..." value={settings.socialLinks.twitter} onChange={e => handleSocialChange('twitter', e.target.value)} />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Facebook URL</label>
            <input type="url" className="admin-form__input" placeholder="https://facebook.com/..." value={settings.socialLinks.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">YouTube URL</label>
            <input type="url" className="admin-form__input" placeholder="https://youtube.com/..." value={settings.socialLinks.youtube} onChange={e => handleSocialChange('youtube', e.target.value)} />
          </div>
        </div>

        {/* Partners */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--accent)' }}>Our Partners</h3>
          <button type="button" onClick={addPartner} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'var(--bg-lighter)' }}>+ Add Partner</button>
        </div>
        {settings.partners.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr auto auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input type="text" className="admin-form__input" placeholder="Partner Name" value={p.name} onChange={e => updatePartner(i, 'name', e.target.value)} required />
            <input type="url" className="admin-form__input" placeholder="URL Link" value={p.url} onChange={e => updatePartner(i, 'url', e.target.value)} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={p.isPrincipal} onChange={e => updatePartner(i, 'isPrincipal', e.target.checked)} />
              Principal?
            </label>
            <button type="button" onClick={() => removePartner(i)} style={{ background: 'transparent', color: 'var(--loss)', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>&times;</button>
          </div>
        ))}
        <div style={{ marginBottom: '2rem' }}></div>

        {/* Quick Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--accent)' }}>Footer Quick Links</h3>
          <button type="button" onClick={addLink} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'var(--bg-lighter)' }}>+ Add Link</button>
        </div>
        {settings.quickLinks.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input type="text" className="admin-form__input" placeholder="Link Display Text" value={l.name} onChange={e => updateLink(i, 'name', e.target.value)} required />
            <input type="text" className="admin-form__input" placeholder="URL (e.g. /schedule or https://...)" value={l.url} onChange={e => updateLink(i, 'url', e.target.value)} required />
            <button type="button" onClick={() => removeLink(i)} style={{ background: 'transparent', color: 'var(--loss)', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>&times;</button>
          </div>
        ))}
        
        <div style={{ marginTop: '3rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
