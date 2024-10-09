import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth'; // Import the auth function
import Navbar from './Navbar';

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

  const handleStartTest = () => {
    if (isAuthenticated()) {
      navigate('/test-setup');
    } else {
      setWarning('Please log in to start the test.');
      alert('Warning: Please log in to start the test.');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/profile`);
      setUserDetails(response.data.userDetails);
      setTestHistory(response.data.exams); // Correctly reference the exams array
    } catch (err) {
      setError('Error fetching user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAnalytics = async (resultId) => {
    try {
      console.log(`Fetching detailed analytics for resultId: ${resultId}, userId: ${userId}`);
      const response = await axios.get(`http://localhost:8080/testdetails/${resultId}`); // Correct API endpoint
      console.log('Fetched analytics data:', response.data);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching detailed analytics:', err.message);
      setError('Error fetching detailed analytics. Please try again later.');
    }
  };

  const handleGetAnalytics = (resultId) => {
    if (activeAnalytics === resultId) {
      // If the analytics for this resultId is already active, reset it
      setActiveAnalytics(null);
      setAnalytics(null); // Optionally clear the analytics data
    } else {
      // Otherwise, fetch the analytics
      fetchDetailedAnalytics(resultId);
      setActiveAnalytics(resultId); // Set the active analytics to this resultId
    }
  };

  const handleShowMore = () => {
    setVisibleTests((prev) => prev + 4); // Increase the visible test count
  };

  const handleShowLess = () => {
    setVisibleTests((prev) => Math.max(prev - 4, 4)); // Decrease the visible test count, but not below 4
  };

  useEffect(() => {
    if (userId) {
      console.log(`Component loaded with userId: ${userId}`);
      fetchUserProfile();
    } else {
      console.error('No user ID provided.');
      setError('No user ID provided.');
      setLoading(false);
    }
  }, [userId]);

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
        <div className="card shadow-sm p-4 mb-4">
          <h2 className="text-center mb-4">User Profile</h2>
          {userDetails && (
            <div className="mb-4">
              <p><strong>Email:</strong> {userDetails.email}</p> {/* Show email at the top */}
              <p><strong>Name:</strong> {userDetails.name}</p>
            </div>
          )}

          <h3 className="mb-3">Test History</h3>
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
                  {testHistory.slice(0, visibleTests).map((test) => ( // Only show visible tests
                    <tr key={test.exam_id}>
                      <td>{test.technology}</td>
                      <td>{test.level}</td>
                      <td>{test.score}</td>
                      <td>{new Date(test.exam_date).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ display: 'block', width: '100%' }}
                          onClick={() => handleGetAnalytics(test.result_id)} // Change to result_id
                        >
                          Get Detailed Analytics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleTests < testHistory.length && ( // Show "Show More" button if there are more tests
                <button className="btn btn-primary" onClick={handleShowMore}>
                  Show More
                </button>
              )}
              {visibleTests > 4 && ( // Show "Show Less" button if more than 4 tests are visible
                <button className="btn btn-secondary" onClick={handleShowLess}>
                  Show Less
                </button>
              )}
            </div>
          ) : (
            <div className="alert alert-info">No test history available.</div>
          )}

          {analytics && activeAnalytics && (
            <div className="mt-4">
              <h3>Analytics Overview</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="card text-center mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Score</h5>
                      <p className="card-text" style={{ fontSize: '2rem' }}>{analytics.score}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card text-center mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Total Questions</h5>
                      <p className="card-text" style={{ fontSize: '2rem' }}>
                        {analytics.selected_answers ? analytics.selected_answers.length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h5>Question Breakdown</h5>
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
            <button className="btn btn-primary" onClick={handleStartTest}>
              Start Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
