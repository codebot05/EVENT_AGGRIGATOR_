
// privateroute.js
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

// This function could check for an authentication token, user role, etc.
const useAuth = () => {
    const token = localStorage.getItem('authToken'); // or any method you use to check authentication
    return token !== null; // return true if authenticated, false otherwise
};

const PrivateRoute = () => {
    const isAuthenticated = useAuth();

    // If the user is authenticated, render child routes; otherwise, redirect to the authentication page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
