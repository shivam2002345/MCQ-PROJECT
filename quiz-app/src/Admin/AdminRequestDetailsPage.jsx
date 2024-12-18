import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatBox from './ChatBox';
import RequestStatus from './RequestStatus';

// Log action function
const logAction = (message, data = {}) => {
  console.log(message, data); // You can expand this to log to an API or external service
};

const AdminRequestDetailsPage = () => {
  const { request_id } = useParams(); // Retrieve request_id from the URL
  const [request, setRequest] = useState(null); // State for request details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [requestStatus, setRequestStatus] = useState(''); // State for current status

  // Fetch request details
  useEffect(() => {
    const fetchRequest = async () => {
      logAction('Fetching request details for request_id:', { request_id }); // Log fetching action
      try {
        const response = await axios.get(`http://localhost:8080/api/superadmin/requests/${request_id}`); // Replace with your API endpoint
        logAction('Request details fetched successfully:', response.data); // Log successful fetch
        setRequest(response.data);
        setRequestStatus(response.data.status); // Set the initial status
        setLoading(false);
      } catch (err) {
        logAction('Error fetching request details:', err); // Log error during fetch
        setError('Unable to fetch request details. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequest();
  }, [request_id]);

  if (loading) {
    logAction('Loading request details...');
    return <p>Loading request details...</p>;
  }

  if (error) {
    logAction('Error:', { error });
    return <p>{error}</p>;
  }

  logAction('Request details:', request);
  logAction('Current request status:', requestStatus);

  return (
    <div className="request-details-page">
      <h1>Request Details</h1>

      {/* Display request details */}
      <div className="request-details">
        <h2>{request.request_title || 'No Title Available'}</h2>
        <p><strong>Description:</strong> {request.request_description || 'No Description Available'}</p>
        <p><strong>Created At:</strong> {new Date(request.created_at).toLocaleString()}</p>
      </div>

      {/* Display current status and status updater */}
      <div className="request-status-section">
        <h3>Current Status: {requestStatus}</h3>
        {/* You can add the RequestStatus component to handle status changes */}
        {/* <RequestStatus
          request_id={request_id}
          status={requestStatus}
          setRequestStatus={setRequestStatus} // Update status dynamically
        /> */}
      </div>

      {/* Chat box section */}
      <div className="chat-box-section">
        <h3>Chat</h3>
        <ChatBox request_id={request_id} />
      </div>
    </div>
  );
};

export default AdminRequestDetailsPage;
