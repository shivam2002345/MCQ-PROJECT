import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reactQuestions from './reactQuestions'; // Import dummy questions

const ReviewPage = () => {
  const { state } = useLocation();
  const { answers } = state || {};
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      {/* Home button */}
      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={handleHomeRedirect}>
          Home
        </button>
      </div>

      <h2 className="text-center mb-4">Review Your Exam</h2>

      {reactQuestions.map((question, index) => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        return (
          <div key={question.id} className="mb-4 p-3" style={{ border: '1px solid #ddd', borderRadius: '5px' }}>
            <p><strong>Question {index + 1}:</strong> {question.text}</p>

            {userAnswer ? (
              <>
                <p style={{ color: isCorrect ? 'green' : 'red' }}>
                  <strong>Your Answer:</strong> {userAnswer}
                </p>
                <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
              </>
            ) : (
              <p style={{ color: 'red' }}>
                <strong>Your Answer:</strong> Not Attempted
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewPage;
