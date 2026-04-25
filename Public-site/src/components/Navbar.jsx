import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/roster', label: 'Roster' },
    { to: '/store', label: 'Store' },
    { to: '/media', label: 'Media Vault' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <NavLink to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <img src="/android-chrome-512x512.png" alt="UGB Logo" style={{ width: '3rem', height: '3rem', objectFit: 'contain', background: 'white', borderRadius: '50%', padding: '4px', transition: 'transform 0.2s' }} className="logo-img-hover" />
            <span className="navbar__brand">UNITED GENERATION</span>
          </NavLink>

          {/* Desktop Links + Search */}
          <div className="navbar__desktop">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="navbar__search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>

            <button className="cart-btn" onClick={() => setIsOpen(true)}>
              <CartIcon />
              <span className="cart-btn__label">Cart</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="navbar__mobile-controls">
            <button className="cart-icon-btn" onClick={() => setIsOpen(true)}>
              <CartIcon />
              {totalItems > 0 && <span className="cart-badge cart-badge--mobile">{totalItems}</span>}
            </button>
            <button className="hamburger" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' mobile-nav-link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <button className="mobile-cart-link" onClick={() => { setIsOpen(true); setMobileOpen(false); }}>
              <span>View Cart</span>
              <span className="mobile-cart-badge">{totalItems} Items</span>
            </button>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search players, products, media..."
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>
          </div>
        )}
      </nav>
    </>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
