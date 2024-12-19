import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewAdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    request_title: '',
    request_description: '',
  });

  // Fetch existing requests
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token'); // Ensure the token exists
      try {
        const response = await axios.get('https://mcq-project-backend.onrender.com/api/superadmin/requests', {
          headers: { Authorization: `Bearer ${token}` }, // Add token if needed
        });
        console.log('API Response:', response.data); // Log API response for debugging
        setRequests(response.data); // Update state with fetched requests
      } catch (err) {
        console.error('Error fetching admin requests:', err);
      }
    };

    fetchRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  // Handle form submission for creating a new request
  const handleCreateRequest = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const admin_id = localStorage.getItem('admin_id'); // Fetch admin_id from localStorage

    if (!admin_id) {
      console.error('Admin ID is missing in localStorage!');
      return;
    }

    try {
      const response = await axios.post(
        'https://mcq-project-backend.onrender.com/api/superadmin/requests',
        { ...newRequest, admin_id }, // Include admin_id in the payload
        {
          headers: { Authorization: `Bearer ${token}` }, // Add token if needed
        }
      );
      console.log('New Request Created:', response.data);

      // Add the new request to the list without re-fetching
      setRequests((prevRequests) => [...prevRequests, response.data]);

      // Reset form
      setNewRequest({ request_title: '', request_description: '' });
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Form to create a new request */}
      <form onSubmit={handleCreateRequest} className="create-request-form">
        <h2>Create New Request</h2>
        <div>
          <label htmlFor="request_title">Title:</label>
          <input
            type="text"
            id="request_title"
            name="request_title"
            value={newRequest.request_title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="request_description">Description:</label>
          <textarea
            id="request_description"
            name="request_description"
            value={newRequest.request_description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit Request</button>
      </form>

      {/* List of existing requests */}
      <h2>Existing Requests</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <Link to={`admin/request/${request.id}`}>
                {request.request_title || 'No Title Available'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default NewAdminRequest;
