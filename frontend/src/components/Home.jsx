import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import Link from react-router-dom
import '../styles/Home.css'; // Ensure the CSS path is correct
import TrendingEvents from './TrendingEvents';

const Home = () => {
  let navigate = useNavigate();

  const routeChange = () => {
    let path = "/login";
    navigate(path);
  };

  // Dynamically Defined Features of the Event Aggregator
  const features = [
    {
      id: 1,
      title: 'Event Discovery',
      description: 'Find and explore the latest hackathons, workshops, cultural events, and more.',
      image: require('../images/discover.jpg'), // replace with actual image paths
    },
    {
      id: 2,
      title: 'Easy Registration',
      description: 'Quickly register for events with a simple and user-friendly interface.',
      image: require('../images/regestration.jpg'),
    },
     {
          id: 3,
          title: 'Student Registered events history',
          description: 'We can see the events in the students dashboard.',
          image: require('../images/studenthistory.jpg'),
     },
    // {
    //   id: 4,
    //   title: 'Event Updates',
    //   description: 'Stay updated with real-time changes and announcements for your events.',
    //   //image: require('../images/updates.jpg'),
    // },
    // {
    //   id: 5,
    //   title: 'Networking Opportunities',
    //   description: 'Meet like-minded people and connect with event participants and organizers.',
    //   //image: require('../images/networking.jpg'),
    // },
    {
      id: 6,
      title: 'Multimedia Integration',
      description: 'View event photos, videos, and other media to get a full event experience.',
      image: require('../images/multimedia.jpg'),
    },
  ];

  return (
    <div className="home">
      <h1 id="title">Welcome to Events Aggregator</h1>

      {/* Intro Section */}
      <div className="intro-section">
        <h2>Explore the Features of our Events Aggregator</h2>
        <p>Discover, register, and participate in events with ease. Here’s what we offer:</p>
      </div>

      {/* Trending Events Section */}
      <TrendingEvents />

      {/* Features Section */}
      <div className="features-section">
        <h2>Platform Features</h2>
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`feature-card ${index % 2 === 0 ? 'left' : 'right'}`} // Alternate left and right layout
          >
            <div className="feature-image-container">
              <img src={feature.image} alt={feature.title} className="feature-image" />
            </div>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call-to-Action Section */}
      <div className="call-to-action">
        <h3>Ready to Join the Fun?</h3>
        <p>Register now and be a part of these amazing events!</p>
        <button className="register-button" onClick={routeChange}>Register Now</button>
      </div>
    </div>
  );
};

export default Home;