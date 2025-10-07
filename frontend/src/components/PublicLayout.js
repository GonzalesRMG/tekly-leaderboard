import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';

function PublicLayout() {
  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    textDecoration: 'none',
    color: isActive ? '#38bdf8' : '#b3b9c4', // adjusted for dark background
    fontWeight: isActive ? '600' : '500',
  });

  return (
    <div>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 16, background: '#000' }}>
        <Link to="/" style={{ fontWeight: 700, color: 'var(--color-text)', textDecoration: 'none' }}>Tekly Leaderboard</Link>
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <NavLink to="/" end style={linkStyle}>Seasons</NavLink>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
        </div>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;