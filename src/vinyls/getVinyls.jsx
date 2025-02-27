import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VinylItem.css'; 

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
    <div className="vinyl-container">
      {vinyls.map((vinyl) => (
        <div key={vinyl._id} className="vinyl-item" onClick={() => handleClick(vinyl._id)}>
          <h2>{vinyl.albumName}</h2>
          <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-image" />
          <p className="vinyl-price">Price: ${vinyl.price}</p>
        </div>
      ))}
    </div>
  );
}

export default GetVinyls;
