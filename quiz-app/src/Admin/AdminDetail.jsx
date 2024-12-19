import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import logAction  from '../utils/logAction'; // Adjust path based on where your logAction file is
import './AdminDetail.css';

const AdminDetail = () => {
  const { adminId } = useParams();
  const [admin, setAdmin] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        logAction('INFO', `Fetching details for admin ID: ${adminId}`); // Log action before fetching
        const [adminResponse, examsResponse] = await Promise.all([
          axios.get(`https://mcq-project-backend.onrender.com/api/admins/${adminId}`),
          axios.get(`https://mcq-project-backend.onrender.com/api/admin/${adminId}/exams`),
        ]);
        setAdmin(adminResponse.data.admin);
        setExams(examsResponse.data.exams);
        setLoading(false);
        logAction('INFO', `Successfully fetched details for admin ID: ${adminId}`); // Log success
      } catch (err) {
        setError('Failed to fetch admin details.');
        setLoading(false);
        logAction('ERROR', `Failed to fetch details for admin ID: ${adminId}`); // Log error
      }
    };
    fetchAdminDetails();
  }, [adminId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-detail">
      <div className="header">
        <Link to="/admin/adminlist" className="back-button">← Back to Admins</Link>
        <h1 className="page-title">Admin Details</h1>
      </div>
      <div className="admin-info">
        <h2 className="section-title">Profile</h2>
        <div className="admin-info-card">
          <h3>{admin.name}</h3>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Mobile:</strong> {admin.mobile_no || 'N/A'}</p>
          <p><strong>Organization:</strong> {admin.organisation_name || 'N/A'}</p>
          <p><strong>Designation:</strong> {admin.designation || 'N/A'}</p>
          <p><strong>Address:</strong> {admin.organisation_address || 'N/A'}</p>
        </div>
      </div>
      <div className="exam-list">
        <h2 className="section-title">Hosted Exams</h2>
        {exams.length > 0 ? (
          <div className="exam-list-container">
            {exams.map((exam) => (
              <div className="exam-card" key={exam.exam_id}>
                <h4>{exam.technology}</h4>
                <p><strong>Questions:</strong> {exam.num_questions}</p>
                <p><strong>Duration:</strong> {exam.duration} mins</p>
                <p><strong>Created At:</strong> {new Date(exam.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-exams">No exams hosted yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDetail;
