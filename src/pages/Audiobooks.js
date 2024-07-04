import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Audiobooks.css';

const Audiobooks = () => {
  const [audiobooks, setAudiobooks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const response = await axios.get('https://audiobook-backend-rtld.onrender.com/audiobooks');
        setAudiobooks(response.data);
        setFilteredAudiobooks(response.data);
        calculateAverageRatings(response.data);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
      }
    };

    fetchAudiobooks();
  }, []);

  const calculateAverageRatings = (audiobooks) => {
    const ratings = {};
    audiobooks.forEach(audiobook => {
      const totalRatings = audiobook.ratings.reduce((acc, rating) => acc + rating, 0);
      const averageRating = totalRatings / audiobook.ratings.length;
      ratings[audiobook.id] = averageRating;
    });
    setAverageRatings(ratings);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = audiobooks.filter(audiobook =>
      (audiobook.name && audiobook.name.toLowerCase().includes(term)) ||
      (audiobook.genre && audiobook.genre.toLowerCase().includes(term)) ||
      (audiobook.author && audiobook.author.toLowerCase().includes(term))
    );
    setFilteredAudiobooks(filtered);
  };

  const handleRatingFilter = (event) => {
    const selectedRating = parseInt(event.target.value);
    setSelectedRating(selectedRating);
    const filtered = audiobooks.filter(audiobook => averageRatings[audiobook.id] >= selectedRating);
    setFilteredAudiobooks(filtered);
  };

  return (
    <div className={`audiobooks-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <h1>The Audiobooks collection</h1>
        <div className="mode-toggle-container">
          <label className="mode-toggle">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider"></span>
          </label>
          <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
      </div>
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, author or genre"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="rating-filter">
            <select value={selectedRating} onChange={handleRatingFilter}>
              <option value={0}>Select Rating</option>
              <option value={1}>&gt;1 &#9733;</option>
              <option value={2}>&gt;2 &#9733;</option>
              <option value={3}>&gt;3 &#9733;</option>
              <option value={4}>&gt;4 &#9733;</option>
              <option value={5}>5 &#9733;</option>
            </select>
          </div>
        </div>
      </div>
      <div className="audiobooks-grid">
        {filteredAudiobooks.map(audiobook => (
          <Link to={`/audiobooks/${audiobook.id}`} key={audiobook.id} className="audiobook-card">
            <img src={audiobook.cover_image} alt={audiobook.name} className="audiobook-cover" />
            <h2 className="audiobook-title">{audiobook.name}</h2>
            <p className="audiobook-author">{audiobook.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Audiobooks;
