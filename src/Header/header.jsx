import React from "react";
import "./header.css"; 

const Header = () => {
  return (
    <header className="header">
      <div className="container">
       
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Best Selling</a>
          <a href="#">New Albums</a>
          <a href="#">Ending Soonest</a>
        </nav>

       
        <div className="logo">
          <a href="#">🎵 Vinyl Store</a>
        </div>

        
        <div>
          <button className="login-btn">Login</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
