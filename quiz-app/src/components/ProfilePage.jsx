import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth'; // Import the auth function
import Navbar from './Navbar';
import './ProfilePage.css'; // Import your custom CSS file

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');
  const [visibleTests, setVisibleTests] = useState(4); // State to control visible tests
  const [activeAnalytics, setActiveAnalytics] = useState(null); // State to control which analytics are shown

  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  // logAction function to track user actions
  const logAction = (actionType, message) => {
    console.log(`Action: ${actionType}, Message: ${message}`);
    // Ideally, send this data to a logging endpoint or analytics service
    axios.post('https://mcq-project-backend.onrender.com/api/logs', {
      userId,
      actionType,
      message,
      timestamp: new Date().toISOString(),
    }).catch(err => console.error('Error logging action:', err));
  };

  const handleStartTest = () => {
    if (isAuthenticated()) {
      logAction('Start Test', 'User started the test setup.');
      navigate('/test-setup');
    } else {
      setWarning('Please log in to start the test.');
      logAction('Warning', 'User attempted to start the test without being logged in.');
      alert('Warning: Please log in to start the test.');
    }
  };

  const fetchUserDetail = async () => {
    if (!userId) {
      setError('No user ID found. Please log in again.');
      return;
    }

    try {
      setLoading(true); 
      const response = await axios.get(`https://mcq-project-backend.onrender.com/api/users/${userId}`);
      console.log("User details response:", response.data); 

      if (response.data) {
        setUserDetails({
          name: response.data.name,
          email: response.data.email,
          allowed_count: response.data.allowed_count,
        });
        logAction('Fetch User Details', 'Successfully fetched user details.');
      } else {
        setError('No user details available.');
        logAction('Error', 'User details not found.');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Error fetching user details. Please try again later.');
      logAction('Error', 'Failed to fetch user details.');
    } finally {
      setLoading(false); 
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`https://mcq-project-backend.onrender.com/api/users/${userId}/profile`);
      if (response.data.userDetails) {
        setUserDetails(prevDetails => ({
          ...prevDetails,
          ...response.data.userDetails,
        }));
      }

      if (response.data.exams && response.data.exams.length > 0) {
        setTestHistory(response.data.exams);
        logAction('Fetch Test History', 'Successfully fetched test history.');
      }
    } catch (err) {
      setError('Error fetching user profile. Please try again later.');
      logAction('Error', 'Failed to fetch user profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAnalytics = async (resultId) => {
    try {
      console.log(`Fetching detailed analytics for resultId: ${resultId}, userId: ${userId}`);
      const response = await axios.get(`https://mcq-project-backend.onrender.com/testdetails/${resultId}`);
      console.log('Fetched analytics data:', response.data);
      setAnalytics(response.data);
      logAction('Fetch Analytics', `Successfully fetched analytics for resultId: ${resultId}`);
    } catch (err) {
      console.error('Error fetching detailed analytics:', err.message);
      setError('Error fetching detailed analytics. Please try again later.');
      logAction('Error', `Failed to fetch analytics for resultId: ${resultId}`);
    }
  };

  const handleGetAnalytics = (resultId) => {
    if (activeAnalytics === resultId) {
      setActiveAnalytics(null);
      setAnalytics(null); // Optionally clear the analytics data
    } else {
      fetchDetailedAnalytics(resultId);
      setActiveAnalytics(resultId); // Set the active analytics to this resultId
    }
  };

  const handleShowMore = () => {
    setVisibleTests((prev) => prev + 4); // Increase the visible test count
    logAction('Show More Tests', 'User clicked to show more tests.');
  };

  const handleShowLess = () => {
    setVisibleTests((prev) => Math.max(prev - 4, 4)); // Decrease the visible test count, but not below 4
    logAction('Show Less Tests', 'User clicked to show fewer tests.');
  };

  useEffect(() => {
    if (userId) {
      console.log(`Component loaded with userId: ${userId}`);
      fetchUserDetail(); 
      fetchUserProfile(); 
    } else {
      console.error('No user ID provided.');
      setError('No user ID provided.');
      setLoading(false);
      logAction('Error', 'No user ID provided.');
    }
  }, [userId]);

  useEffect(() => {
    console.log('Profile component rendered');
    logAction('Render Profile', 'Profile component was rendered.');
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="card shadow-lg profile-card">
          <h2 className="text-center mb-4 profile-heading">User Profile</h2>
          {userDetails ? (
            <div className="mb-4 user-info">
              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{userDetails.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userDetails.email}</span>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">Allowed Count:</span>
                  <span className="info-value">{userDetails.allowed_count}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">No user details available.</div>
          )}

          <h3 className="mb-3 test-history-heading">Test History</h3>
          {testHistory && testHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Technology</th>
                    <th>Level</th>
                    <th>Score</th>
                    <th>Exam Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testHistory.slice(0, visibleTests).map((test) => (
                    <tr key={test.exam_id}>
                      <td>{test.technology}</td>
                      <td>{test.level}</td>
                      <td>{test.score}</td>
                      <td>{new Date(test.exam_date).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm animated-button"
                          onClick={() => handleGetAnalytics(test.result_id)}
                        >
                          Get Detailed Analytics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleTests < testHistory.length && (
                <button className="btn btn-primary animated-button" onClick={handleShowMore}>
                  Show More
                </button>
              )}
              {visibleTests > 4 && (
                <button className="btn btn-secondary animated-button" onClick={handleShowLess}>
                  Show Less
                </button>
              )}
            </div>
          ) : (
            <div className="alert alert-info">No test history available.</div>
          )}

          {analytics && activeAnalytics && (
            <div className="mt-4 analytics-section">
              <h3 className="analytics-heading">Analytics Overview</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="card text-center mb-3 analytics-card">
                    <div className="card-body">
                      <h5 className="card-title">Score</h5>
                      <p className="card-text" style={{ fontSize: '2rem' }}>{analytics.score}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card text-center mb-3 analytics-card">
                    <div className="card-body">
                      <h5 className="card-title">Total Questions</h5>
                      <p className="card-text" style={{ fontSize: '2rem' }}>
                        {analytics.selected_answers ? analytics.selected_answers.length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="question-breakdown-heading">Question Breakdown</h5>
              <div className="list-group">
                {analytics.selected_answers ? (
                  analytics.selected_answers.map((item, index) => (
                    <div className="list-group-item" key={index}>
                      <p><strong>Q{index + 1}: {item.question_text}</strong></p>
                      <p><strong>Selected:</strong> {item.selected_option}
                        <span className={`badge ${item.selected_option === item.correct_option ? 'bg-success' : 'bg-danger'}`}>
                          {item.selected_option === item.correct_option ? 'Correct' : 'Incorrect'}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-info">No analytics data available.</div>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <button className="btn btn-primary animated-button" onClick={handleStartTest}>
              Start Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
