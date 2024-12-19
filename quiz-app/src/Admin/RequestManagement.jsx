import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RequestManagement.css';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [allowedCounts, setAllowedCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');  // New state for notifications

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://mcq-project-backend.onrender.com/api/admin/requests');
        setRequests(response.data);

        const counts = {};
        await Promise.all(
          response.data.map(async (request) => {
            const userResponse = await axios.get(`https://mcq-project-backend.onrender.com/api/users/${request.user_id}`);
            counts[request.user_id] = userResponse.data.allowed_count;
          })
        );
        setAllowedCounts(counts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId, userId) => {
    try {
      const newAllowedCount = allowedCounts[userId];
      await axios.put(`https://mcq-project-backend.onrender.com/api/users/${userId}/allowed_count`, {
        allowed_count: newAllowedCount,
      });

      const response = await axios.post(`https://mcq-project-backend.onrender.com/api/admin/requests/accept/${requestId}`);
      setNotification('Request accepted successfully! 🎉');  // Show success notification
      removeHandledRequest(requestId);
    } catch (error) {
      console.error('Error accepting request:', error);
      setError('Failed to accept the request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(`https://mcq-project-backend.onrender.com/api/admin/requests/reject/${requestId}`);
      setNotification('Request rejected successfully! ❌');  // Show success notification
      removeHandledRequest(requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject the request');
    }
  };

  const removeHandledRequest = (requestId) => {
    setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
  };

  const handleAllowedCountChange = (userId, newCount) => {
    setAllowedCounts((prevCounts) => ({
      ...prevCounts,
      [userId]: newCount,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="request-management">
      <div className="header">
        <h1>Request Management</h1>
        {notification && <div className="notification">{notification}</div>} {/* Notification display */}
        <div className="actions">
        </div>
      </div>
      <table className="requests-table">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Username</th>
            <th>Email</th>
            <th>Note</th>
            <th>Allowed Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-requests">
                No requests available 🙌
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.user_id}</td>
                <td>{request.username}</td>
                <td>{request.email}</td>
                <td>{request.note}</td>
                <td>
                  <input
                    type="number"
                    value={allowedCounts[request.user_id] || 0}
                    onChange={(e) => handleAllowedCountChange(request.user_id, e.target.value)}
                    min="1"
                    className="allowed-count-input"
                  />
                </td>
                <td className="actions-buttons">
                  <button onClick={() => handleAccept(request.id, request.user_id)} className="btn-accept">
                    Accept
                  </button>
                  <button onClick={() => handleReject(request.id)} className="btn-reject">
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestManagement;
