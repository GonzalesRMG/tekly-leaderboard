import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';

function PublicLayout() {
  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    textDecoration: 'none',
    color: isActive ? '#1976d2' : '#333',
    fontWeight: isActive ? '600' : '500',
  });

  return (
    <div>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ fontWeight: 700, color: '#111', textDecoration: 'none' }}>Tekly Leaderboard</Link>
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <NavLink to="/racers" style={linkStyle}>Racers</NavLink>
          <NavLink to="/classes" style={linkStyle}>Classes</NavLink>
          <NavLink to="/cars" style={linkStyle}>Cars</NavLink>
          <NavLink to="/seasons" style={linkStyle}>Seasons</NavLink>
          <NavLink to="/race-results" style={linkStyle}>Race Results</NavLink>
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