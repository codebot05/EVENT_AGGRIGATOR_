import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EventRating.css';

const EventRating = ({ eventId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [eventId]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/events/${eventId}/ratings`);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:4000/api/events/${eventId}/rate`,
        { rating: userRating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Rating submitted successfully!');
      setUserRating(0);
      setReview('');
      setShowRatingForm(false);
      fetchRatings(); // Refresh ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading ratings...</div>;

  return (
    <div className="event-rating">
      <div className="rating-summary">
        <h3>Event Ratings</h3>
        <div className="average-rating">
          <div className="rating-score">{averageRating.toFixed(1)}</div>
          {renderStars(Math.round(averageRating))}
          <div className="rating-count">({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})</div>
        </div>
        <button
          className="add-rating-btn"
          onClick={() => setShowRatingForm(!showRatingForm)}
        >
          {showRatingForm ? 'Cancel' : 'Rate this Event'}
        </button>
      </div>

      {showRatingForm && (
        <form className="rating-form" onSubmit={handleSubmitRating}>
          <div className="form-group">
            <label>Your Rating:</label>
            {renderStars(userRating, true, setUserRating)}
          </div>
          <div className="form-group">
            <label>Review (optional):</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
            />
          </div>
          <button type="submit" className="submit-rating-btn">Submit Rating</button>
        </form>
      )}

      <div className="ratings-list">
        <h4>Reviews</h4>
        {ratings.length === 0 ? (
          <p className="no-ratings">No ratings yet. Be the first to rate this event!</p>
        ) : (
          ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              <div className="rating-header">
                {renderStars(rating.rating)}
                <span className="rating-date">
                  {new Date(rating.timestamp).toLocaleDateString()}
                </span>
              </div>
              {rating.review && <p className="rating-review">{rating.review}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventRating;
