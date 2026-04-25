import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export default function Admins() {
  const { adminProfile } = useAuth();
  const [admins, setAdmins] = useState([]);
  const isSuperAdmin = adminProfile?.role === 'Super Admin';

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'admins'), snap => {
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const toggleApproval = async (id, currentStatus) => {
    if (!isSuperAdmin) {
      alert("Only Super Admins can change approval status.");
      return;
    }
    if (confirm(`Are you sure you want to ${currentStatus ? 'revoke' : 'grant'} approval?`)) {
      await updateDoc(doc(db, 'admins', id), { approved: !currentStatus });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Administrators</h1>
      </div>
      <div className="chart-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Role</th>
              <th>Status</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td style={{ fontWeight: 600 }}>{admin.firstName} {admin.lastName}</td>
                <td>{admin.email}</td>
                <td>{admin.tel || 'N/A'}</td>
                <td><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)' }}>{admin.role}</span></td>
                <td>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, background: admin.approved ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: admin.approved ? 'var(--win)' : 'var(--loss)' }}>
                    {admin.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                {isSuperAdmin && (
                  <td>
                    <button className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => toggleApproval(admin.id, admin.approved)}>
                      {admin.approved ? 'Revoke' : 'Approve'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
