import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logAction from '../utils/logAction';  // Import the logAction function

const SuperAdminDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/superadmin/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
        logAction('Fetch Requests', { count: response.data.length, requests: response.data }); // Log the action after fetching
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="superadmin-dashboard">
      <h1>SuperAdmin Dashboard</h1>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <Link to={`admin/request/${request.id}`}>{request.request_title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminDashboard;
