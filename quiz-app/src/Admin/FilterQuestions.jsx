import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterQuestions.css'; // Keep custom styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import logAction from '../utils/logAction'; // Import logAction for logging

const FilterQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [tech, setTech] = useState('');
  const [level, setLevel] = useState('');
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: ''
  });

  // Fetching technologies and levels
  const fetchTechAndLevels = async () => {
    try {
      const [techRes, levelRes] = await Promise.all([
        axios.get('http://localhost:8080/api/technologies'),
        axios.get('http://localhost:8080/api/levels'),
      ]);

      setTechnologies(techRes.data || []);
      setLevels(levelRes.data || []);
      logAction('Fetched technologies and levels');
    } catch (error) {
      console.error('Error fetching technologies and levels:', error);
      setError('Error fetching technologies and levels. Please try again.');
    }
  };

  // Fetching questions based on tech and level
  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/questions', {
        params: { tech_id: tech, level_id: level },
      });

      if (res.status === 200) {
        setQuestions(res.data.data || []);
        setCount(res.data.count || 0);
        setError('');
        logAction(`Fetched ${res.data.count} questions for tech: ${tech}, level: ${level}`);
      } else {
        setQuestions([]);
        setCount(0);
        setError('No questions found for the selected filters.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
      setCount(0);
      setError('Error fetching questions. Please try again.');
    }
  };

  // Fetch technologies and levels on initial load
  useEffect(() => {
    fetchTechAndLevels();
  }, []);

  // Fetch questions when tech or level changes
  useEffect(() => {
    if (tech && level) {
      fetchQuestions();
    }
  }, [tech, level]);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/questions/delete/${id}`);
      if (response.data.success) {
        setQuestions(questions.filter(q => q.question_id !== id));
        setCount(prevCount => prevCount - 1);
        setError('');
        logAction(`Deleted question with ID: ${id}`);
      }
    } catch (error) {
      console.error('Error deleting question:', error.response ? error.response.data : error.message);
      setError('Error deleting question. Please try again.');
    }
  };

  // Open the modal with current question data for editing
  const openEditModal = (question) => {
    setIsEditing(true);
    setCurrentQuestion(question);
    setUpdatedData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
    });
  };

  // Close the modal
  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentQuestion(null);
  };

  // Handle update operation
  const handleUpdate = async () => {
    try {
      if (currentQuestion && currentQuestion.question_id) {
        const response = await axios.put(
          `http://localhost:8080/api/questions/edit/${currentQuestion.question_id}`,
          {
            question_text: updatedData.question_text,
            option_a: updatedData.option_a,
            option_b: updatedData.option_b,
            option_c: updatedData.option_c,
            option_d: updatedData.option_d,
            correct_option: updatedData.correct_option,
          }
        );

        if (response.data.success) {
          setQuestions(questions.map(q => 
            q.question_id === currentQuestion.question_id ? { ...q, ...updatedData } : q
          ));
          setError('');
          closeEditModal();
          logAction(`Updated question with ID: ${currentQuestion.question_id}`);
        } else {
          setError('Failed to update the question.');
        }
      }
    } catch (error) {
      console.error('Error updating question:', error.response ? error.response.data : error.message);
      setError('Error updating question. Please try again.');
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-section mb-3">
        <label className="me-2">Technology:</label>
        <select className="form-select" value={tech} onChange={(e) => setTech(e.target.value)}>
          <option value="">Select Tech</option>
          {technologies.map((t) => (
            <option key={t.tech_id} value={t.tech_id}>
              {t.tech_name}
            </option>
          ))}
        </select>

        <label className="me-2">Level:</label>
        <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Select Level</option>
          {levels.map((l) => (
            <option key={l.level_id} value={l.level_id}>
              {l.level_name}
            </option>
          ))}
        </select>
      </div>

      <h2>Total Questions: {count}</h2>

      {error && <p className="text-danger fw-bold">{error}</p>}

      <ul className="list-group question-list">
        {questions.map((q) => (
          <li key={q.question_id} className="list-group-item">
            <p><strong>Question:</strong> {q.question_text}</p>
            <p><strong>a:</strong> {q.option_a}</p>
            <p><strong>b:</strong> {q.option_b}</p>
            <p><strong>c:</strong> {q.option_c}</p>
            <p><strong>d:</strong> {q.option_d}</p>
            <p><strong>Answer:</strong> {q.correct_option}</p>

            <button className="btn btn-warning me-2" onClick={() => openEditModal(q)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(q.question_id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Modal for editing a question */}
      {isEditing && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Question</h5>
                <button type="button" className="close" onClick={closeEditModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Question Text:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.question_text}
                    onChange={(e) => setUpdatedData({ ...updatedData, question_text: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Option A:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.option_a}
                    onChange={(e) => setUpdatedData({ ...updatedData, option_a: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Option B:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.option_b}
                    onChange={(e) => setUpdatedData({ ...updatedData, option_b: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Option C:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.option_c}
                    onChange={(e) => setUpdatedData({ ...updatedData, option_c: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Option D:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.option_d}
                    onChange={(e) => setUpdatedData({ ...updatedData, option_d: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correct Option:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={updatedData.correct_option}
                    onChange={(e) => setUpdatedData({ ...updatedData, correct_option: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterQuestions;
