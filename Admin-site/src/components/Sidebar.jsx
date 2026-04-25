import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span style={{ color: 'var(--accent)' }}>UGB</span> Admin
      </div>
      <nav className="sidebar__nav">
        <NavLink to="/" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`} end>Dashboard</NavLink>
        <NavLink to="/trade" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Trade Dashboard</NavLink>
        <NavLink to="/upload" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Upload Content</NavLink>
        <NavLink to="/players" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Manage Players</NavLink>
        <NavLink to="/payment" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Payment Settings</NavLink>
      </nav>
    </aside>
  );
}
