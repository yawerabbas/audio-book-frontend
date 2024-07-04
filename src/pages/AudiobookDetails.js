import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'; // Import Rating component
import './AudiobookDetails.css';

const AudiobooksDetails = () => {
  const { id } = useParams(); // Extract id from route params
  const [audiobook, setAudiobook] = useState(null);
  const [newRating, setNewRating] = useState('');
  const [newReview, setNewReview] = useState('');
  const [darkMode, setDarkMode] = useState(false); // State for dark mode, set to true initially

  useEffect(() => {
    const fetchAudiobook = async () => {
      try {
        const response = await axios.get(`https://audiobook-backend-rtld.onrender.com/audiobooks/${id}`);
        setAudiobook(response.data);
      } catch (error) {
        console.error("Error fetching audiobook:", error);
      }
    };

    fetchAudiobook();
  }, [id]); // Fetch data whenever id changes

  const handleRatingSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      // Convert newRating to integer
      const ratingValue = parseInt(newRating);
  
      // Check if the ratingValue is a valid integer
  
      await axios.post(`https://audiobook-backend-rtld.onrender.com/audiobooks/${audiobook.id}/rating`, { rating: ratingValue });
      // Refresh audiobook data after adding the rating
      const response = await axios.get(`https://audiobook-backend-rtld.onrender.com/audiobooks/${id}`);
      setAudiobook(response.data);
      setNewRating('');
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`https://audiobook-backend-rtld.onrender.com/audiobooks/${audiobook.id}/review`, { review: newReview });
      // Refresh audiobook data after adding the review
      const response = await axios.get(`https://audiobook-backend-rtld.onrender.com/audiobooks/${id}`);
      setAudiobook(response.data);
      setNewReview('');
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (!audiobook) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate average rating
  const ratings = audiobook.ratings;
  const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : 0;

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <div className={`audiobook-details-container ${darkMode ? 'dark' : 'light'}`}>
      <img className="audiobook-details-cover" src={audiobook.cover_image} alt={audiobook.name} />
      <h1 className="audiobook-details-title">{audiobook.name}</h1>
      <p className="audiobook-details-author">Author: {audiobook.author}</p>
      <p className="audiobook-details-genre">Genre: {audiobook.genre}</p>
      <div className="audiobook-details-ratings">
        <p>Average Rating: {averageRating} <span className="golden-star">&#9733;</span></p>
        <div className="audiobook-details-reviews">
          <p>Reviews:</p>
          <ul>
            {audiobook.reviews.map((review, index) => (
              <li key={index}>{review}</li>
            ))}
          </ul>
        </div>

        {/* Render the Rating component for users to give a rating */}
        <Rating onClick={(rate) => setNewRating(rate.toString())} ratingValue={parseInt(newRating)} />
        
      </div>


      {/* Form to add a new rating */}
      <form className="audiobook-form" onSubmit={handleRatingSubmit}>
        {/* Removed input for rating */}
        <button type="submit">Submit Rating</button>
      </form>

      {/* Form to add a new review */}
      <form className="audiobook-form" onSubmit={handleReviewSubmit}>
        <label>
          Add Review:  &nbsp;
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder='how did you like it?'
          />
        </label>
        <span> &nbsp;</span>
        <button type="submit"> Submit Review</button>
      </form>

      {/* Toggle button for dark/light mode */}
      <div className="mode-toggle-container">
        <label className="mode-toggle">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
    </div>
  );
};

export default AudiobooksDetails;
