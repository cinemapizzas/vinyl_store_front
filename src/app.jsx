import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header/header';
import DisplayVinyl from './vinyls/mainPageComponents/displayVinyls';
import VinylInfo from './vinyls/vinylInfo';
import AllAlbums from './vinyls/all_vinyls/allVinyls';
import Register from './Header/logIn/register/registaer'; 
import Login from './Header/logIn/login/login.jsx';
import './app.css';
import TopSelling from './vinyls/mainPageComponents/topSelling';

export function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} /> {}
        <div className="content-container">
          <div className="vertical-line left"></div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<><DisplayVinyl /><TopSelling /></>} /> 
              <Route path="/vinyl/:id" element={<VinylInfo />} />
              <Route path="/vinyls" element={<AllAlbums />} />
              <Route path="/register" element={<Register setLoggedIn={setLoggedIn} />} /> {}
              <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} /> {}
            </Routes>
          </main>
          <div className="vertical-line right"></div>
        </div>
      </div>
    </Router>
  );
}
