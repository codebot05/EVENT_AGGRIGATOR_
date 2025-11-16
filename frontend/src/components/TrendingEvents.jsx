import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrendingEvents.css';

const TrendingEvents = () => {
  const navigate = useNavigate();
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  const fetchTrendingEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/events/trending?limit=6');
      setTrendingEvents(response.data);
    } catch (error) {
      console.error('Error fetching trending events:', error);
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

  if (loading) return <div className="loading">Loading trending events...</div>;

  if (trendingEvents.length === 0) {
    return (
      <div className="no-events">
        <h3>No trending events at the moment</h3>
        <p>Check back later for popular events!</p>
      </div>
    );
  }

  return (
    <div className="trending-events">
      <h2>🔥 Trending Events</h2>
      <div className="events-grid">
        {trendingEvents.map(event => (
          <div key={event._id} className="event-card trending">
            <span className="trending-badge">Trending</span>
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
              <div className="event-stats">
                <span className="views">👁️ {event.viewCount} views</span>
                {event.averageRating > 0 && (
                  <span className="rating">⭐ {event.averageRating.toFixed(1)}</span>
                )}
              </div>
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
        ))}
      </div>
    </div>
  );
};

export default TrendingEvents;
