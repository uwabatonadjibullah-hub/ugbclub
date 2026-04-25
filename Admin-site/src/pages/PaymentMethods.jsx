import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function PaymentMethods() {
  const [methods, setMethods] = useState([{ name: '', details: '' }]);
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'paymentMethods'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.methods) setMethods(data.methods);
          if (data.contacts) setContacts(data.contacts);
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'siteSettings', 'paymentMethods'), {
        methods: methods.filter(m => m.name),
        contacts: contacts.filter(c => c.name)
      });
      setMsg('Payment settings saved successfully!');
    } catch { setMsg('Error saving settings'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleAddMethod = () => setMethods([...methods, { name: '', details: '' }]);
  const handleAddContact = () => setContacts([...contacts, { name: '', phone: '' }]);

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Payment Settings</h1></div>
      {msg && <div style={{background:'var(--accent)',color:'var(--bg-dark)',padding:'1rem',borderRadius:'0.5rem',marginBottom:'1rem',fontWeight:700}}>{msg}</div>}

      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-box__title">Payment Methods</h3>
          {methods.map((m, idx) => (
            <div key={idx} className="form-row" style={{marginBottom:'1rem'}}>
              <div className="form-group"><input type="text" placeholder="Method Name (e.g. MTN MoMo)" className="form-input" value={m.name} onChange={e => { const nm = [...methods]; nm[idx].name = e.target.value; setMethods(nm); }} /></div>
              <div className="form-group"><input type="text" placeholder="Details (e.g. Code: 123456)" className="form-input" value={m.details} onChange={e => { const nm = [...methods]; nm[idx].details = e.target.value; setMethods(nm); }} /></div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={handleAddMethod} style={{background:'var(--bg-border)',color:'white'}}>+ Add Method</button>
        </div>

        <div className="chart-box">
          <h3 className="chart-box__title">Support Contacts</h3>
          {contacts.map((c, idx) => (
            <div key={idx} className="form-row" style={{marginBottom:'1rem'}}>
              <div className="form-group"><input type="text" placeholder="Name (e.g. Support)" className="form-input" value={c.name} onChange={e => { const nc = [...contacts]; nc[idx].name = e.target.value; setContacts(nc); }} /></div>
              <div className="form-group"><input type="text" placeholder="Phone Number" className="form-input" value={c.phone} onChange={e => { const nc = [...contacts]; nc[idx].phone = e.target.value; setContacts(nc); }} /></div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={handleAddContact} style={{background:'var(--bg-border)',color:'white',marginBottom:'2rem'}}>+ Add Contact</button>
          
          <div style={{marginTop:'2rem',borderTop:'1px solid var(--bg-border)',paddingTop:'2rem'}}>
            <button className="btn btn-primary" onClick={handleSave} style={{width:'100%'}}>Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
