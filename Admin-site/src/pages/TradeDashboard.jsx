import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function TradeDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, pendingValue: 0, totalOrders: 0 });

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubO = onSnapshot(collection(db, 'orders'), snap => {
      const ords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(ords);
      let rev = 0, pend = 0;
      ords.forEach(o => {
        rev += (o.total || 0);
        if (o.status === 'pending') pend += (o.total || 0);
      });
      setStats({ revenue: rev, pendingValue: pend, totalOrders: ords.length });
    });
    return () => { unsubP(); unsubO(); };
  }, []);

  const fmt = n => new Intl.NumberFormat('en-RW').format(n) + ' RWF';

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Trade Dashboard</h1></div>
      
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card__title">Total Revenue</div><div className="stat-card__val" style={{color:'var(--win)'}}>{fmt(stats.revenue)}</div></div>
        <div className="stat-card"><div className="stat-card__title">Pending Orders Value</div><div className="stat-card__val" style={{color:'var(--accent)'}}>{fmt(stats.pendingValue)}</div></div>
        <div className="stat-card"><div className="stat-card__title">Total Orders</div><div className="stat-card__val">{stats.totalOrders}</div></div>
        <div className="stat-card"><div className="stat-card__title">Active Merch Items</div><div className="stat-card__val">{products.length}</div></div>
      </div>

      <div className="chart-box" style={{marginBottom:'2rem'}}>
        <h3 className="chart-box__title">Available Merchandise</h3>
        <table className="admin-table">
          <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:'1rem'}}><img src={p.imageURL} alt="" style={{width:40,height:40,borderRadius:'4px',objectFit:'cover'}}/>{p.name}</div></td>
                <td>{p.category}</td>
                <td>{fmt(p.price)}</td>
                <td>{p.stock || 'In Stock'}</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="4">No merchandise available</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
