import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

const Header = ({ setLoggedIn, loggedIn }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false); 
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav-links">
          <Link to="/vinyls">All albums</Link>
        </nav>

        <div className="logo">
          <Link to="/">🎵 Vinyl Store</Link>
        </div>

        <div className="user-section">
          {user ? (
            <>
              <span className="username">{user.username}</span>
              {user.role === 'admin' && <span className="admin-badge">Admin</span>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
