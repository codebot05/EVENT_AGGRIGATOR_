import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventRating from '../components/EventRating';
import '../styles/EventDetailsPage.css';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    trackEventView();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      console.log('Fetching event with ID:', eventId);
      const response = await axios.get(`http://localhost:4000/api/events/${eventId}`);
      console.log('Event data received:', response.data);
      setEvent(response.data);
      checkIfRegistered(response.data);
    } catch (err) {
      console.error('Error fetching event details:', err);
      console.error('Error response:', err.response);
      console.error('Event ID attempted:', eventId);
      setError(err.response?.status === 404 ? 'Event not found' : 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfRegistered = async (eventData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://localhost:4000/api/student/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const registered = response.data.some(e => e._id === eventData._id);
      setIsRegistered(registered);
    } catch (err) {
      console.error('Error checking registration status:', err);
    }
  };

  const trackEventView = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token && eventId) {
        await axios.post(
          `http://localhost:4000/api/events/${eventId}/view`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleRegister = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/student/register-event',
        { eventId: event._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Successfully registered for the event!');
      setIsRegistered(true);
    } catch (err) {
      console.error('Error registering:', err);
      alert(err.response?.data?.message || 'Failed to register for event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading event details...</div>;
  }

  if (error || !event) {
    return (
      <div className="error-container">
        <h2>{error || 'Event not found'}</h2>
        <button onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-header">
        {event.eventImage && (
          <div className="event-image-container">
            <img
              src={`http://localhost:4000${event.eventImage}`}
              alt={event.eventName}
              className="event-main-image"
            />
          </div>
        )}

        <div className="event-title-section">
          <h1>{event.eventName}</h1>
          <div className="event-meta-badges">
            <span className="badge category-badge">{event.eventCategory}</span>
            {event.difficulty && (
              <span className="badge difficulty-badge">{event.difficulty}</span>
            )}
            {event.averageRating > 0 && (
              <span className="badge rating-badge">
                ⭐ {event.averageRating.toFixed(1)} ({event.ratings?.length || 0} reviews)
              </span>
            )}
            <span className="badge views-badge">👁️ {event.viewCount} views</span>
          </div>
        </div>
      </div>

      <div className="event-content-grid">
        <div className="event-main-content">
          <section className="event-section">
            <h2>About This Event</h2>
            <p className="event-description">{event.description}</p>
          </section>

          {event.tags && event.tags.length > 0 && (
            <section className="event-section">
              <h3>Tags</h3>
              <div className="tags-container">
                {event.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </section>
          )}

          <section className="event-section">
            <h2>Event Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div>
                  <strong>Date</strong>
                  <p>{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🕐</span>
                <div>
                  <strong>Time</strong>
                  <p>{event.time}</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{event.location}</p>
                </div>
              </div>

              {event.college?.collegeName && (
                <div className="detail-item">
                  <span className="detail-icon">🏫</span>
                  <div>
                    <strong>Organized By</strong>
                    <p>{event.college.collegeName}</p>
                  </div>
                </div>
              )}

              {event.difficulty && (
                <div className="detail-item">
                  <span className="detail-icon">📊</span>
                  <div>
                    <strong>Difficulty Level</strong>
                    <p>{event.difficulty}</p>
                  </div>
                </div>
              )}

              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <div>
                  <strong>Participants</strong>
                  <p>{event.participants?.length || 0} registered</p>
                </div>
              </div>
            </div>
          </section>

          <section className="event-section">
            <EventRating eventId={event._id} />
          </section>
        </div>

        <div className="event-sidebar">
          <div className="registration-card">
            <h3>Registration</h3>
            {isRegistered ? (
              <div className="registered-status">
                <span className="checkmark">✓</span>
                <p>You're registered!</p>
              </div>
            ) : (
              <>
                <p className="registration-info">
                  Join {event.participants?.length || 0} others who have already registered
                </p>
                <button
                  className="register-btn-large"
                  onClick={handleRegister}
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          <div className="quick-info-card">
            <h3>Quick Info</h3>
            <div className="quick-info-list">
              <div className="quick-info-item">
                <strong>Category:</strong>
                <span>{event.eventCategory}</span>
              </div>
              {event.difficulty && (
                <div className="quick-info-item">
                  <strong>Level:</strong>
                  <span>{event.difficulty}</span>
                </div>
              )}
              <div className="quick-info-item">
                <strong>Rating:</strong>
                <span>⭐ {event.averageRating.toFixed(1)}</span>
              </div>
              <div className="quick-info-item">
                <strong>Views:</strong>
                <span>{event.viewCount}</span>
              </div>
            </div>
          </div>

          {event.college && (
            <div className="organizer-card">
              <h3>Organizer</h3>
              <p className="organizer-name">{event.college.collegeName}</p>
              {event.college.location && (
                <p className="organizer-location">📍 {event.college.location}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
