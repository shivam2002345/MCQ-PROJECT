import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterQuestions.css'; // Add some styling

const FilterQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [tech, setTech] = useState('');
  const [level, setLevel] = useState('');
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State for modal visibility
  const [currentQuestion, setCurrentQuestion] = useState(null); // State for the current question being edited
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
        setQuestions(questions.filter(q => q.question_id !== id)); // Update state to remove the deleted question
        setCount(prevCount => prevCount - 1); // Update the question count
        setError(''); // Clear any previous errors
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
      // Sending a PUT request to update the question
      const response = await axios.put(`http://localhost:8080/api/questions/edit/${currentQuestion.question_id}`, updatedData);
  
      if (response.data.success) {
        // Update the questions state with the updated question details
        setQuestions(questions.map(q => (q.question_id === currentQuestion.question_id ? response.data.data : q)));
        setError(''); // Clear any previous errors
        closeEditModal(); // Close the modal after successful update
      }
    } catch (error) {
      console.error('Error updating question:', error.response ? error.response.data : error.message);
      setError('Error updating question. Please try again.');
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <label>Technology:</label>
        <select value={tech} onChange={(e) => setTech(e.target.value)}>
          <option value="">Select Tech</option>
          {technologies.map((t) => (
            <option key={t.tech_id} value={t.tech_id}>
              {t.tech_name}
            </option>
          ))}
        </select>

        <label>Level:</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Select Level</option>
          {levels.map((l) => (
            <option key={l.level_id} value={l.level_id}>
              {l.level_name}
            </option>
          ))}
        </select>
      </div>

      <h2>Total Questions: {count}</h2>

      {error && <p className="error">{error}</p>}

      <ul className="question-list">
        {questions.map((q) => (
          <li key={q.question_id}>
            <span><p>Question. {q.question_text}</p></span>
            <span><p>a. {q.option_a}</p></span>
            <span><p>b. {q.option_b}</p></span>
            <span><p>c. {q.option_c}</p></span>
            <span><p>d. {q.option_d}</p></span>
            <span><p>Answer: {q.correct_option}</p></span>

            <button onClick={() => openEditModal(q)}>Edit</button>
            <button onClick={() => handleDelete(q.question_id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Modal for editing a question */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Question</h2>
            <label>Question Text:</label>
            <input
              type="text"
              value={updatedData.question_text}
              onChange={(e) => setUpdatedData({ ...updatedData, question_text: e.target.value })}
            />

            <label>Option A:</label>
            <input
              type="text"
              value={updatedData.option_a}
              onChange={(e) => setUpdatedData({ ...updatedData, option_a: e.target.value })}
            />

            <label>Option B:</label>
            <input
              type="text"
              value={updatedData.option_b}
              onChange={(e) => setUpdatedData({ ...updatedData, option_b: e.target.value })}
            />

            <label>Option C:</label>
            <input
              type="text"
              value={updatedData.option_c}
              onChange={(e) => setUpdatedData({ ...updatedData, option_c: e.target.value })}
            />

            <label>Option D:</label>
            <input
              type="text"
              value={updatedData.option_d}
              onChange={(e) => setUpdatedData({ ...updatedData, option_d: e.target.value })}
            />

            <label>Correct Option:</label>
            <input
              type="text"
              value={updatedData.correct_option}
              onChange={(e) => setUpdatedData({ ...updatedData, correct_option: e.target.value })}
            />

            <button onClick={handleUpdate}>Update</button>
            <button onClick={closeEditModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterQuestions;
