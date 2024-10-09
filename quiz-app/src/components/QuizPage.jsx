import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart
import 'chart.js/auto'; // Important for Chart.js v3+

const QuizPage = () => {
  const { exam_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const navigate = useNavigate();

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/exams/${exam_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log('Raw API Data:', data);

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
            correct_answer: question.correct_option,
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
    const question = questions.find(q => q.id === questionId);
    const answer = {
      option_text: selectedOption,
      question_text: question.text,
      selected_option: selectedOption
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(ans => ans.question_text !== question.text);
      return [...updatedAnswers, answer];
    });
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
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach((question) => {
      if (answers.some(answer => answer.question_text === question.text && answer.selected_option === question.correct_answer)) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / totalQuestions) * 100;

    setScore(calculatedScore);
    setCorrectAnswersCount(correctAnswers);
    setShowResults(true);
  };

  const handleReviewExam = async () => {
    const resultData = {
      exam_id: Number(exam_id),
      user_id: user_id,
      total_questions: questions.length,
      correct_answers: correctAnswersCount,
      score: score.toFixed(2),
      selected_answers: answers.map(answer => {
        const question = questions.find(q => q.text === answer.question_text);
        return {
          option_text: answer.option_text,
          question_text: answer.question_text,
          selected_option: answer.selected_option,
          correct_option: question ? question.correct_answer : null,
        };
      }),
    };

    try {
      const response = await fetch('http://localhost:8080/results', {
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
        navigate(`/results/${exam_id}/${user_id}`, { state: { result: resultData } });
      } else {
        console.error('Error submitting results:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmitClick(); // Submit when timer reaches zero
      setIsTimerRunning(false); // Stop the timer
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning, timer]);

  // Disable right-click context menu and copy action
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleCopy = (event) => {
      event.preventDefault();
    };

    // Adding event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Data for the pie chart
  const data = {

    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correctAnswersCount, questions.length - correctAnswersCount],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  // Format the remaining time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2>Quiz on React.js</h2>
      <div style={{ color: 'red', position: 'absolute', top: '20px', left: '20px', fontSize: '24px' }}>
        Time Remaining: {formatTime(timer)}
      </div>
      {!showResults ? (
        <>
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
                  checked={answers.some(ans => ans.question_text === questions[currentQuestion].text && ans.selected_option === option)}
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
            <button className="btn btn-success" onClick={handleSubmitClick}>
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="results-container mt-4">
          <h3>Results</h3>
          <div className="pie-chart-container">
          <Pie data={data} />
          <p>
            <strong>Total Questions:</strong> {questions.length}
          </p>
          <p>
            <strong>Correct Answers:</strong> {correctAnswersCount}
          </p>
          <p>
            <strong>Score:</strong> {score.toFixed(2)}%
          </p>
          <button className="btn btn-primary" onClick={handleReviewExam}>
            Review Exam
          </button>
        </div>
        </div>
      )}
    </div>
     
  );
};

export default QuizPage;
