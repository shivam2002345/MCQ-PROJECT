import React from 'react';
import axios from 'axios';

const RequestStatus = ({ request_id, status, setRequestStatus }) => {
  const logAction = (action, newStatus) => {
    console.log(`Action: ${action} | Request ID: ${request_id} | New Status: ${newStatus}`);
    // You can send this log to a backend or a logging service if needed.
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`https://mcq-project-backend.onrender.com/api/superadmin/requests/${request_id}/status`, { status: newStatus });
      setRequestStatus(newStatus);
      logAction('Status Updated', newStatus); // Log the action after status update
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="request-status">
      <p>Status: {status}</p>
      <button onClick={() => updateStatus('approved')}>Approve</button>
      <button onClick={() => updateStatus('rejected')}>Reject</button>
      <button onClick={() => updateStatus('pending')}>Pending</button>
    </div>
  );
};

export default RequestStatus;
