import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Statistics() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Get active players
    const qPlayers = query(collection(db, 'players'), where('status', '==', 'active'));
    const unsubPlayers = onSnapshot(qPlayers, snap => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Get completed matches
    const qMatches = query(collection(db, 'schedule'), where('status', '==', 'completed'));
    const unsubMatches = onSnapshot(qMatches, snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubPlayers(); unsubMatches(); };
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Player Statistics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select an active player to manage their game logs.</p>
      </div>
      
      <div className="chart-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Position</th>
              <th>Overall PPG</th>
              <th>Overall REB</th>
              <th>Overall AST</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <React.Fragment key={p.id}>
                <tr style={{ cursor: 'pointer', background: expandedId === p.id ? 'rgba(56,189,248,0.05)' : 'transparent' }} onClick={() => toggleExpand(p.id)}>
                  <td style={{ fontWeight: 700 }}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                      <img src={p.photoURL} alt="" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover'}} />
                      {p.name} #{p.number}
                    </div>
                  </td>
                  <td>{p.position}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.stats?.ppg || 0}</td>
                  <td>{p.stats?.reb || 0}</td>
                  <td>{p.stats?.ast || 0}</td>
                  <td>{expandedId === p.id ? 'Hide Logs' : 'Manage Logs'}</td>
                </tr>
                {expandedId === p.id && (
                  <tr>
                    <td colSpan="6" style={{ padding: 0, background: 'var(--bg-dark)' }}>
                      <PlayerGameLogs player={p} matches={matches} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerGameLogs({ player, matches }) {
  const [logs, setLogs] = useState(player.gameLogs || []);
  const [formData, setFormData] = useState({ matchId: '', pts: '', reb: '', ast: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  // Keep logs in sync if player doc updates externally
  useEffect(() => { setLogs(player.gameLogs || []); }, [player]);

  const recalculateAverages = (updatedLogs) => {
    if (updatedLogs.length === 0) return { ppg: '0.0', reb: '0.0', ast: '0.0' };
    const totalPts = updatedLogs.reduce((acc, curr) => acc + parseInt(curr.pts || 0), 0);
    const totalReb = updatedLogs.reduce((acc, curr) => acc + parseInt(curr.reb || 0), 0);
    const totalAst = updatedLogs.reduce((acc, curr) => acc + parseInt(curr.ast || 0), 0);
    const count = updatedLogs.length;
    return {
      ppg: (totalPts / count).toFixed(1),
      reb: (totalReb / count).toFixed(1),
      ast: (totalAst / count).toFixed(1)
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.matchId) return alert('Please select a match.');
    
    let updatedLogs = [...logs];
    const logEntry = {
      matchId: formData.matchId,
      pts: parseInt(formData.pts || 0),
      reb: parseInt(formData.reb || 0),
      ast: parseInt(formData.ast || 0),
    };

    if (editingIndex !== null) {
      updatedLogs[editingIndex] = logEntry;
    } else {
      updatedLogs.push(logEntry);
    }

    const newStats = recalculateAverages(updatedLogs);

    await updateDoc(doc(db, 'players', player.id), {
      gameLogs: updatedLogs,
      stats: newStats
    });

    setFormData({ matchId: '', pts: '', reb: '', ast: '' });
    setEditingIndex(null);
  };

  const editLog = (index) => {
    setFormData(logs[index]);
    setEditingIndex(index);
  };

  const deleteLog = async (index) => {
    if (!confirm('Remove this game log?')) return;
    const updatedLogs = logs.filter((_, i) => i !== index);
    const newStats = recalculateAverages(updatedLogs);
    await updateDoc(doc(db, 'players', player.id), {
      gameLogs: updatedLogs,
      stats: newStats
    });
  };

  return (
    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bg-border)' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700 }}>
        {editingIndex !== null ? 'Edit Numbers' : 'Add Numbers'}
      </h4>
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '2rem' }}>
        <div className="admin-form__group" style={{ marginBottom: 0 }}>
          <label className="admin-form__label">Select Match</label>
          <select className="admin-form__input" value={formData.matchId} onChange={e => setFormData({...formData, matchId: e.target.value})} required>
            <option value="">-- Choose Match --</option>
            {matches.map(m => (
              <option key={m.id} value={m.id}>{m.date} vs {m.opponent} ({m.ugbScore} - {m.opponentScore})</option>
            ))}
          </select>
        </div>
        <div className="admin-form__group" style={{ marginBottom: 0 }}>
          <label className="admin-form__label">Points (PTS)</label>
          <input type="number" className="admin-form__input" value={formData.pts} onChange={e => setFormData({...formData, pts: e.target.value})} required min="0" />
        </div>
        <div className="admin-form__group" style={{ marginBottom: 0 }}>
          <label className="admin-form__label">Rebounds (REB)</label>
          <input type="number" className="admin-form__input" value={formData.reb} onChange={e => setFormData({...formData, reb: e.target.value})} required min="0" />
        </div>
        <div className="admin-form__group" style={{ marginBottom: 0 }}>
          <label className="admin-form__label">Assists (AST)</label>
          <input type="number" className="admin-form__input" value={formData.ast} onChange={e => setFormData({...formData, ast: e.target.value})} required min="0" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1rem' }}>{editingIndex !== null ? 'Update' : 'Add'}</button>
          {editingIndex !== null && (
            <button type="button" className="btn" style={{ padding: '0.75rem 1rem', background: 'var(--bg-lighter)' }} onClick={() => { setEditingIndex(null); setFormData({ matchId: '', pts: '', reb: '', ast: '' }); }}>Cancel</button>
          )}
        </div>
      </form>

      {logs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0f172a', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Date / Opponent</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>PTS</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>REB</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AST</th>
              <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => {
              const match = matches.find(m => m.id === log.matchId);
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{match ? `${match.date} vs ${match.opponent}` : 'Unknown Match'}</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 700 }}>{log.pts}</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem' }}>{log.reb}</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem' }}>{log.ast}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                    <button onClick={() => editLog(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginRight: '1rem', fontSize: '0.75rem' }}>Edit</button>
                    <button onClick={() => deleteLog(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--loss)', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
