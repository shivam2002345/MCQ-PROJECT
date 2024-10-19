import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { isAuthenticated } from '../utils/auth'; // Import the auth function
// import quizImage from '../assets/home.jpg'; // Ensure the path is correct
import '../styles/HomePage.css'; // Import the custom CSS file
// import choose from '../assets/choose.jpg';
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
     {warning && (
          <div className="alert-custom alert-warning" role="alert">
            {warning}
          </div>
        )}
    <div className="content-overlay">
        <h1 className="title">Welcome to the Online Quiz of CyberInfoMines</h1>
        <button className="button  mt-3" onClick={handleStartTest}>
          Start Test
        </button>
    </div>

    <section className="info-section">
            <div>
                <h2>Why Choose Us?</h2>
                <p>We provide comprehensive quizzes designed to enhance your knowledge and test your skills in various subjects.</p>
                <ul>
                    <li>Interactive quizzes with instant feedback.</li>
                    <li>Track your progress and performance.</li>
                    <li>Accessible anytime, anywhere.</li>
                </ul>
            </div>
            {/* <img src={choose} alt="Quiz Illustration" className="info-image" /> */}
        </section>



    <footer className="footer mt-5">
    <div className="social-icons">
        <a href="https://www.facebook.com/cyberinfomines/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i> {/* Font Awesome icon */}
        </a>
        <a href="https://x.com/cyberinfomines/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i> {/* Font Awesome icon */}
        </a>
        <a href="https://www.instagram.com/cyberinfomines/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i> {/* Font Awesome icon */}
        </a>
        <a href="https://www.linkedin.com/company/cyberinfomines-technology-pvt-ltd/mycompany/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i> {/* Font Awesome icon */}
        </a>
    </div>
    <p>&copy; 2024 CyberInfoMines. All rights reserved.</p>
</footer>

</div>
  );
};

export default HomePage;
