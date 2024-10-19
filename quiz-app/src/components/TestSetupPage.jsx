import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TestSetup.css';

const TestSetupPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    fetchTechnologies();
    fetchLevels();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/technologies');
      const data = await response.json();
      setTechnologies(data);
      if (data.length > 0) setSelectedTech(data[0].tech_id);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/levels');
      const data = await response.json();
      setLevels(data);
      if (data.length > 0) setSelectedLevel(data[0].level_id);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const handleStartExam = async (e) => {
    e.preventDefault();

    const examData = {
      user_id: user_id,
      tech_id: selectedTech,
      level_id: selectedLevel,
    };

    try {
      const response = await fetch('http://localhost:8080/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (response.ok) {
        const data = await response.json();
        const examId = data.exam_id; // Extract the exam_id

        // Navigate to the QuizPage and pass the exam_id
        navigate(`/quiz/${examId}`, { state: { exam_id: examId } });
      } else if (response.status === 403) {
        // User has reached their limit, set the error message
        const data = await response.json();
        setErrorMessage(data.message);  // Display the message from the backend
      } else {
        console.error('Failed to create exam');
        setErrorMessage('Failed to create exam. Please try again.');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const handleHomeRedirect = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-primary" onClick={handleHomeRedirect}>
          Home
        </button>
      </div>

      <h1>Set Up Your Test</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

      <form onSubmit={handleStartExam}>
        <div className="form-group">
          <label htmlFor="topic">Technology</label>
          <select
            id="topic"
            className="form-control"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            required
          >
            {technologies.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_id}>
                {tech.tech_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="level">Difficulty Level</label>
          <select
            id="level"
            className="form-control"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            required
          >
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_id}>
                {level.level_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Start Exam
        </button>
      </form>
    </div>
  );
};

export default TestSetupPage;
