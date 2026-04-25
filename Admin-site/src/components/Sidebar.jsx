import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src="/admin/android-chrome-512x512.png" alt="UGB Logo" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain', background: 'white', borderRadius: '50%', padding: '4px' }} />
        <span>Admin</span>
      </div>
      <nav className="sidebar__nav">
        <NavLink to="/" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`} end>Dashboard</NavLink>
        <NavLink to="/trade" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Trade Dashboard</NavLink>
        <NavLink to="/orders" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Customer Orders</NavLink>
        <NavLink to="/matches" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Manage Matches</NavLink>
        <NavLink to="/upload" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Upload Content</NavLink>
        <NavLink to="/content" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Manage Content</NavLink>
        <NavLink to="/players" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Manage Players</NavLink>
        <NavLink to="/statistics" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Player Statistics</NavLink>
        <NavLink to="/payment" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Payment Settings</NavLink>
        <NavLink to="/settings" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Site Settings</NavLink>
        <NavLink to="/admins" className={({isActive}) => `sidebar__link ${isActive ? 'active' : ''}`}>Admins</NavLink>
      </nav>
    </aside>
  );
}
