import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VinylItem.css'; 

function GetVinyls() {
  const [vinyls, setVinyls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/vinyl')
      .then(response => {
        console.log('Vinyl List:', response.data);
        setVinyls(response.data.slice(0, 4));  // Limit to 4 vinyls
      })
      .catch(error => {
        console.error('Error fetching vinyls:', error);
      });
  }, []);

  const handleClick = (id) => {
    window.location.href = `/vinyl/${id}`; 
  };

  return (
    <>
    <h2 className="text-2xl font-bold text-right mb-4">Albums</h2>
    <div className="vinyl-container">
      {vinyls.map((vinyl) => (
        <div key={vinyl._id} className="vinyl-item" onClick={() => handleClick(vinyl._id)}>
          <h2>{vinyl.albumName}</h2>
          <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-image" />

          <p className="vinyl-price">Price: ${vinyl.price}</p>
        </div>
      ))}
    </div>
    </>
  );
}

export default GetVinyls;
