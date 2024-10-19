import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token'); // Adjust the key based on how you store your token

    // If there's no token, redirect to the login page
    if (!token) {
        return <Navigate to="/admin/login" />;
    }

    // You can add more logic here to validate the token if needed
    // E.g., checking token expiration or validity

    return element; // If token exists, render the requested component
};

export default ProtectedRoute;
