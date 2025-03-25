import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EditVinyl.css'

const EditVinyl = () => {
  const [vinyls, setVinyls] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editedVinyls, setEditedVinyls] = useState({})
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchVinyls()
  }, [])

  const fetchVinyls = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      const response = await axios.get('http://localhost:3000/vinyl', {
        headers: {
          "x-api-key": token,
        },
      });
      const data = response.data;
      setVinyls(data);
      const initialEdits = data.reduce((acc, vinyl) => {
        acc[vinyl._id] = { ...vinyl }
        return acc
      }, {})
      setEditedVinyls(initialEdits)
    } catch (error) {
      console.error('Error fetching vinyls:', error)
      setError('Failed to fetch vinyls. Please try again.')
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const handleFieldChange = (id, field, value) => {
    setEditedVinyls(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === 'songsList' ? value.split(',').map(song => song.trim()) : value
      }
    }))
  }

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      const payload = {
        albumName: editedVinyls[id].albumName,
        price: Number(editedVinyls[id].price),
        recordLabel: editedVinyls[id].recordLabel,
        quantity: Number(editedVinyls[id].quantity),
        songsList: editedVinyls[id].songsList,
        genre: editedVinyls[id].genre,
        imageUrl: editedVinyls[id].imageUrl
      };

      console.log("Payload being sent:", payload);

      const response = await axios.put(`http://localhost:3000/vinyl/edit/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          "x-api-key": token,
        },
      });

      if (response.status === 200) {
        alert('Vinyl updated successfully')
        fetchVinyls() 
      } else {
        alert('Failed to update vinyl')
      }
    } catch (error) {
      console.error('Update error:', error.response ? error.response.data : error.message)
      setError('Failed to update vinyl. Please try again.')
    }
  }

  const handleCancel = (id) => {
    setEditedVinyls(prev => ({
      ...prev,
      [id]: { ...vinyls.find(v => v._id === id) }
    }))
  }

  const filteredVinyls = vinyls.filter(vinyl =>
    vinyl.albumName.toLowerCase().includes(searchTerm)
  )

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="edit-vinyl-container">
      <h2>Edit Vinyls</h2>
      <input
        type="text"
        placeholder="Search vinyls..."
        onChange={handleSearch}
        className="search-input"
      />
      <div className="vinyl-table">
        {filteredVinyls.map(vinyl => (
          <div className="vinyl-row" key={vinyl._id}>
            <div className="vinyl-info">
              <img 
                src={vinyl.imageUrl || 'placeholder-image.jpg'} 
                alt={vinyl.albumName} 
                className="vinyl-image"
              />
              <div className="edit-fields">
                <input
                  type="text"
                  value={editedVinyls[vinyl._id]?.albumName || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'albumName', e.target.value)}
                  placeholder="Album Name"
                />
                <input
                  type="number"
                  value={editedVinyls[vinyl._id]?.price || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'price', e.target.value)}
                  placeholder="Price"
                />
                <input
                  type="text"
                  value={editedVinyls[vinyl._id]?.recordLabel || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'recordLabel', e.target.value)}
                  placeholder="Record Label"
                />
                <input
                  type="number"
                  value={editedVinyls[vinyl._id]?.quantity || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'quantity', e.target.value)}
                  placeholder="Quantity"
                />
                <input
                  type="text"
                  value={editedVinyls[vinyl._id]?.songsList?.join(', ') || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'songsList', e.target.value)}
                  placeholder="Songs (comma-separated)"
                />
                <input
                  type="text"
                  value={editedVinyls[vinyl._id]?.genre || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'genre', e.target.value)}
                  placeholder="Genre"
                />
                <input
                  type="text"
                  value={editedVinyls[vinyl._id]?.imageUrl || ''}
                  onChange={(e) => handleFieldChange(vinyl._id, 'imageUrl', e.target.value)}
                  placeholder="Image URL"
                />
              </div>
            </div>
            <div className="action-buttons">
              <button 
                className="save-button"
                onClick={() => handleSave(vinyl._id)}
              >
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </button>
              <button 
                className="cancel-button"
                onClick={() => handleCancel(vinyl._id)}
              >
                <svg className="cancel-icon" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditVinyl
