import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../vinylItem.css';
import './allStyle.css';

function AllAlbums({ searchResults }) {
  const [vinyls, setVinyls] = useState([]);
  const [filteredVinyls, setFilteredVinyls] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('None');
  const [searchTerm, setSearchTerm] = useState('');

  const genres = [
    "Rock",
    "Alternative Rock",
    "Jazz",
    "Blues",
    "Nu Metal",
    "Trance",
    "Disco",
    "Pop",
    "Hard Rock"
  ];

  const sortOptions = [
    { value: 'None', label: 'No Sorting' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'alphabetical', label: 'Alphabetical (A-Z)' },
  ];

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vinyl');
        setVinyls(response.data);
        setFilteredVinyls(response.data);
      } catch (error) {
        console.error('Error fetching vinyls:', error);
      }
    };

    if (searchResults.length > 0) {
      setVinyls(searchResults);
      setFilteredVinyls(searchResults);
    } else {
      fetchVinyls();
    }
  }, [searchResults]);

  useEffect(() => {
    applyFilters();
  }, [selectedGenres, sortCriteria, searchTerm, vinyls]);

  const applyFilters = () => {
    let filtered = [...vinyls];

    // Genre filter
    if (selectedGenres.length > 0 && !selectedGenres.includes("All Genres")) {
      filtered = filtered.filter(vinyl => selectedGenres.includes(vinyl.genre));
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vinyl =>
        vinyl.albumName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortCriteria === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'alphabetical') {
      filtered.sort((a, b) => a.albumName.localeCompare(b.albumName));
    }

    setFilteredVinyls(filtered);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres(prevGenres => {
      if (genre === "All Genres") {
        return []; // Clear selected genres
      } else if (prevGenres.includes(genre)) {
        return prevGenres.filter(g => g !== genre); // Remove genre if already selected
      } else {
        return [...prevGenres, genre]; // Add genre if not selected
      }
    });
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = (id) => {
    window.location.href = `/vinyl/${id}`;
  };

  return (
    <div className="vinyls-container">
      <h2 className="vinyls-title">All Albums</h2>

      <div className="filters-container">
        <div className="genre-filter">
          {genres.map((genre) => (
            <label key={genre} className="genre-label">
              <input
                type="checkbox"
                value={genre}
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="genre-checkbox"
              />
              {genre}
            </label>
          ))}
        </div>

        <div className="sort-filter">
          <select
            value={sortCriteria}
            onChange={(e) => handleSortChange(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="vinyl-container">
        {filteredVinyls.length > 0 ? (
          filteredVinyls.map((vinyl) => (
            <div key={vinyl._id} className="vinyl-item" onClick={() => handleClick(vinyl._id)}>
              <img src={vinyl.imageUrl} alt="Vinyl Cover" className="vinyl-image" />
              <h3 className="vinyl-title">{vinyl.albumName}</h3>
              <p className="vinyl-genre">{vinyl.genre}</p>
              <p className="vinyl-price">${vinyl.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No albums found with the selected criteria.</p>
        )}
      </div>
    </div>
  );
}

export default AllAlbums;
