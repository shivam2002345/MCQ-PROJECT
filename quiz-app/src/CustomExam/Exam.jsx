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
      const response = await fetch(`http://localhost:8080/api/customexams/exams/${examId}`);
      const data = await response.json();
      if (data.exam) {
        setExamData(data.exam);
        setTimer(data.exam.duration * 60); // Convert duration to seconds
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

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption, // Save answer text
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
      const selectedOption = answers[index]; // User's selected option key (e.g., A, B, C, D)
      const selectedOptionText = q.options[selectedOption]; // Text of the selected option

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
      const correctAnswers = calculateScore();
      const resultData = {
        user_id: examData.user_id, // Directly use user_id from examData
        hosted_exam_id: examData.exam_id,
        technology: examData.technology,
        total_questions: examData.num_questions,
        correct_answers: correctAnswers,
        score: correctAnswers, // Assuming 1 mark per question
        total_marks: examData.num_questions, // Assuming total marks = total questions
        question_text: examData.questions.map((q) => q.question_text || "No question provided"),
        selected_option: examData.questions.map((_, index) => answers[index] || "Not answered"),
        correct_option: examData.questions.map((q) => q.correct_option || "Unknown"),
      };
  
      console.log("Submitting resultData:", resultData);
  
      const saveResponse = await fetch("http://localhost:8080/api/hostedresults/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });
  
      const saveData = await saveResponse.json();
      console.log("Save response:", saveData);
  
      alert("Exam submitted successfully!");
      navigate("/dashboard"); // Redirect to dashboard or another route
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
        <h2>{examData.name}</h2>
        <p>
          Time Remaining: {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </p>
        <h3>
          Question {currentQuestionIndex + 1}: {currentQuestion.question_text}
        </h3>
        <div className="options-container">
          {Object.entries(currentQuestion.options).map(
            ([key, value]) =>
              value && (
                <label key={key}>
                  <input
                    type="radio"
                    name="option"
                    value={key}
                    checked={answers[currentQuestionIndex] === key}
                    onChange={handleOptionChange}
                  />
                  {key.toUpperCase()}: {value}
                </label>
              )
          )}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          {currentQuestionIndex < examData.questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </>
  );
};

export default Exam;
