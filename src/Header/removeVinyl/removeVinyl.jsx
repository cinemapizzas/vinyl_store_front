import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './RemoveVinyl.css'

const RemoveVinyl = () => {
  const [vinyls, setVinyls] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchVinyls()
  }, [])

  const fetchVinyls = async () => {
    try {
      const response = await fetch('http://localhost:3000/vinyl')
      const data = await response.json()
      setVinyls(data)
    } catch (error) {
      console.error('Error fetching vinyls:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vinyl?')) {
      try {
        const response = await fetch(`http://localhost:3000/vinyl/delete/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setVinyls(prev => prev.filter(vinyl => vinyl._id !== id))
          alert('Vinyl deleted successfully')
        } else {
          alert('Failed to delete vinyl')
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredVinyls = vinyls.filter(vinyl =>
    vinyl.albumName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="vinyl-list-container">
      <h2>Manage Vinyls</h2>
      <input
        type="text"
        placeholder="Search vinyls..."
        value={searchTerm}
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
              <span className="album-name">{vinyl.albumName}</span>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(vinyl._id)}
            >
              <svg className="delete-icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RemoveVinyl
