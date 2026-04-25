import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { seedData } from '../data/seedData';
import { useConfirm } from '../context/ConfirmContext';

export default function Dashboard() {
  const { showConfirm, showAlert } = useConfirm();
  const [stats, setStats] = useState({ players: 0, products: 0, orders: 0, views: 0 });
  const [topPlayers, setTopPlayers] = useState([]);
  const [mediaViews, setMediaViews] = useState([]);
  const [isSeeded, setIsSeeded] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    // Check if seeded
    getDoc(doc(db, 'siteSettings', 'seeding')).then(snap => {
      if (!snap.exists() || !snap.data().seeded) setIsSeeded(false);
    });
    const unsubPlayers = onSnapshot(collection(db, 'players'), (snap) => {
      setStats(s => ({ ...s, players: snap.size }));
      const active = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.status === 'active');
      active.sort((a, b) => (parseFloat(b.stats?.ppg) || 0) - (parseFloat(a.stats?.ppg) || 0));
      setTopPlayers(active.slice(0, 5));
    });
    const unsubProducts = onSnapshot(collection(db, 'products'), snap => setStats(s => ({ ...s, products: snap.size })));
    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => setStats(s => ({ ...s, orders: snap.size })));
    const unsubMedia = onSnapshot(collection(db, 'media'), (snap) => {
      let totalViews = 0;
      const mViews = [];
      snap.forEach(d => {
        const data = d.data();
        totalViews += (data.viewCount || 0);
        mViews.push({ name: data.title.substring(0, 15) + '...', views: data.viewCount || 0 });
      });
      setStats(s => ({ ...s, views: totalViews }));
      setMediaViews(mViews);
    });

    return () => { unsubPlayers(); unsubProducts(); unsubOrders(); unsubMedia(); };
  }, []);

  const handleSeedData = async () => {
    const isConfirmed = await showConfirm('Are you sure you want to seed the Genius Sports data? This is a one-time action.');
    if (!isConfirmed) return;
    setSeeding(true);
    try {
      // Seed players
      for (const p of seedData.roster) {
        await addDoc(collection(db, 'players'), {
          name: p.name, number: p.number, position: p.position,
          photoURL: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop',
          stats: { ppg: '0.0', reb: '0.0', ast: '0.0' }, status: 'active'
        });
      }
      // Seed fixtures
      for (const f of seedData.fixtures_2026) {
        await addDoc(collection(db, 'schedule'), f);
      }
      // Mark as seeded
      await setDoc(doc(db, 'siteSettings', 'seeding'), { seeded: true });
      setIsSeeded(true);
    } catch (e) {
      await showAlert('Seeding failed: ' + e.message);
    }
    setSeeding(false);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Dashboard</h1>
        {!isSeeded && (
          <button className="btn btn-primary" onClick={handleSeedData} disabled={seeding}>
            {seeding ? 'Seeding...' : 'Seed Genius Sports Data'}
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card__title">Total Players</div><div className="stat-card__val">{stats.players}</div></div>
        <div className="stat-card"><div className="stat-card__title">Products Active</div><div className="stat-card__val">{stats.products}</div></div>
        <div className="stat-card"><div className="stat-card__title">Total Orders</div><div className="stat-card__val">{stats.orders}</div></div>
        <div className="stat-card"><div className="stat-card__title">Media Views (10s+)</div><div className="stat-card__val">{stats.views}</div></div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-box__title">Media Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mediaViews}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip cursor={{fill: 'var(--bg-border)'}} contentStyle={{background: 'var(--bg-dark)', borderColor: 'var(--bg-border)'}} />
              <Bar dataKey="views" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3 className="chart-box__title">Top Performers (PPG)</h3>
          <table className="admin-table">
            <thead><tr><th>Player</th><th>Pos</th><th>PPG</th><th>REB</th></tr></thead>
            <tbody>
              {topPlayers.map(p => (
                <tr key={p.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><img src={p.photoURL} alt="" style={{width:24,height:24,borderRadius:'50%',objectFit:'cover'}}/>{p.name}</div></td>
                  <td>{p.position}</td>
                  <td style={{color:'var(--accent)',fontWeight:700}}>{p.stats?.ppg}</td>
                  <td>{p.stats?.reb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
