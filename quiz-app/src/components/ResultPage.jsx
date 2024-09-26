import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Important for Chart.js v3+

const ResultPage = () => {
  const { state } = useLocation();
  const { score, totalQuestions, correctAnswers, selectedAnswers } = state || {};
  const navigate = useNavigate();

  // Debugging outputs to check received values
  console.log('Score:', score);
  console.log('Total Questions:', totalQuestions);
  console.log('Correct Answers:', correctAnswers);
  console.log('Selected Answers:', selectedAnswers);

  // Handle cases where values might be undefined
  const validScore = typeof score === 'number' ? score : 0;
  const validTotalQuestions = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const validCorrectAnswers = typeof correctAnswers === 'number' ? correctAnswers : 0;

  // Assuming each question is worth 20 points
  const totalScore = validTotalQuestions * 20; // Calculate the total possible score
  const wrongAnswers = validTotalQuestions - validCorrectAnswers; // Calculate wrong answers

  // Data for the pie chart
  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [validCorrectAnswers, wrongAnswers], // Show correct vs wrong
        backgroundColor: ['#4caf50', '#f44336'], // Green for correct, red for wrong
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  const handleReviewExam = () => {
    navigate('/review', { state: { selectedAnswers } }); // Pass selected answers for review
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Your Test Results</h2>
      <div className="chart-container" style={{ maxWidth: '250px', margin: '0 auto' }}>
        <Pie data={data} />
      </div>
      <p className="mt-4">
        Your score is: <strong>{validScore} / {totalScore}</strong> {/* Display score out of total */}
      </p>
      <button className="btn btn-primary mt-4" onClick={handleReviewExam}>
        Review the Exam
      </button>
    </div>
  );
};

export default ResultPage;
