import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UpdatedUserNavbar from './Navbar';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { FaUserShield } from 'react-icons/fa';
import '../styles/HomePage.css';

const HomePage = () => {
  const [warning, setWarning] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
      setTimeout(() => setNotification(''), 5000);
    }
  }, [location]);

  const handleStartTest = () => {
    if (isAuthenticated()) {
      navigate('/test-setup');
    } else {
      setWarning('Please log in to start the test.');
    }
  };

  return (
    <div className="homepage-container">
      <UpdatedUserNavbar />
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
        <button className="button mt-3" onClick={handleStartTest}>
          Start Test
        </button>
      </div>

      <section className="info-section">
        <div>
          <h2>Why Choose Us?</h2>
          <p>
            We provide comprehensive quizzes designed to enhance your knowledge
            and test your skills in various subjects.
          </p>
          <ul>
            <li>Interactive quizzes with instant feedback.</li>
            <li>Track your progress and performance.</li>
            <li>Accessible anytime, anywhere.</li>
          </ul>
        </div>
      </section>

      <footer className="footer mt-5">
        <div className="social-icons">
          <a
            href="https://www.facebook.com/cyberinfomines/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://x.com/cyberinfomines/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/cyberinfomines/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/cyberinfomines-technology-pvt-ltd/mycompany/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <p>&copy; 2024 CyberInfoMines. All rights reserved.</p>
        <ul>
          <li>
            <Link to="/admin/login">
              <FaUserShield className="user-nav-icon" /> Admin Panel
            </Link>
          </li>
          <li>
            <Link to="/become-an-admin">
              <FaUserShield className="user-nav-icon" /> Apply for Admin Role
            </Link>
          </li>
          <li>
            <Link to="/new-admin-login">
              <FaUserShield className="user-nav-icon" /> Login as Admin
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default HomePage;
