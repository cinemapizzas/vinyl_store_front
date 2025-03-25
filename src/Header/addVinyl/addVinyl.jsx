import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './addVinylStyle.css'

const AddVinyl = () => {
  const [formData, setFormData] = useState({
    albumName: "",
    price: "",
    recordLabel: "",
    quantity: "",
    songsList: "",
    imageUrl: "",
    genre: "",
    youtubeLink: "", // Changed to youtubeLink
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formattedData = {
      ...formData,
      songsList: formData.songsList.split(",").map((song) => song.trim()),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageUrl: image,
      youtubeLink: formData.youtubeLink, //Sending to the backend the new youtubeLink
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      const response = await axios.post("http://localhost:3000/vinyl/add", formattedData, {
        headers: {
          "x-api-key": token,
        },
      });

      console.log("Vinyl added successfully:", response.data);
      alert("Vinyl added successfully!");
      navigate("/vinyls");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.details[0]?.message || "Invalid vinyl data.");
      } else if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please log in as an admin.");
      } else {
        setError("An error occurred while adding the vinyl.");
      }
      console.error("Error adding vinyl:", err);
    }
  };

  return (
    <div className="add-vinyl-container">
      <h2>Add New Vinyl</h2>
      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="albumName">Album Name:</label>
          <input
            type="text"
            id="albumName"
            name="albumName"
            value={formData.albumName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="recordLabel">Record Label:</label>
          <input
            type="text"
            id="recordLabel"
            name="recordLabel"
            value={formData.recordLabel}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="songsList">Songs List (comma-separated):</label>
          <input
            type="text"
            id="songsList"
            name="songsList"
            value={formData.songsList}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>
         <div>
          <label htmlFor="youtubeLink">Youtube Link (Optional):</label>
          <input
            type="text"
            id="youtubeLink"
            name="youtubeLink"
            value={formData.youtubeLink}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Vinyl</button>
      </form>
    </div>
  );
};

export default AddVinyl;
