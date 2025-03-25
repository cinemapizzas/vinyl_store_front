import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VinylInfo.css";

function VinylInfo() {
  const { id } = useParams();
  const [vinyl, setVinyl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVinyl = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/vinyl/${id}`);
        setVinyl(response.data);
      } catch (error) {
        console.error("Error fetching vinyl details:", error);
      }
    };

    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchVinyl();
    fetchUser();
  }, [id]);

  const handleAddToBasket = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `http://localhost:3000/user/${userId}/kart`,
          {
            action: "add",
            items: [vinyl.albumName],
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
          alert(`${vinyl.albumName} added to basket!`);
        }
      } catch (error) {
        console.error("Error adding to basket:", error);
        alert("Failed to add to basket. Please try again.");
      }
    } else {
      console.error("User ID not found in local storage");
      alert("User ID not found. Please log in again.");
    }
  };

  if (loading || !vinyl) return <p>Loading vinyl details...</p>;

  const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /.*(?:youtu\.be\/|v\/|embed\/|watch\?|youtube\.com(?:\/|\/(?:watch)?\?))(?:[^&]+&)?vi?=([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  return (
    <div className="vinyl-info-container">
      <button onClick={() => navigate("/")} className="back-button">
        &times;
      </button>
      <h1>{vinyl.albumName}</h1>

 
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <div>
            <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-info-image" />
            <p>
              <strong>Price:</strong> ${vinyl.price}
            </p>
            <p>
              <strong>Record-label:</strong> {vinyl.recordLabel}
            </p>
            <p>
              <strong>Release Date:</strong> {vinyl.createdAt}
            </p>
            <p>
              <strong>Songs:</strong>
            </p>
            <ul>
              {vinyl.songsList.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </div>
        </div>
        {vinyl.youtubeLink && (
          <div className="youtube-iframe-container">
            <h2>Album preview</h2>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${extractVideoId(vinyl.youtubeLink)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {user ? (
          <button className="add-to-basket-button" onClick={handleAddToBasket}>
            Add to Basket
          </button>
        ) : (
          <p>Please login to purchase the item.</p>
        )}
      </div>
    </div>
  );
}

export default VinylInfo;
