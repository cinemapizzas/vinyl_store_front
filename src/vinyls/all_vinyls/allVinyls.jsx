import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../vinylItem.css'; 
import './allStyle.css'

function GetVinyls() {
  const [vinyls, setVinyls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/vinyl')
      .then(response => {
        console.log('Vinyl List:', response.data);
        setVinyls(response.data);
      })
      .catch(error => {
        console.error('Error fetching vinyls:', error);
      });
  }, []);

  const handleClick = (id) => {
    window.location.href = `/vinyl/${id}`; 
  };

  return (
    <div className="vinyls-container">
      <h2 className="vinyls-title">All Albums</h2>
      <div className="vinyl-container">
        {vinyls.map((vinyl) => (
          <div key={vinyl._id} className="vinyl-item" onClick={() => handleClick(vinyl._id)}>
            <h3>{vinyl.albumName}</h3>
            <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-image" />
            <p className="vinyl-price">Price: ${vinyl.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetVinyls;
