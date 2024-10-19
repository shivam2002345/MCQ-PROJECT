import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const RequestForm = () => {
  const [note, setNote] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' , user_id: ''});
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const user_id = localStorage.getItem('user_id'); // user_id from local storage

  useEffect(() => {
    // Fetch user info based on user_id from backend
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${user_id}`);
        const data = await response.json();
        setUserInfo({ User: data.user_id,name: data.name, email: data.email });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (user_id) {
      fetchUserInfo();
    }
  }, [user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only send note and user_id to the backend
    const requestData = { user_id, note };

    try {
      const response = await fetch('http://localhost:8080/api/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccessMessage('Request submitted successfully!'); // Set success message
        setNote(''); // Clear the form after submission
      } else {
        console.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  return (
    <>
    <Navbar />
<div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h1>Request More Exam Attempts</h1>
      <form onSubmit={handleSubmit}>
        {/* Display name and email, fetched from backend */}

        <div className="form-group">
          <label>User</label>
          <input
            type="text"
            className="form-control"
            value={user_id}
            disabled
          />
           </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.name}
            disabled
          />
        </div>
        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={userInfo.email}
            disabled
          />
        </div>
        
        {/* Only take note input for the request */}
        <div className="form-group mt-3">
          <label>Note</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary mt-3">
          Submit Request
        </button>
      </form>

      {/* Display success message */}
      {successMessage && (
        <div className="alert alert-success mt-3">
          {successMessage}
        </div>
      )}
    </div>
    </>
  );
};

export default RequestForm;
