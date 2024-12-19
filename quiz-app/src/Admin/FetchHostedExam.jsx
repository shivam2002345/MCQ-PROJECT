import React, { useState, useEffect } from 'react';
import './FetchhostedExam.css';
import logAction from '../utils/logAction'; // Import the logAction file

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [activeExamId, setActiveExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get admin_id from localStorage
  const adminId = localStorage.getItem('admin_id');

  // Fetch exam data using admin_id
  useEffect(() => {
    if (!adminId) {
      setError('Admin ID not found. Please log in.');
      setLoading(false);
      logAction('Error', { message: 'Admin ID not found.' });
      return;
    }

    fetch(`https://mcq-project-backend.onrender.com/api/admin/${adminId}/exams`)
      .then((response) => response.json())
      .then((data) => {
        setExams(data.exams);
        setLoading(false);
        logAction('Fetched Exams', { adminId, exams: data.exams.length });
      })
      .catch((error) => {
        console.error('Error fetching exams:', error);
        setError('Failed to load exams.');
        setLoading(false);
        logAction('Error Fetching Exams', { error: error.message });
      });
  }, [adminId]);

  const toggleQuestions = (examId) => {
    setActiveExamId(activeExamId === examId ? null : examId);
    logAction('Toggle Questions Visibility', { examId, visible: activeExamId !== examId });
  };

  if (loading) {
    return <div className="loading">Loading exams...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="exam-list-container">
      <div className="exam-table-wrapper">
        <h1>Exams</h1>
        <table className="exam-table">
          <thead>
            <tr>
              <th>Exam ID</th>
              <th>Technology</th>
              <th>Questions</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.exam_id}</td>
                <td>{exam.technology}</td>
                <td>{exam.num_questions}</td>
                <td>{exam.duration} mins</td>
                <td>
                  <button
                    className="toggle-questions-btn"
                    onClick={() => toggleQuestions(exam.exam_id)}
                  >
                    {activeExamId === exam.exam_id ? 'Hide Questions' : 'Show Questions'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Questions */}
      {exams.map(
        (exam) =>
          activeExamId === exam.exam_id && (
            <div key={exam.exam_id} className="questions-section">
              <h3>Questions for Exam ID: {exam.exam_id}</h3>
              <ul className="questions-list">
                {exam.questions.map((question, index) => (
                  <li key={question.question_id} className="question-item">
                    <p>
                      <strong>Question {index + 1}:</strong> {question.question_text}
                    </p>
                    <ul className="options-list">
                      <li><strong>A:</strong> {question.option_a}</li>
                      <li><strong>B:</strong> {question.option_b}</li>
                      <li><strong>C:</strong> {question.option_c}</li>
                      <li><strong>D:</strong> {question.option_d}</li>
                    </ul>
                    <p>
                      <strong>Correct Answer:</strong> {question.correct_answer || question.correct_option}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
};

export default ExamList;
