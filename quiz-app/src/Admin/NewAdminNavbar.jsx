import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import chat from '../assets/new chat.png';
import axios from 'axios';
import './NewAdminNavbar.css'; // Ensure your CSS file is correctly imported
import logo from '../assets/logo.png';
// import AdminRequestManagement from './AdminRequestManagement';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import the correct icon

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
    <nav className="newadmin-navbar sticky-top">
      <Link to="/">
        <img src={logo} alt="CyberInfoMines Logo" className="newadmin-company-logo" />
      </Link>
      <div className="navbar-icons">
       
      </div>
    </nav>
  );
};

export default AdminNavbar;
