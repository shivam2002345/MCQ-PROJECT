import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NewAdminNavbar.css';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = () => {
  const [unhandledRequests, setUnhandledRequests] = useState(0);

  // Add sticky class on scroll
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.admin-navbar');
      if (window.scrollY > 0) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch unhandled requests
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

  // Handle file download
  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/exam-csv/download/${fileId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileId === '3' ? 'regular-file.csv' : 'custom-file.csv'; // Dynamically name the file
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    fetchUnhandledRequests();
    const interval = setInterval(fetchUnhandledRequests, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="admin-navbar container-fluid sticky-top">
      <Link to="/">
        <img src={logo} alt="CyberInfoMines Logo" className="company-logo" />
      </Link>

      <div className="navbar-icons">
        {/* Download Icons with Labels */}
        <div className="download-icons"  style={{ color: 'white' }}>
          {[
            { id: '3', label: 'Olduser csv file', color: '#007BFF' },
            { id: '4', label: 'New User csv file', color: '#28a745' },
          ].map(({ id, label, color }, index) => (
            <div key={id} className="download-item" style={{ textAlign: 'center', marginLeft: index === 0 ? 0 : '20px' }}>
              <FontAwesomeIcon
                icon={faDownload}
                size="2x"
                style={{ color, cursor: 'pointer' }}
                onClick={() => handleDownload(id)}
              />
              <div style={{ marginTop: '5px', fontSize: '14px', color: '#333' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
