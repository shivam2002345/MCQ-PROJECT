// RequestDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatBox from './ChatBox';
import RequestStatus from './RequestStatus';
import logAction from '../utils/logAction'; // Import the logAction function

const RequestDetailsPage = () => {
  const { request_id } = useParams(); // Retrieve request_id from the URL
  const [request, setRequest] = useState(null); // State for request details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [requestStatus, setRequestStatus] = useState(''); // State for current status

  // Fetch request details
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`https://mcq-project-backend.onrender.com/api/superadmin/requests/${request_id}`); // Replace with your API endpoint
        setRequest(response.data);
        setRequestStatus(response.data.status); // Set the initial status
        setLoading(false);
        logAction(`Fetched details for request ID: ${request_id}`); // Log successful fetch
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('Unable to fetch request details. Please try again later.');
        setLoading(false);
        logAction(`Error fetching request ID: ${request_id} - ${err.message}`); // Log error
      }
    };

    fetchRequest();
  }, [request_id]);

  // Log status update action (optional: if a status is updated in the UI)
  const handleStatusUpdate = (newStatus) => {
    setRequestStatus(newStatus);
    logAction(`Updated status for request ID: ${request_id} to ${newStatus}`); // Log status change
  };

  if (loading) return <p>Loading request details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="request-details-page">
      <h1>Request Details</h1>

      {/* Display request details */}
      <div className="request-details">
        <h2>{request.request_title || 'No Title Available'}</h2>
        <p><strong>Description:</strong> {request.request_description || 'No Description Available'}</p>
        <p><strong>Submitted By:</strong> {request.admin_id || 'Unknown'}</p>
        <p><strong>Created At:</strong> {new Date(request.created_at).toLocaleString()}</p>
      </div>

      {/* Display current status and status updater */}
      <div className="request-status-section">
        <h3>Current Status: {requestStatus}</h3>
        <RequestStatus 
          request_id={request_id} 
          status={requestStatus} 
          setRequestStatus={handleStatusUpdate}  // Handle status update with logging
        />
      </div>

      {/* Chat box section */}
      <div className="chat-box-section">
        <h3>Chat</h3>
        <ChatBox 
          request_id={request_id} 
          onMessageSend={() => logAction(`Message sent in chat for request ID: ${request_id}`)}  // Log when a message is sent
        />
      </div>
    </div>
  );
};

export default RequestDetailsPage;
