import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logAction from '../utils/logAction'; // Adjust the path as needed
import './AdminList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    logAction('INFO', 'Fetching admins list'); // Log action before fetching
    axios
      .get('http://localhost:8080/api/admins')
      .then((response) => {
        setAdmins(response.data.admins);
        setLoading(false);
        logAction('INFO', 'Admins list fetched successfully'); // Log success
      })
      .catch(() => {
        setError('Failed to fetch admins.');
        setLoading(false);
        logAction('ERROR', 'Failed to fetch admins'); // Log error
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleAdminClick = (adminId) => {
    logAction('INFO', `Navigating to admin details for admin ID: ${adminId}`); // Log action before navigation
    navigate(`/admin/${adminId}`);
  };

  return (
    <div className="admin-list">
      <h2 className="title">Admin Information</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr
              key={admin.admin_id}
              onClick={() => handleAdminClick(admin.admin_id)}
              className="admin-row"
            >
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.organisation_name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
