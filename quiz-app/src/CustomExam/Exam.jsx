import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Exam.css";
import UserNavbar from "../components/Navbar";

const Exam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await fetch(`https://mcq-project-backend.onrender.com/api/customexams/exams/${examId}`);
        const data = await response.json();
  
        // Check if the exam status is 'already taken'
        if (data.message && data.message === 'Sorry, you have already given this exam!') {
          alert(data.message);  // Show the message if the exam has already been taken
        } else if (data.exam) {
          setExamData(data.exam);
          setTimer(data.exam.duration * 60); // Convert duration to seconds
        } else {
          alert("Exam not found.");
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        alert("Failed to fetch exam data. Please try again.");
      }
    };
  
    fetchExamData();
  }, [examId]);
  

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionChange = (selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const calculateScore = () => {
    let correctAnswers = 0;

    examData.questions.forEach((q, index) => {
      const selectedOption = answers[index];
      const selectedOptionText = q.options[selectedOption];

      if (selectedOptionText && selectedOptionText.trim().toUpperCase() === q.correct_option.trim().toUpperCase()) {
        correctAnswers += 1;
      }
    });

    return correctAnswers;
  };

  const handleSubmit = async () => {
    if (!examData) {
      alert("Exam data is not loaded.");
      return;
    }
  
    try {
      // Calculate the score
      const correctAnswers = calculateScore();
      const resultData = {
        user_id: examData.user_id,
        hosted_exam_id: examData.exam_id,
        technology: examData.technology,
        total_questions: examData.num_questions,
        correct_answers: correctAnswers,
        score: correctAnswers,
        total_marks: examData.num_questions,
        question_text: examData.questions.map((q) => q.question_text || "No question provided"),
        selected_option: examData.questions.map((_, index) => answers[index] || "Not answered"),
        correct_option: examData.questions.map((q) => q.correct_option || "Unknown"),
      };
  
      // Save the exam results
      const saveResponse = await fetch("https://mcq-project-backend.onrender.com/api/hostedresults/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });
  
      const saveData = await saveResponse.json();
      console.log("Save response:", saveData);
  
      // Update the status of the exam (change to 'true' after submission)
      const updateStatusResponse = await fetch(`https://mcq-project-backend.onrender.com/api/update-status/${examData.exam_id}`, {
        method: "PUT", // Assuming POST method for updating status
      });
  
      const updateStatusData = await updateStatusResponse.json();
      console.log("Status update response:", updateStatusData);
  
      alert("Exam submitted successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Failed to submit the exam. Please try again.");
    }
  };
  
  if (!examData || !examData.questions || examData.questions.length === 0) {
    return <div>Loading exam data...</div>;
  }

  const currentQuestion = examData.questions[currentQuestionIndex];

  return (
    <>
      <UserNavbar />
      <div className="exam-container">
        <h2 className="exam-title">{examData.name}</h2>
        <p className="timer">
          Time Remaining: {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </p>
        <div className="question-container">
          <h3 className="question-text">
            Question {currentQuestionIndex + 1}: {currentQuestion.question_text}
          </h3>
          <div className="options-container">
            {Object.entries(currentQuestion.options).map(([key, value]) =>
              value ? (
                <button
                  key={key}
                  className={`option-button ${answers[currentQuestionIndex] === key ? "selected" : ""}`}
                  onClick={() => handleOptionChange(key)}
                >
                  {key.toUpperCase()}: {value}
                </button>
              ) : null
            )}
          </div>
        </div>
        <div className="navigation-buttons">
          <button
            className="nav-button nav-button-previous"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex < examData.questions.length - 1 ? (
            <button className="nav-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="nav-button nav-button-submit" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Exam;
