import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import logAction from '../utils/logAction'; // Import logAction.js

const UserProfile = () => {
    const { user_id } = useParams();
    const [user, setUser] = useState(null);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noHistoryMessage, setNoHistoryMessage] = useState(null); // For custom message from backend
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            // Log action for viewing user profile
            await logAction('View User Profile', `Viewing profile of user with ID: ${user_id}`);

            const userResponse = await fetch(`http://localhost:8080/api/users/${user_id}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user data');
            const userData = await userResponse.json();
            setUser(userData);

            const examsResponse = await fetch(`http://localhost:8080/api/users/${user_id}/profile`);
            const examsData = await examsResponse.json();

            if (examsResponse.ok) {
                if (examsData.exams) {
                    setExams(examsData.exams);
                } else if (examsData.message) {
                    setNoHistoryMessage(examsData.message); // Capture backend message
                }
            } else {
                throw new Error('Failed to fetch exams data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToUserList = async () => {
        try {
            // Log action for navigating back to the user list
            await logAction('Back to User List', `Navigated back to the user list from profile of user with ID: ${user_id}`);
            navigate('/admin/users');
        } catch (err) {
            console.error('Error logging action:', err.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user_id]);

    if (loading) return <p className="text-center loading">Loading user data...</p>;
    if (error) return <div className="alert alert-danger text-center" role="alert">Error: {error}</div>;

    return (
        <div className="container user-profile mt-5">
            <div className="profile-header">
                <h2 className="text-center user-name">{user ? user.name : 'User Not Found'}</h2>
                <div className="user-info shadow">
                    {user ? (
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Allowed Count:</span>
                                <span className="info-value">{user.allowed_count || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">User Count:</span>
                                <span className="info-value">{user.user_count || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Total Exams Given:</span>
                                <span className="info-value">{exams.length > 0 ? exams.length : '0'}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="no-details">No details available for this user.</p>
                    )}
                </div>
            </div>

            <h3 className="mt-4 text-success">Exam Details</h3>
            {noHistoryMessage ? ( // Display message if no history is available
                <p className="no-history-message">{noHistoryMessage}</p>
            ) : exams.length > 0 ? (
                <table className="table table-hover shadow">
                    <thead className="thead-dark">
                        <tr>
                            <th>Technology</th>
                            <th>Level</th>
                            <th>Score</th>
                            <th>Date of Exam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={exam.exam_id}>
                                <td>{exam.technology}</td>
                                <td>{exam.level}</td>
                                <td>{exam.score}</td>
                                <td>{new Date(exam.exam_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No exam records found.</p>
            )}
            <button onClick={handleBackToUserList} className="btn btn-warning mt-4">Back to User List</button>
        </div>
    );
};

export default UserProfile;
