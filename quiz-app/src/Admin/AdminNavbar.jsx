import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chat from '../assets/new chat.png';
import axios from 'axios';
import './AdminNavbar.css'; // Ensure your CSS file is correctly imported
import logo from '../assets/logo.png';
import AdminRequestManagement from './AdminRequestManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import the correct icon

const AdminNavbar = () => {
  const [unhandledRequests, setUnhandledRequests] = useState(0);

  const fetchUnhandledRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/requests/unhandled');
      const requests = response.data; 
      setUnhandledRequests(requests.length); 
      console.log('Fetched Unhandled Requests:', requests); 
      console.log('Fetched Unhandled Requests Count:', requests.length); 
    } catch (error) {
      console.error('Error fetching unhandled requests:', error);
    }
  };

  useEffect(() => {
    fetchUnhandledRequests();
    const interval = setInterval(fetchUnhandledRequests, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="admin-navbar container-fluid sticky-top">
      <Link to="/">
        <img src={logo} alt="CyberInfoMines Logo" className="company-logo" />
      </Link>
      <div className="navbar-icons">
        <Link to="/admin/admin-requests" className="ticket-icon" style={{ position: "relative", display: "inline-block" }}>
          <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ color: "#007BFF" }} />
          {unhandledRequests > 0 && (
            <span
              className="notification-badge"
              style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "5px 8px",
                fontSize: "12px",
              }}
            >
              {unhandledRequests}
            </span>
          )}
        </Link>
        <Link to="/admin/request-management" className="ticket-icon">
          <img src={chat} alt="Alert" />
          {unhandledRequests > 0 && (
            <span className="notification-badge">{unhandledRequests}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
