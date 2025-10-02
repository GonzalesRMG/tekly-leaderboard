import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '8px 12px',
    margin: '4px 0',
    textDecoration: 'none',
    borderRadius: 6,
    color: isActive ? '#0d47a1' : '#222',
    background: isActive ? '#e3f2fd' : 'transparent',
    fontWeight: isActive ? 600 : 500,
  });

  const signOut = () => {
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #eee', padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Admin</div>
        <nav>
          <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/admin/seasons" style={linkStyle}>Seasons</NavLink>
          <NavLink to="/admin/race-results" style={linkStyle}>Race Results</NavLink>
          <NavLink to="/admin/racers" style={linkStyle}>Racers</NavLink>
          <NavLink to="/admin/cars" style={linkStyle}>Cars</NavLink>
          <NavLink to="/admin/classes" style={linkStyle}>Classes</NavLink>
          <NavLink to="/admin/settings" style={linkStyle}>Settings</NavLink>
        </nav>
        <button onClick={signOut} style={{ marginTop: 16 }}>Sign out</button>
      </aside>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;