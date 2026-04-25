import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useConfirm } from '../context/ConfirmContext';

export default function ManagePlayers() {
  const { showConfirm } = useConfirm();
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({ name: '', number: '', position: 'GUARD', photoURL: '' });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'players'), snap => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'players', editingId), {
          ...formData, number: Number(formData.number)
        });
        setMsg('Player updated successfully!');
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'players'), {
          ...formData, number: Number(formData.number), status: 'active', stats: { ppg: '0.0', reb: '0.0', ast: '0.0' }
        });
        setMsg('Player added successfully!');
      }
      setFormData({ name: '', number: '', position: 'GUARD', photoURL: '' });
    } catch { setMsg('Error saving player'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({ name: p.name, number: p.number, position: p.position, photoURL: p.photoURL });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDepart = async (id) => {
    const isConfirmed = await showConfirm('Mark this player as departed?');
    if (isConfirmed) {
      await updateDoc(doc(db, 'players', id), { status: 'departed', departedDate: new Date().toISOString() });
    }
  };

  const active = players.filter(p => p.status === 'active');
  const departed = players.filter(p => p.status === 'departed');

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Manage Players</h1></div>
      {msg && <div style={{background:'var(--accent)',color:'var(--bg-dark)',padding:'1rem',borderRadius:'0.5rem',marginBottom:'1rem',fontWeight:700}}>{msg}</div>}

      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-box__title">Active Roster</h3>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Name</th><th>Pos</th><th>Action</th></tr></thead>
            <tbody>
              {active.map(p => (
                <tr key={p.id}>
                  <td>{p.number}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><img src={p.photoURL} alt="" style={{width:24,height:24,borderRadius:'50%',objectFit:'cover'}}/>{p.name}</div></td>
                  <td>{p.position}</td>
                  <td style={{display:'flex', gap:'1rem'}}>
                    <button onClick={() => startEdit(p)} style={{color:'var(--accent)',textDecoration:'underline'}}>Edit</button>
                    <button onClick={() => handleDepart(p.id)} style={{color:'var(--loss)',textDecoration:'underline'}}>Depart</button>
                  </td>
                </tr>
              ))}
              {active.length === 0 && <tr><td colSpan="4">No active players</td></tr>}
            </tbody>
          </table>
          <h3 className="chart-box__title" style={{marginTop:'2rem'}}>Former Players</h3>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Name</th><th>Departed</th></tr></thead>
            <tbody>
              {departed.map(p => (
                <tr key={p.id}><td>{p.number}</td><td>{p.name}</td><td>{p.departedDate ? new Date(p.departedDate).toLocaleDateString() : '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-box">
          <h3 className="chart-box__title">{editingId ? 'Edit Player' : 'Add New Player'}</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" required className="form-input" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Jersey Number</label><input type="number" required className="form-input" value={formData.number} onChange={e=>setFormData({...formData, number:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Position</label><select className="form-input" value={formData.position} onChange={e=>setFormData({...formData, position:e.target.value})}><option>GUARD</option><option>FORWARD</option><option>CENTER</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Photo URL</label><input type="url" required className="form-input" value={formData.photoURL} onChange={e=>setFormData({...formData, photoURL:e.target.value})} /></div>
            <div style={{display:'flex', gap:'1rem'}}>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update Player' : 'Add to Roster'}</button>
              {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'',number:'',position:'GUARD',photoURL:''})}} className="btn btn-ghost">Cancel</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
