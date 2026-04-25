import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function UploadContent() {
  const [mediaData, setMediaData] = useState({ title: '', type: 'Highlights', embedCode: '', thumbnailURL: '', featured: false });
  const [productData, setProductData] = useState({ name: '', category: 'Authentic', price: '', imageURL: '' });
  const [msg, setMsg] = useState('');

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'media'), { ...mediaData, viewCount: 0, createdAt: new Date().toISOString() });
      setMsg('Media added successfully!');
      setMediaData({ title: '', type: 'Highlights', embedCode: '', thumbnailURL: '', featured: false });
    } catch { setMsg('Error adding media'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), { ...productData, price: Number(productData.price), isNew: true });
      setMsg('Product added successfully!');
      setProductData({ name: '', category: 'Authentic', price: '', imageURL: '' });
    } catch { setMsg('Error adding product'); }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Upload Content</h1></div>
      {msg && <div style={{background:'var(--accent)',color:'var(--bg-dark)',padding:'1rem',borderRadius:'0.5rem',marginBottom:'1rem',fontWeight:700}}>{msg}</div>}

      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-box__title">Add Media (UGB TV)</h3>
          <form onSubmit={handleMediaSubmit}>
            <div className="form-group"><label className="form-label">Title</label><input type="text" required className="form-input" value={mediaData.title} onChange={e=>setMediaData({...mediaData, title:e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Type</label><select className="form-input" value={mediaData.type} onChange={e=>setMediaData({...mediaData, type:e.target.value})}><option>Highlights</option><option>Documentary Feature</option><option>Vlog</option><option>Spotlight</option></select></div>
              <div className="form-group"><label className="form-label">Thumbnail URL (Optional)</label><input type="url" className="form-input" value={mediaData.thumbnailURL} onChange={e=>setMediaData({...mediaData, thumbnailURL:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">YouTube Embed Code</label><textarea required className="form-input" rows="3" value={mediaData.embedCode} onChange={e=>setMediaData({...mediaData, embedCode:e.target.value})} placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>' /></div>
            <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><input type="checkbox" checked={mediaData.featured} onChange={e=>setMediaData({...mediaData, featured:e.target.checked})} /> Featured Video</label></div>
            <button type="submit" className="btn btn-primary">Upload Media</button>
          </form>
        </div>

        <div className="chart-box">
          <h3 className="chart-box__title">Add Product (Store)</h3>
          <form onSubmit={handleProductSubmit}>
            <div className="form-group"><label className="form-label">Product Name</label><input type="text" required className="form-input" value={productData.name} onChange={e=>setProductData({...productData, name:e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={productData.category} onChange={e=>setProductData({...productData, category:e.target.value})}><option>Authentic</option><option>Lifestyle</option><option>Fan Gear</option><option>Accessories</option></select></div>
              <div className="form-group"><label className="form-label">Price (RWF)</label><input type="number" required className="form-input" value={productData.price} onChange={e=>setProductData({...productData, price:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Image URL</label><input type="url" required className="form-input" value={productData.imageURL} onChange={e=>setProductData({...productData, imageURL:e.target.value})} /></div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
