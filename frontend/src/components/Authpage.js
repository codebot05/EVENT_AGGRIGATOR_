import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const [isStudent, setIsStudent] = useState(true); // Track if it's student or college
  const [isSignup, setIsSignup] = useState(false);  // Track if it's signup or login

  const handleLogin = (userData) => {
    // Handle successful login (e.g., store JWT or user details)
    console.log('Logged in:', userData);

    // You can store the JWT token or user details in localStorage or context
    localStorage.setItem('user', JSON.stringify(userData));  // Example to store in localStorage

    // Redirect user to their respective dashboard (student/college)
    if (userData.userType === 'college') {
      window.location.href = '/college/dashboard';  // Redirect to college dashboard
    } else if(userData.userType === 'student') {
      window.location.href = '/student/dashboard';  // Redirect to student dashboard
    }
  };

  const handleSignup = (userData) => {
    // Handle successful signup (e.g., store token, redirect)
    console.log('Signed up:', userData);
    // Redirect user to login after signup (or redirect to dashboard if needed)
    window.location.href = '/login';  // Redirect to login page after successful signup
  };

  return (
    <div className="auth-page">
      {/* Render the appropriate form based on isSignup */}
      {isSignup ? (
        <Signup userType={isStudent ? 'student' : 'college'} onSignup={handleSignup} />
      ) : (
        <Login userType={isStudent ? 'student' : 'college'} onLogin={handleLogin} />
      )}

      {/* Button to toggle between Signup and Login */}
      <button onClick={() => setIsSignup(!isSignup)} className="new-user-btn">
        {isSignup ? 'Already have an account? Login' : 'New User? Signup'}
      </button>

      {/* Button to toggle between Student and College login/signup */}
      <button onClick={() => setIsStudent(!isStudent)} className="college-student-btn">
        {isStudent ? 'Sign up/Login as College' : 'Sign up/Login as Student'}
      </button>
    </div>
  );
};

export default AuthPage;
