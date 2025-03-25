import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./header.css";

const Header = ({ setLoggedIn, loggedIn, onSearch }) => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showKartDropdown, setShowKartDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");  
    setUser(null);
    setLoggedIn(false);
    navigate("/");
  };

  

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = "/";
  };


  const toggleKartDropdown = () => {
    setShowKartDropdown((prev) => !prev);
  };

  const removeFromKart = async (itemToRemove) => {
    const userId = localStorage.getItem("userId");  
    const token = localStorage.getItem("token");

    if (userId) {
      try {
        const response = await axios.put(
          `http://localhost:3000/user/${userId}/kart`,
          {
            action: "remove",
            items: [itemToRemove],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": token,
            },
          }
        );

        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error removing from kart:", error);
      }
    }
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav-links">
          <Link to="/vinyls">All albums</Link>

          {user && user.role === "admin" && (
            <div className="admin-links">
              <Link to="/vinyl/add" className="admin-link">Add Vinyl</Link>
              <Link to="/vinyl/edit" className="admin-link">Edit Vinyl</Link>
              <Link to="/vinyl/delete" className="admin-link">Remove Vinyl</Link>
            </div>
          )}
        </nav>

     
        {user && (
          <div className="kart-container">
            <div className="kart-icon" onClick={toggleKartDropdown}>
              🛒 Kart ({user.kart ? user.kart.length : 0})
            </div>
            {showKartDropdown && (
              <div className="kart-dropdown">
                {user.kart && user.kart.length > 0 ? (
                  user.kart.map((item, index) => (
                    <div key={index} className="kart-item">
                      <span>{item}</span>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromKart(item)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Your kart is empty.</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="logo">
          <a href="/" onClick={handleLogoClick}>🎵 Vinyl Store</a>
        </div>

       

        <div className="user-section">
          {user ? (
            <>
              <span className="username">{user.username}</span>
              {user.role === "admin" && <span className="admin-badge">Admin</span>}
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
