//eventdetails.js
import React, { useEffect } from 'react';
import axios from 'axios';
import '../styles/EventDetails.css'; // Ensure you have appropriate styling
import EventRating from './EventRating';

const EventDetails = ({ event }) => {
  useEffect(() => {
    // Track event view when component loads
    const trackView = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token && event._id) {
          await axios.post(
            `http://localhost:4000/api/events/${event._id}/view`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [event._id]);

  return (
    <div className="event-details">
      <img src={`http://localhost:4000${event.image}`} alt={event.title} className="event-image" />
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Organizers:</strong> {event.organizers}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="register-button">Register Now</a>

      {event._id && <EventRating eventId={event._id} />}
    </div>
  );
};

export default EventDetails;
