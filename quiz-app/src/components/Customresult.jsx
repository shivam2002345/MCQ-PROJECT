import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customresult.css'
import UserNavbar from './Navbar';
import  logAction  from '../utils/logAction'; // Import the logAction function

const ExamResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID from local storage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      setError("User ID not found in local storage.");
      setLoading(false);
      return;
    }

    // Fetch results based on the user_id
    axios.get(`http://localhost:8080/api/hostedresults/user/${userId}`)
      .then((response) => {
        if (response.data.success) {
          setResults(response.data.data);
          // Log the action after successfully fetching results
          logAction(userId, 'fetched exam results');
        } else {
          setError("No results found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setError("Failed to fetch results.");
        setLoading(false);
        // Log the error action
        logAction(userId, 'failed to fetch exam results');
      });
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!results || results.length === 0) {
    return <div>No exam results found.</div>;
  }

  return (
    <>
      <UserNavbar />
      <div className="exam-results">
        <h1 className="page-title">Your Exam Results</h1>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Exam ID</th>
                <th>Technology</th>
                <th>Total Questions</th>
                <th>Total Marks</th>
                <th>Scored Marks</th>
                <th>Correct Answers</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.result_id}>
                  <td>{result.hosted_exam_id}</td>
                  <td>{result.technology}</td>
                  <td>{result.total_questions}</td>
                  <td>{result.total_marks}</td>
                  <td>{result.score}</td>
                  <td>{result.correct_answers}</td>
                  <td>{new Date(result.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExamResults;
