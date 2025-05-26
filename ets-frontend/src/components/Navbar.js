import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ marginLeft: 10 }}>Profile</Link>
          {/* Add role-based links */}
          {user.role === 'organizer' && (
            <>
              <Link to="/my-events" style={{ marginLeft: 10 }}>My Events</Link>
              <Link to="/my-events/analytics" style={{ marginLeft: 10 }}>Analytics</Link>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Link to="/admin/events" style={{ marginLeft: 10 }}>Admin Events</Link>
              <Link to="/admin/users" style={{ marginLeft: 10 }}>Users</Link>
            </>
          )}
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: 10 }}>Login</Link>
          <Link to="/register" style={{ marginLeft: 10 }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
