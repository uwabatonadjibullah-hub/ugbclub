import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* About */}
          <div className="footer__col">
            <NavLink to="/" className="footer__logo">
              <div className="logo-badge logo-badge--sm">
                <div className="logo-badge__inner">
                  <span className="logo-badge__text">UGB</span>
                </div>
              </div>
              <span className="footer__brand">UNITED GENERATION</span>
            </NavLink>
            <p className="footer__about">
              The official digital home of United Generation Basketball. Experience the energy, track the stats, shop exclusive merch, and watch premium cinematic content.
            </p>
          </div>

          {/* Partners */}
          <div className="footer__col">
            <h4 className="footer__heading">Our Partners</h4>
            <ul className="footer__list">
              <li>
                <a href="#" className="footer__link footer__link--primary">
                  <span className="footer__dot footer__dot--primary"></span>
                  AZAM
                  <span className="footer__badge">Principal</span>
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  <span className="footer__dot"></span>
                  BK Arena
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  <span className="footer__dot"></span>
                  FERWABA
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><NavLink to="/" className="footer__link" end>Home</NavLink></li>
              <li><NavLink to="/schedule" className="footer__link">Season Schedule</NavLink></li>
              <li><NavLink to="/roster" className="footer__link">Team Roster</NavLink></li>
              <li><NavLink to="/store" className="footer__link">Official Store</NavLink></li>
              <li><NavLink to="/media" className="footer__link">UGB TV</NavLink></li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer__col">
            <h4 className="footer__heading">Follow Us</h4>
            <div className="footer__socials">
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16.11 7.618a1.18 1.18 0 1 0 0-2.36 1.18 1.18 0 0 0 0 2.36z"/>
                  <path d="M12 15.82a3.82 3.82 0 1 0 0-7.64 3.82 3.82 0 0 0 0 7.64z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="X / Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <path d="m10 15 5-3-5-3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} United Generation Basketball. All rights reserved.</p>
          <p>Concept &amp; Design by <span className="footer__credit">NAD PRODUCTION</span></p>
        </div>
      </div>
    </footer>
  );
}
