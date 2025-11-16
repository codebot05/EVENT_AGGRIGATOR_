import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/eventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState(''); 
  const [filterCategory, setFilterCategory] = useState(''); 
  const navigate = useNavigate(); 

  
  const eventCategories = ['Hackathon', 'Sports Meet', 'Workshop', 'Seminar', 'Technical Fest'];

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/events/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        setEvents(response.data); 
        setFilteredEvents(response.data); 
      } catch (err) {
        setError('Failed to fetch events.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, [navigate]);

  
  useEffect(() => {
    const filtered = events.filter((event) => {
      const eventNameMatches =
        event.eventName && event.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const locationMatches =
        event.location && event.location.toLowerCase().includes(filterLocation.toLowerCase());
      const categoryMatches =
        event.eventCategory && event.eventCategory.toLowerCase().includes(filterCategory.toLowerCase());
  
      return (
        (eventNameMatches || !searchQuery) &&
        (locationMatches || !filterLocation) &&
        (categoryMatches || !filterCategory)
      );
    });
    setFilteredEvents(filtered);
  }, [searchQuery, filterLocation, filterCategory, events]);
  
 
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
  };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {

      
      await axios.post('http://localhost:4000/api/student/register-event', {
        eventId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      const event = events.find((e) => e._id === eventId);
      window.location.href = event.registrationLink;
    } catch (err) {
      console.error('Error during registration:', err.response || err.message);
    setError(err.response?.data?.message || 'Failed to register for the event.');
    }
  };

  const userType = localStorage.getItem('userType');;

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Explore Events</h2>

      
      {error && <div className="error-message">{error}</div>}

      
      {loading && <div className="loading-message">Loading events...</div>}

      
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by event name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="location-input"
        />
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {eventCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      
      <div className="events-container">
        {filteredEvents.length === 0 ? (
          <p>No events available for the selected criteria.</p>
        ) : (
          <ul>
            {filteredEvents.map((event) => (
              <li key={event._id} className="event-item">
                <h3>{event.eventName}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Deadline Date:</strong> {formatDate(event.date)} 
                </p>
                <p>
                  <strong>Deadline Time:</strong> {event.time}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Category:</strong> {event.eventCategory}
                </p>
                {event.eventImage && <img src={event.eventImage} alt={event.eventName} />}
                {event.registrationLink && (userType === 'student') && (
                  <button onClick={() => handleRegister(event._id)}>
                    Register
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
