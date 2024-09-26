import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ScorePage.css'; // Import the custom CSS file

const ScorePage = () => {
  const navigate = useNavigate();

  const handleReviewTest = () => {
    navigate('/review');
  };

  return (
    <div className="container text-center mt-5">
      <h1>Your Score</h1>
      <p>Your score details here...</p> {/* Replace with actual score details */}
      <button className="btn btn-primary mt-3" onClick={handleReviewTest}>
        Review Test
      </button>
    </div>
  );
};

export default ScorePage;
