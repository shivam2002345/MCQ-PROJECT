import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chat from '../assets/new chat.png';
import axios from 'axios';
import './AdminNavbar.css';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faDownload } from '@fortawesome/free-solid-svg-icons';
import logAction from '../utils/logAction'; // Adjust the path as needed

const AdminNavbar = () => {
  const [unhandledRequests, setUnhandledRequests] = useState(0);

  const fetchUnhandledRequests = async () => {
    try {
      logAction('INFO', 'Fetching unhandled requests'); // Log action when fetching requests
      const response = await axios.get('http://localhost:8080/api/admin/requests/unhandled');
      const requests = response.data;
      setUnhandledRequests(requests.length);
      console.log('Fetched Unhandled Requests:', requests);
      logAction('INFO', `Fetched ${requests.length} unhandled requests`); // Log the number of requests fetched
    } catch (error) {
      console.error('Error fetching unhandled requests:', error);
      logAction('ERROR', 'Error fetching unhandled requests'); // Log error if request fails
    }
  };

  useEffect(() => {
    fetchUnhandledRequests();
    const interval = setInterval(fetchUnhandledRequests, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle download
  const handleDownload = async (fileId) => {
    try {
      logAction('INFO', `Initiating file download for file ID: ${fileId}`); // Log action when download starts
      const response = await axios.get(`http://localhost:8080/api/exam-csv/download/${fileId}`, {
        responseType: 'blob', // Ensure the response type is blob for file download
      });

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileId === '1' ? 'regular-file.csv' : 'custom-file.csv'; // Dynamically name the file
      link.click();
      logAction('INFO', `File with ID ${fileId} downloaded successfully`); // Log successful download
    } catch (error) {
      console.error('Error downloading file:', error);
      logAction('ERROR', `Error downloading file with ID ${fileId}`); // Log error if download fails
    }
  };

  return (
    <nav className="admin-navbar container-fluid sticky-top">
      <Link to="/" onClick={() => logAction('INFO', 'Logo clicked, navigating to home')}>
        <img src={logo} alt="CyberInfoMines Logo" className="company-logo" />
      </Link>
      <div className="navbar-icons">
        <Link
          to="/admin/admin-requests"
          className="ticket-icon"
          style={{ position: 'relative', display: 'inline-block' }}
          onClick={() => logAction('INFO', 'Navigating to Admin Requests page')}
        >
          <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ color: '#007BFF' }} />
          {unhandledRequests > 0 && (
            <span
              className="notification-badge"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '5px 8px',
                fontSize: '12px',
              }}
            >
              {unhandledRequests}
            </span>
          )}
        </Link>
        <Link
          to="/admin/request-management"
          className="ticket-icon"
          onClick={() => logAction('INFO', 'Navigating to Request Management page')}
        >
          <img src={chat} alt="Alert" />
          {unhandledRequests > 0 && <span className="notification-badge">{unhandledRequests}</span>}
        </Link>

        {/* Download Icon */}
        <div className="download-icon" style={{ position: 'relative' }}>
          <FontAwesomeIcon
            icon={faDownload}
            size="2x"
            style={{ color: '#007BFF', cursor: 'pointer' }}
            onClick={() => handleDownload('1')} // Download regular file (ID 1)
          />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
