import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useConfirm } from '../context/ConfirmContext';

export default function ManageContent() {
  const { showConfirm, showAlert } = useConfirm();
  const [media, setMedia] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Editing state
  const [editMedia, setEditMedia] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const unsubMedia = onSnapshot(collection(db, 'media'), snap => {
      setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubProd = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    setLoading(false);
    return () => { unsubMedia(); unsubProd(); };
  }, []);

  const handleDelete = async (type, id) => {
    const isConfirmed = await showConfirm(`Are you sure you want to delete this ${type}?`);
    if (isConfirmed) {
      await deleteDoc(doc(db, type === 'video' ? 'media' : 'products', id));
      setMsg(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleUpdateMedia = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'media', editMedia.id), {
        title: editMedia.title,
        type: editMedia.type,
        embedCode: editMedia.embedCode,
        thumbnailURL: editMedia.thumbnailURL,
        featured: editMedia.featured
      });
      setEditMedia(null);
      setMsg('Media updated!');
    } catch { setMsg('Error updating media'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'products', editProduct.id), {
        name: editProduct.name,
        category: editProduct.category,
        price: Number(editProduct.price),
        imageURL: editProduct.imageURL
      });
      setEditProduct(null);
      setMsg('Product updated!');
    } catch { setMsg('Error updating product'); }
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Manage Content</h1></div>
      {msg && <div style={{background:'var(--accent)',color:'var(--bg-dark)',padding:'1rem',borderRadius:'0.5rem',marginBottom:'1rem',fontWeight:700}}>{msg}</div>}

      <div className="charts-grid">
        {/* Media Section */}
        <div className="chart-box">
          <h3 className="chart-box__title">UGB TV Videos</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Type</th><th>Actions</th></tr></thead>
              <tbody>
                {media.map(m => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.type}</td>
                    <td>
                      <button onClick={() => setEditMedia(m)} style={{color:'var(--accent)', marginRight:'10px'}}>Edit</button>
                      <button onClick={() => handleDelete('video', m.id)} style={{color:'var(--loss)'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Section */}
        <div className="chart-box">
          <h3 className="chart-box__title">Store Products</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.price} RWF</td>
                    <td>
                      <button onClick={() => setEditProduct(p)} style={{color:'var(--accent)', marginRight:'10px'}}>Edit</button>
                      <button onClick={() => handleDelete('product', p.id)} style={{color:'var(--loss)'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Media Modal-like Overlay */}
      {editMedia && (
        <div className="modal-overlay">
          <div className="modal-content chart-box" style={{maxWidth:'600px', width:'90%'}}>
            <h3 className="chart-box__title">Edit Media</h3>
            <form onSubmit={handleUpdateMedia}>
              <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={editMedia.title} onChange={e=>setEditMedia({...editMedia, title:e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Type</label><select className="form-input" value={editMedia.type} onChange={e=>setEditMedia({...editMedia, type:e.target.value})}><option>Highlights</option><option>Documentary Feature</option><option>Vlog</option><option>Spotlight</option></select></div>
                <div className="form-group"><label className="form-label">Thumbnail URL</label><input type="url" className="form-input" value={editMedia.thumbnailURL} onChange={e=>setEditMedia({...editMedia, thumbnailURL:e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">Embed Code</label><textarea className="form-input" rows="3" value={editMedia.embedCode} onChange={e=>setEditMedia({...editMedia, embedCode:e.target.value})} required /></div>
              <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><input type="checkbox" checked={editMedia.featured} onChange={e=>setEditMedia({...editMedia, featured:e.target.checked})} /> Featured Video</label></div>
              <div style={{display:'flex', gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditMedia(null)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal-like Overlay */}
      {editProduct && (
        <div className="modal-overlay">
          <div className="modal-content chart-box" style={{maxWidth:'600px', width:'90%'}}>
            <h3 className="chart-box__title">Edit Product</h3>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-group"><label className="form-label">Product Name</label><input type="text" className="form-input" value={editProduct.name} onChange={e=>setEditProduct({...editProduct, name:e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={editProduct.category} onChange={e=>setEditProduct({...editProduct, category:e.target.value})}><option>Authentic</option><option>Lifestyle</option><option>Fan Gear</option><option>Accessories</option></select></div>
                <div className="form-group"><label className="form-label">Price (RWF)</label><input type="number" className="form-input" value={editProduct.price} onChange={e=>setEditProduct({...editProduct, price:e.target.value})} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Image URL</label><input type="url" className="form-input" value={editProduct.imageURL} onChange={e=>setEditProduct({...editProduct, imageURL:e.target.value})} required /></div>
              <div style={{display:'flex', gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
