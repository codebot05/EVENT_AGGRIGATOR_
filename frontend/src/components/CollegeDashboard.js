import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CollegeDashboard.css';

const CollegeDashboard = () => {
  const [college, setCollege] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    date: '',
    time: '',
    location: '',
    eventCategory: '',
    image: null, // New state for the image
    registrationLink: '',
    isPublic: true, // New field for public/private events
  });
  const [error, setError] = useState(null);
  const eventCategories = ['Hackathon', 'Sports Meet', 'Workshop', 'Seminar', 'Technical Fest'];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Fetch college profile details
      axios.get('http://localhost:4000/api/college/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setCollege(response.data))
        .catch(err => console.error('Error fetching college profile', err));

      // Fetch college events
      axios.get('http://localhost:4000/api/college/events', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setEvents(response.data))
        .catch(err => console.error('Error fetching college events', err));
    } else {
      console.error('Token is missing');
    }
  }, []);

  const handlePostEvent = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to post events.');
      return;
    }

    const formData = new FormData();
    formData.append('eventName', newEvent.eventName);
    formData.append('description', newEvent.description);
    formData.append('date', newEvent.date);
    formData.append('time', newEvent.time);
    formData.append('location', newEvent.location);
    formData.append('eventCategory', newEvent.eventCategory);
    formData.append('registrationLink', newEvent.registrationLink);
    formData.append('isPublic', newEvent.isPublic); // Add visibility field
    if (newEvent.image) formData.append('image', newEvent.image); // Append image if present

    console.log('FormData fields:');

  formData.forEach((value, key) => {

    console.log(`${key}:`, value); // Logs each key and value in FormData

  });

    axios.post('http://localhost:4000/api/college/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setEvents([...events, response.data.event]);
        setNewEvent({
          eventName: '',
          description: '',
          date: '',
          time: '',
          location: '',
          eventCategory: '',
          registrationLink: '',
          image: null, // Reset image state
          isPublic: true, // Reset to default
        });
        alert('Event posted successfully');
      })
      .catch(err => {
        setError('Error posting event');
        console.error('Error posting event', err);
      });
  };

  const handleDeleteEvent = (eventId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to delete events.');
      return;
    }

    axios.delete(`http://localhost:4000/api/college/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setEvents(events.filter(event => event._id !== eventId));
        alert('Event deleted successfully');
      })
      .catch(err => {
        console.error('Error deleting event', err);
        alert('Error deleting event');
      });
  };

  const handleImageChange = (e) => {
    setNewEvent({ ...newEvent, image: e.target.files[0] });
  };

  if (!college) return <div>Loading profile...</div>;

  return (
    <div className='dashboard-container'>
      <h2>{college.collegeName}'s Dashboard</h2>
      <div className='profile-details'>
        <h3>Profile Details</h3>
        <p>Email: {college.email}</p>
        <p>Location: {college.location}</p>
      </div>

      <div className='manage-events'>
        <h3>Manage Events</h3>
        <h3>Post a New Event :</h3>
        {/* Display error if posting fails */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handlePostEvent}>
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.eventName}
            onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            required
          />
          <select name='eventCategory'
            value={newEvent.eventCategory}
            onChange={(e) => setNewEvent({ ...newEvent, eventCategory: e.target.value})}>
            <option value="">All Categories</option>
            {eventCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
            ))}
          </select>
          
          <input
            name='image'
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />

          <input
            type="text"
            placeholder="Registration Link"
            value={newEvent.registrationLink}
            onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
          />

          <div className="visibility-toggle">
            <label>
              <input
                type="radio"
                name="visibility"
                checked={newEvent.isPublic === true}
                onChange={() => setNewEvent({ ...newEvent, isPublic: true })}
              />
              <span className="radio-label">
                <strong>🌐 Public Event</strong>
                <small>Anyone can see and register</small>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="visibility"
                checked={newEvent.isPublic === false}
                onChange={() => setNewEvent({ ...newEvent, isPublic: false })}
              />
              <span className="radio-label">
                <strong>🔒 Private Event</strong>
                <small>Invitation-only, not shown publicly</small>
              </span>
            </label>
          </div>

          <button type="submit">Post Event</button>
        </form>

        <h4 className='event-list'>Existing Events</h4>
        <ul>
          {events.map(event => (
            <li key={event._id}>
              {event.eventName} - {event.date} at {event.time}
              <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollegeDashboard; 
