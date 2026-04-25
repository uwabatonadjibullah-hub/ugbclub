import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const toggleExpand = (id) => {
    if (expanded === id) setExpanded(null);
    else setExpanded(id);
  };

  const fmt = n => new Intl.NumberFormat('en-RW').format(n) + ' RWF';
  const fmtDate = dStr => new Date(dStr).toLocaleString('en-RW');

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Orders Management</h1></div>
      
      <div className="chart-box">
        <h3 className="chart-box__title">Customer Orders</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client Name</th>
              <th>Telephone</th>
              <th>Location</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                <tr style={{ cursor: 'pointer', background: expanded === order.id ? 'rgba(56,189,248,0.05)' : 'transparent' }} onClick={() => toggleExpand(order.id)}>
                  <td>{fmtDate(order.createdAt)}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.location}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{fmt(order.total)}</td>
                  <td><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, background: order.status === 'pending' ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', color: order.status === 'pending' ? 'var(--loss)' : 'var(--win)' }}>{order.status}</span></td>
                  <td>{expanded === order.id ? 'Hide Invoice' : 'View Invoice'}</td>
                </tr>
                {expanded === order.id && (
                  <tr>
                    <td colSpan="7" style={{ padding: 0, background: 'var(--bg-dark)' }}>
                      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bg-border)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700 }}>Invoice Details</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #334155' }}>
                              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Item</th>
                              <th style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Qty</th>
                              <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '0.5rem', fontSize: '0.875rem' }}>{item.name}</td>
                                <td style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.875rem' }}>{fmt(item.price * item.quantity)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="2" style={{ textAlign: 'right', padding: '1rem 0.5rem', fontWeight: 700 }}>Total Paid:</td>
                              <td style={{ textAlign: 'right', padding: '1rem 0.5rem', fontWeight: 900, color: 'var(--accent)' }}>{fmt(order.total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
