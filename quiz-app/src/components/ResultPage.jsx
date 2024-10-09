import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ResultPage.css'; // Add CSS for styling the colors

const ResultPage = () => {
  const { exam_id, user_id } = useParams(); // Get exam_id and user_id from the URL
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the result data from the backend
    const fetchResult = async () => {
      try {
        const response = await fetch(`http://localhost:8080/results/${exam_id}/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch result data');
        }
        const data = await response.json();
        console.log('API Response:', data); // Log the response
        setResult(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [exam_id, user_id]);

  if (loading) {
    return <p>Loading result...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Log result to see its structure
  console.log('Result object:', result);

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      {/* Button to navigate to home */}
      <button className="btn btn-primary mb-3" onClick={() => navigate('/')}>
        Go to Home
      </button>

      <h2>Quiz Results</h2>
      <p>Total Questions: {result.total_questions}</p>
      <p>Correct Answers: {result.correct_answers}</p>
      <p>Incorrect Answers: {result.incorrect_answers}</p>
      <p>Score: {result.score}%</p>

      <div className="questions-list">
        {result.selected_answers.map((answer, index) => {
          // Determine if the selected option matches the correct answer
          const isCorrect = answer.selected_option === answer.correct_option;
          const isIncorrect = answer.option_text !== answer.selected_option && answer.selected_option === answer.correct_option;

          return (
            <div key={index} className={`question-item ${isCorrect ? 'correct' : isIncorrect ? 'incorrect' : ''}`}>
              <p>
                <strong>Question:</strong> {answer.question_text}
              </p>
              <p style={{ color: isCorrect ? 'green' : 'red' }}>
                <strong>Selected Answer:</strong> {answer.selected_option}
              </p>
              <p>
                <strong>Correct Answer:</strong> {answer.correct_option}
              </p>
            </div>
          );
        })}

        <h3>Questions not present here were not attempted by the user.</h3>
      </div>
    </div>
  );
};

export default ResultPage;
