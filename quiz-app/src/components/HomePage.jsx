import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { isAuthenticated } from '../utils/auth'; // Import the auth function
import quizImage from '../assets/home.jpg'; // Ensure the path is correct
import '../styles/HomePage.css'; // Import the custom CSS file

const HomePage = () => {
  const [warning, setWarning] = useState(''); // State to store the warning message
  const [notification, setNotification] = useState(''); // State to store login notification
  const navigate = useNavigate();
  const location = useLocation(); // Use this to get state passed during navigation

  useEffect(() => {
    // Check if notification was passed from login
    if (location.state && location.state.notification) {
      setNotification(location.state.notification);
      // Clear the notification from state after showing
      setTimeout(() => setNotification(''), 5000);
    }
  }, [location]);

  const handleStartTest = () => {
    if (isAuthenticated()) {
      navigate('/test-setup');
    } else {
      setWarning('Please log in to start the test.'); // Set the warning message
    }
  };

  return (
    <div className="homepage-container">
      <Navbar />

      {notification && (
        <div className="alert alert-success notification" role="alert">
          {notification}
        </div>
      )}

      <div className="content-overlay">
        <h1 className="title">Welcome to the Online Quiz of CyberInfoMines</h1>

        {warning && (
          <div className="alert-custom alert-warning" role="alert">
            {warning}
          </div>
        )}

        <button className="button  mt-3" onClick={handleStartTest}>
          Start Test
        </button>
      </div>
      <footer className="footer">
        <p>&copy; 2024 CyberInfoMines. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
