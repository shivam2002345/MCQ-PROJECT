import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterQuestions.css';
import logAction from '../utils/logAction'; // Import logAction

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

  useEffect(() => {
    fetchTechAndLevels();
  }, []);

  useEffect(() => {
    if (tech && level) {
      fetchQuestions();
    }
  }, [tech, level]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/questions/delete/${id}`);
      if (response.data.success) {
        setQuestions(questions.filter(q => q.question_id !== id));
        setCount(prevCount => prevCount - 1);
        setError('');

        // Log the delete action
        logAction('DELETE', `Deleted question with ID: ${id}`);
      }
    } catch (error) {
      console.error('Error deleting question:', error.response ? error.response.data : error.message);
      setError('Error deleting question. Please try again.');
    }
  };

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

  const closeEditModal = () => {
    setIsEditing(false);
    setCurrentQuestion(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/questions/edit/${currentQuestion.question_id}`, updatedData);

      if (response.data.success) {
        setQuestions(questions.map(q => (q.question_id === currentQuestion.question_id ? response.data.data : q)));
        setError('');
        closeEditModal();

        // Log the update action
        logAction('UPDATE', `Updated question with ID: ${currentQuestion.question_id}`);
      }
    } catch (error) {
      console.error('Error updating question:', error.response ? error.response.data : error.message);
      setError('Error updating question. Please try again.');
    }
  };

  return (
    <div className="filter-container">
      {/* Rest of your component code remains the same */}
    </div>
  );
};

export default FilterQuestions;
