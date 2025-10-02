import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSignIn = (e) => {
    e.preventDefault();
    // Demo-only: set admin role
    localStorage.setItem('role', 'admin');
    navigate(from, { replace: true });
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Sign in</h2>
      <p>Demo sign-in will grant admin role for this session.</p>
      <form onSubmit={handleSignIn}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Email
            <input type="email" required placeholder="admin@example.com" style={{ width: '100%' }} />
          </label>
          <label>
            Password
            <input type="password" required placeholder="••••••••" style={{ width: '100%' }} />
          </label>
          <button type="submit" style={{ marginTop: 12 }}>Sign in as Admin</button>
        </div>
      </form>
    </div>
  );
}

export default SignInPage;