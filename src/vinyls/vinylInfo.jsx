import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import axios from "axios";  
import "./VinylInfo.css";

function VinylInfo() {
  const { id } = useParams(); 
  const [vinyl, setVinyl] = useState(null);
  const navigate = useNavigate(); // hook to navigate between pages

  useEffect(() => {
    axios.get(`http://localhost:3000/vinyl/${id}`)
      .then(response => setVinyl(response.data))
      .catch(error => console.error("Error fetching vinyl details:", error));
  }, [id]);  

  if (!vinyl) return <p>Loading vinyl details...</p>;

  return (
    <div className="vinyl-info-container">
      <button
        onClick={() => navigate('/')} // navigate to the main page
        className="back-button"
      >
        &times; {/* "X" symbol */}
      </button>
      <h1>{vinyl.albumName}</h1>
      <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-info-image" />
      <p><strong>Price:</strong> ${vinyl.price}</p>
      <p><strong>Record-label:</strong> {vinyl.recordLabel}</p>
      <p><strong>Release Date:</strong> {vinyl.createdAt}</p>
      <p><strong>Songs:</strong></p>
      <ul>
        {vinyl.songsList.map((song, index) => (
          <li key={index}>{song}</li>
        ))}
      </ul>
    </div>
  );
}

export default VinylInfo;
