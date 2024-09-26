import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const QuizPage = () => {
  const { exam_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const user_id = 6; // Dummy user_id

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/exams/${exam_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedQuestions = data.map((question) => ({
            id: question.question_id,
            text: question.question_text,
            options: [
              question.option_a,
              question.option_b,
              question.option_c,
              question.option_d,
            ],
            correct_answer: question.correct_answer // Ensure correct_answer is included
          }));

          setQuestions(formattedQuestions);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Error fetching questions: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [exam_id]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitClick = () => {
    const total_questions = questions.length;
    let correct_answers = 0;

    // Calculate correct answers directly
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correct_answers++;
      }
    });

    // Calculate score
    const score = (correct_answers / total_questions) * 100;
    setScore(score);
    setShowModal(true); // Show the modal
  };

  const handleModalClose = async () => {
    setShowModal(false);
    
    const total_questions = questions.length;
    const correct_answers = questions.filter(question => answers[question.id] === question.correct_answer).length; // Calculate correct answers directly

    const resultData = {
      exam_id: Number(exam_id),
      user_id: user_id,
      total_questions: total_questions,
      correct_answers: correct_answers, // Use directly calculated correct answers
      score: score,
      selected_answers: answers,
    };

    try {
      const response = await fetch('http://localhost:8080/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      if (response.ok) {
        alert(result.message);
        navigate('/result');
      } else {
        console.error('Error submitting results:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2>Quiz on React.js</h2>
      <div className="question-container mb-3">
        <p>
          <strong>Question {currentQuestion + 1}:</strong>{' '}
          {questions[currentQuestion].text}
        </p>
        {questions[currentQuestion].options.map((option, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="radio"
              name={`q${questions[currentQuestion].id}`}
              id={`q${questions[currentQuestion].id}-${option}`}
              onChange={() =>
                handleAnswerChange(questions[currentQuestion].id, option)
              }
              checked={answers[questions[currentQuestion].id] === option}
            />
            <label
              className="form-check-label"
              htmlFor={`q${questions[currentQuestion].id}-${option}`}
            >
              {option}
            </label>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between">
        <div>
          {currentQuestion > 0 && (
            <button className="btn btn-secondary me-2" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {currentQuestion < questions.length - 1 && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
        {currentQuestion === questions.length - 1 && (
          <button className="btn btn-success" onClick={handleSubmitClick}>
            Submit
          </button>
        )}
      </div>

      {/* Modal for showing the score */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your score: {score.toFixed(2)} out of 100</p>
          <p>Would you like to review your answers?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalClose}>
            Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizPage;
