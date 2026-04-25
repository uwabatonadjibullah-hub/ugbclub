import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPanel() {
  const { cart, isOpen, setIsOpen, changeQuantity, totalPrice } = useCart();
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Trap focus / close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setIsOpen]);

  const fmt = (n) => new Intl.NumberFormat('en-RW').format(n);

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' cart-overlay--active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className={`cart-panel${isOpen ? ' cart-panel--active' : ''}`} ref={panelRef}>
        {/* Header */}
        <div className="cart-panel__header">
          <div className="cart-panel__title-row">
            <svg className="cart-panel__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <h2 className="cart-panel__title">Your Cart</h2>
          </div>
          <button className="cart-panel__close" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-panel__body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__img">
                  <img src={item.imageURL || item.img} alt={item.name} />
                </div>
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <div className="cart-item__price">{fmt(item.price * item.quantity)} RWF</div>
                  <div className="cart-item__controls">
                    <button className="qty-btn" onClick={() => changeQuantity(item.id, -1)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => changeQuantity(item.id, 1)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cart-panel__footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-value">{fmt(totalPrice)} RWF</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => { setIsOpen(false); navigate('/payment'); }}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
