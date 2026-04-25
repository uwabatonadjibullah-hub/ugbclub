import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useConfirm } from '../context/ConfirmContext';

export default function SiteSettings() {
  const { showAlert, showConfirm } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    socialLinks: { instagram: '', twitter: '', facebook: '', youtube: '' },
    partners: [],
    quickLinks: []
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
    await showAlert('Site settings saved successfully!');
  };

  const handleSocialChange = (platform, value) => {
    setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, [platform]: value } }));
  };

  // Partners
  const addPartner = () => {
    setSettings(s => ({ ...s, partners: [...s.partners, { name: '', url: '', logoURL: '', isPrincipal: false }] }));
  };
  const updatePartner = (index, field, value) => {
    setSettings(s => ({
      ...s,
      partners: s.partners.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };
  const removePartner = async (index) => {
    const isConfirmed = await showConfirm('Are you sure you want to remove this partner?');
    if (isConfirmed) {
      setSettings(s => ({ ...s, partners: s.partners.filter((_, i) => i !== index) }));
    }
  };
  const movePartner = (index, dir) => {
    const newP = [...settings.partners];
    if (index + dir < 0 || index + dir >= newP.length) return;
    const temp = newP[index];
    newP[index] = newP[index + dir];
    newP[index + dir] = temp;
    setSettings(s => ({ ...s, partners: newP }));
  };

  // Quick Links
  const addLink = () => {
    setSettings(s => ({ ...s, quickLinks: [...s.quickLinks, { name: '', url: '' }] }));
  };
  const updateLink = (index, field, value) => {
    setSettings(s => ({
      ...s,
      quickLinks: s.quickLinks.map((l, i) => i === index ? { ...l, [field]: value } : l)
    }));
  };
  const removeLink = async (index) => {
    const isConfirmed = await showConfirm('Are you sure you want to remove this link?');
    if (isConfirmed) {
      setSettings(s => ({ ...s, quickLinks: s.quickLinks.filter((_, i) => i !== index) }));
    }
  };
  const moveLink = (index, dir) => {
    const newL = [...settings.quickLinks];
    if (index + dir < 0 || index + dir >= newL.length) return;
    const temp = newL[index];
    newL[index] = newL[index + dir];
    newL[index + dir] = temp;
    setSettings(s => ({ ...s, quickLinks: newL }));
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
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto auto 1.5fr 1.5fr 2fr auto auto', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', background: 'var(--bg-lighter)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button type="button" onClick={() => movePartner(i, -1)} disabled={i === 0} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: i === 0 ? 'default' : 'pointer' }}>▲</button>
              <button type="button" onClick={() => movePartner(i, 1)} disabled={i === settings.partners.length - 1} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: i === settings.partners.length - 1 ? 'default' : 'pointer' }}>▼</button>
            </div>
            <input type="text" className="admin-form__input" placeholder="Partner Name" value={p.name} onChange={e => updatePartner(i, 'name', e.target.value)} required />
            <input type="url" className="admin-form__input" placeholder="Website URL" value={p.url} onChange={e => updatePartner(i, 'url', e.target.value)} />
            <input type="url" className="admin-form__input" placeholder="Logo URL" value={p.logoURL} onChange={e => updatePartner(i, 'logoURL', e.target.value)} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={p.isPrincipal} onChange={e => updatePartner(i, 'isPrincipal', e.target.checked)} />
              Principal?
            </label>
            <button type="button" onClick={() => removePartner(i)} style={{ background: 'transparent', color: 'var(--loss)', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
          </div>
        ))}
        <div style={{ marginBottom: '2rem' }}></div>

        {/* Quick Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--accent)' }}>Footer Quick Links</h3>
          <button type="button" onClick={addLink} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'var(--bg-lighter)' }}>+ Add Link</button>
        </div>
        {settings.quickLinks.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr 2fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <button type="button" onClick={() => moveLink(i, -1)} disabled={i === 0} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: i === 0 ? 'default' : 'pointer', padding: '0.5rem' }}>▲</button>
            <button type="button" onClick={() => moveLink(i, 1)} disabled={i === settings.quickLinks.length - 1} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: i === settings.quickLinks.length - 1 ? 'default' : 'pointer', padding: '0.5rem' }}>▼</button>
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
