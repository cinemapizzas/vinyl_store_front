import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../vinylitem.css'; 
import './style/mostSelling.css'

function TopSelling() {
  const [vinyls, setVinyls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/vinyl')
      .then(response => {
        console.log('Vinyl List:', response.data);
        
        
        const sortedVinyls = response.data.sort((a, b) => b.sold - a.sold).slice(0, 4);
        setVinyls(sortedVinyls);
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
      <h2 className="title">Top Selling Vinyls</h2>
      <div className="vinyl-container">
        {vinyls.map((vinyl, index) => {
          let rankClass = "";
          if (index === 0) rankClass = "gold-rank";
          else if (index === 1) rankClass = "silver-rank";
          else if (index === 2) rankClass = "bronze-rank";

          return (
            <>
            <div key={vinyl._id} className={`vinyl-item ${rankClass}`} onClick={() => handleClick(vinyl._id)}>
              <h3>{vinyl.albumName}</h3>
              <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-image" />
              <p className="vinyl-price">Price: ${vinyl.price}</p>
              <p className="vinyl-sold">Sold: {vinyl.sold}</p>
            </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default TopSelling;
