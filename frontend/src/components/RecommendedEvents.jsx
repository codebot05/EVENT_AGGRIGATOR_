import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RecommendedEvents.css';

const RecommendedEvents = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        'http://localhost:4000/api/student/recommendations?limit=6',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:4000/api/student/register-event',
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event');
    }
  };

  if (loading) return <div className="loading">Loading recommendations...</div>;
  
  if (recommendations.length === 0) {
    return (
      <div className="no-recommendations">
        <h3>No recommendations yet</h3>
        <p>Update your interests to get personalized event recommendations!</p>
      </div>
    );
  }

  return (
    <div className="recommended-events">
      <h2>✨ Recommended For You</h2>
      <div className="events-grid">
        {recommendations.map(event => (
          <div key={event._id} className="event-card recommended">
            <span className="recommended-badge">Recommended</span>
            {event.eventImage && (
              <img 
                src={`http://localhost:4000${event.eventImage}`} 
                alt={event.eventName} 
                className="event-image"
              />
            )}
            <div className="event-content">
              <h3 onClick={() => navigate(`/events/${event._id}`)} style={{ cursor: 'pointer' }}>
                {event.eventName}
              </h3>
              <p className="event-description">{event.description?.substring(0, 100)}...</p>
              <div className="event-meta">
                <span className="event-date">📅 {new Date(event.date).toLocaleDateString()}</span>
                <span className="event-category">🏷️ {event.eventCategory}</span>
              </div>
              <div className="event-footer">
                {event.averageRating > 0 && (
                  <div className="rating">⭐ {event.averageRating.toFixed(1)}</div>
                )}
                <div className="event-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="register-btn"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedEvents;
