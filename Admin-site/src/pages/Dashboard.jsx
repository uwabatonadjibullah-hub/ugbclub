import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ players: 0, products: 0, orders: 0, views: 0 });
  const [topPlayers, setTopPlayers] = useState([]);
  const [mediaViews, setMediaViews] = useState([]);

  useEffect(() => {
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
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
