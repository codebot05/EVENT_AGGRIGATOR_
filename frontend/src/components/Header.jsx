import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in and set the user type
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserType = localStorage.getItem("userType");

    if (token && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array to run only once on mount

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);  // Manually update state to force re-render
    navigate('/login');    // Redirect to login page
  };

  // Define the route based on userType
  const route = userType === 'college' ? '/college/dashboard' : '/student/dashboard';

  return (
    <header className="header-container">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="logo-title"><Link to="/" className='logo-title'>EVENTS AGGREGATOR</Link></h1>
      </div>
      

      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/about-us" className="nav-link">About Us</Link>
        <Link to="/contact-us" className="nav-link">Contact Us</Link>

        {!isLoggedIn ? (
          <Link to="/login" className="nav-link">Login/Signup</Link>
        ) : (
          <Link to={`${route}`} className="nav-link">Dashboard</Link>
        )}

        {isLoggedIn && (
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
