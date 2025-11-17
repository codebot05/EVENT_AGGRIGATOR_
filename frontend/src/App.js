import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './components/Authpage';
import ContactUsPage from './pages/Contactus';
import Home from './components/Home';
import AboutPage from './pages/AboutPage';
import StudentDashboard from './components/StudentDashboard';
import CollegeDashboard from './components/CollegeDashboard';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import Chatbot from './components/Chatbot';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if auth token exists

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />

          <Route
            path="/college/dashboard"
            element={<PrivateRoute element={<CollegeDashboard />} />}
          />
          <Route
            path="/student/dashboard"
            element={<PrivateRoute element={<StudentDashboard />} />}
          />
        </Routes>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
