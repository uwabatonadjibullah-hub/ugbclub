import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/store');
      return;
    }

    const fetchPaymentInfo = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'paymentMethods');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setMethods(data.methods || [{ name: 'MTN Mobile Money', details: 'MoMo Code: 123456 (UGB CLUB)' }]);
          setContacts(data.contacts || [{ name: 'Support', phone: '+250 788 000 000' }]);
        } else {
          setMethods([{ name: 'MTN Mobile Money', details: 'MoMo Code: 123456 (UGB CLUB)' }]);
          setContacts([{ name: 'Support', phone: '+250 788 000 000' }]);
        }
      } catch {
        setMethods([{ name: 'MTN Mobile Money', details: 'MoMo Code: 123456 (UGB CLUB)' }]);
        setContacts([{ name: 'Support', phone: '+250 788 000 000' }]);
      }
      setLoading(false);
    };
    fetchPaymentInfo();
  }, [cart.length, navigate, orderPlaced]);

  const handleConfirm = () => {
    // In a real flow, this would save the order to Firestore here.
    // For now, we simulate order placement and show success message.
    setOrderPlaced(true);
    clearCart();
  };

  if (loading) return <div className="page-fade page-container"><p className="empty-state">Loading payment information...</p></div>;

  if (orderPlaced) {
    return (
      <div className="page-fade page-container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', color: 'var(--win)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="page-title" style={{ marginBottom: '1rem' }}>Order Placed!</h1>
        <p className="page-sub" style={{ margin: '0 auto 2rem' }}>Thank you for your purchase. Please ensure you have completed the payment via one of the methods below.</p>
        <button className="btn btn--primary" onClick={() => navigate('/store')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="page-fade page-container">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <div className="page-bar"></div>
        <p className="page-sub">Complete your order by making a payment via the methods below.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--bg-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>Payment Methods</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {methods.map((m, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--bg-border)', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>{m.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{m.details}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>Need Help?</h2>
            {contacts.map((c, idx) => (
              <p key={idx} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'white' }}>{c.name}:</strong> {c.phone}
              </p>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--bg-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-border)', paddingBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem' }}>
                  {new Intl.NumberFormat('en-RW').format(item.price * item.quantity)} RWF
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total to Pay</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--accent)' }}>
              {new Intl.NumberFormat('en-RW').format(totalPrice)} RWF
            </span>
          </div>
          <button className="btn btn--primary" style={{ width: '100%', padding: '1rem' }} onClick={handleConfirm}>
            I Have Made the Payment
          </button>
        </div>
      </div>
    </div>
  );
}
