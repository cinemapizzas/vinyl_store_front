import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header/header';
import DisplayVinyl from './vinyls/mainPageComponents/displayVinyls';
import VinylInfo from './vinyls/vinylInfo';
import AllAlbums from './vinyls/all_vinyls/allVinyls';
import Register from './Header/logIn/register/registaer'; 
import Login from './Header/logIn/login/login.jsx';
import AddVinyl from './Header/addVinyl/addVinyl.jsx';
import RemoveVinyl from './Header/removeVinyl/removeVinyl.jsx';
import EditVinyl from './Header/editViyl/editVinyl.jsx';
import TokenTimer from './Header/logIn/login/tokenTimer.jsx'; 
import TopSelling from './vinyls/mainPageComponents/topSelling';
import Footer from './footer/footer.jsx'

import './app.css';

export function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
    }
  }, []);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(`http://localhost:3000/vinyls/search?term=${searchTerm}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Received non-JSON response:", await response.text());
      }
    } catch (error) {
      console.error("Error searching vinyls:", error);
    }
  };

  const handleTokenExpire = () => {
    console.log("Token expired. Logging out...");
    setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('timeLeft');
    window.location.href = '/login'; 
  };

  return (
    <Router>
      <div className="app-container">
        {loggedIn && <TokenTimer onExpire={handleTokenExpire} />} {/* Add TokenTimer */}
        <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} onSearch={handleSearch} />
        <div className="content-container">
          <div className="vertical-line left"></div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<><DisplayVinyl searchResults={searchResults} /><TopSelling /> </>} /> 
              <Route path="/vinyl/:id" element={<VinylInfo />} />
              <Route path="/vinyls" element={<AllAlbums searchResults={searchResults} />} />
              <Route path="/register" element={<Register setLoggedIn={setLoggedIn} />} />
              <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
              <Route path="/vinyl/add" element={loggedIn ? <AddVinyl /> : <Navigate to="/login" />} />
              <Route path="/vinyl/delete" element={loggedIn ? <RemoveVinyl /> : <Navigate to="/login" />} />
              <Route path="/vinyl/edit" element={loggedIn ? <EditVinyl /> : <Navigate to="/login" />} />
            </Routes>
           
          </main>
          <div className="vertical-line right"></div>
          
        </div>
        <Footer></Footer>
      </div>
    </Router>
    
  );
}
