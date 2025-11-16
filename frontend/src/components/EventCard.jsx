//eventcard.js 
import React from 'react';
import '../styles/EventCard.css'; // Ensure the correct path for your styles

const EventCard = ({ title, date, description, image }) => {
  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />
      <div className="event-info">
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
