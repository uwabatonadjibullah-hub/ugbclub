import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useConfirm } from '../context/ConfirmContext';

export default function Matches() {
  const { showConfirm } = useConfirm();
  const [matches, setMatches] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    date: '', opponent: '', opponentLogo: '', venue: '', time: '', isHome: true, status: 'upcoming', ugbScore: '', opponentScore: '', result: 'upcoming', ugbLogo: '/favicon-32x32.png'
  });

  const isFutureDate = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) > new Date();
  };

  useEffect(() => {
    const q = query(collection(db, 'schedule'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      isHome: String(formData.isHome) === 'true',
      ugbScore: formData.ugbScore ? parseInt(formData.ugbScore) : 0,
      opponentScore: formData.opponentScore ? parseInt(formData.opponentScore) : 0
    };

    if (editingId) {
      await updateDoc(doc(db, 'schedule', editingId), data);
    } else {
      await addDoc(collection(db, 'schedule'), data);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData({ date: '', opponent: '', opponentLogo: '', venue: '', time: '', isHome: true, status: 'upcoming', ugbScore: '', opponentScore: '', result: 'upcoming', ugbLogo: '/favicon-32x32.png' });
  };

  const editMatch = (m) => {
    setFormData({ ...m, ugbLogo: m.ugbLogo || '/favicon-32x32.png', opponentLogo: m.opponentLogo || '' });
    setEditingId(m.id);
    setIsAdding(true);
  };

  const deleteMatch = async (id) => {
    const isConfirmed = await showConfirm('Delete this match?');
    if (isConfirmed) {
      await deleteDoc(doc(db, 'schedule', id));
    }
  };

  const getButtonText = () => {
    if (editingId) return 'Update Match';
    if (isFutureDate(formData.date)) return 'Schedule Match';
    return 'Save Match';
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Matches Management</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add New Match'}
        </button>
      </div>

      {isAdding && (
        <form className="admin-form" onSubmit={handleSave} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form__group">
              <label className="admin-form__label">Opponent Team Name</label>
              <input type="text" className="admin-form__input" value={formData.opponent} onChange={e => setFormData({...formData, opponent: e.target.value})} required />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Opponent Logo URL (Optional)</label>
              <input type="url" className="admin-form__input" placeholder="https://..." value={formData.opponentLogo} onChange={e => setFormData({...formData, opponentLogo: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form__group">
              <label className="admin-form__label">Date</label>
              <input type="date" className="admin-form__input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Time</label>
              <input type="time" className="admin-form__input" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form__group">
              <label className="admin-form__label">Venue</label>
              <input type="text" className="admin-form__input" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Home/Away</label>
              <select className="admin-form__input" value={formData.isHome} onChange={e => setFormData({...formData, isHome: e.target.value})}>
                <option value={true}>Home</option>
                <option value={false}>Away</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="admin-form__group">
              <label className="admin-form__label">Status</label>
              <select className="admin-form__input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">UGB Score</label>
              <input type="number" className="admin-form__input" value={formData.ugbScore} onChange={e => setFormData({...formData, ugbScore: e.target.value})} />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Opponent Score</label>
              <input type="number" className="admin-form__input" value={formData.opponentScore} onChange={e => setFormData({...formData, opponentScore: e.target.value})} />
            </div>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Result</label>
            <select className="admin-form__input" value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})}>
              <option value="upcoming">Upcoming</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">{getButtonText()}</button>
        </form>
      )}

      <div className="chart-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Result</th>
              <th>Score (UGB - OPP)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id}>
                <td>{m.date} {m.time}</td>
                <td style={{ fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {m.opponentLogo && <img src={m.opponentLogo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                    {m.opponent}
                  </div>
                </td>
                <td>{m.venue}</td>
                <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>{m.status}</span></td>
                <td>
                  <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: m.result === 'win' ? 'rgba(74,222,128,0.1)' : m.result === 'loss' ? 'rgba(248,113,113,0.1)' : 'transparent', color: m.result === 'win' ? 'var(--win)' : m.result === 'loss' ? 'var(--loss)' : 'inherit' }}>
                    {m.result}
                  </span>
                </td>
                <td style={{ fontWeight: 900 }}>{m.status === 'completed' ? `${m.ugbScore} - ${m.opponentScore}` : '-'}</td>
                <td>
                  <button onClick={() => editMatch(m)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginRight: '1rem' }}>Edit</button>
                  <button onClick={() => deleteMatch(m.id)} style={{ background: 'transparent', border: 'none', color: 'var(--loss)', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No matches scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
