import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/Navbar";

const OldUserExam = () => {
  const navigate = useNavigate();
  const [examIdInput, setExamIdInput] = useState("");
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);

  const handleSubmitExamId = () => {
    if (!examIdInput.trim()) {
      alert("Please enter a valid Exam ID");
      return;
    }
    fetchExamData(examIdInput.trim());
  };

  const fetchExamData = async (examId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/customexams/exams/${examId}`);
      const data = await response.json();
      if (data.exam) {
        const mappedExam = mapExamData(data.exam);
        setExamData(mappedExam);
        setTimer(mappedExam.duration * 60); // Convert minutes to seconds
      } else {
        alert("Exam not found.");
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
      alert("Failed to fetch exam data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapExamData = (exam) => ({
    ...exam,
    questions: exam.questions
      .filter((q) => q.question_text?.trim() && Object.values(q).some((v) => v?.trim()))
      .map((q) => ({
        question_id: q.question_id,
        question_text: q.question_text || "No question text available",
        options: {
          A: q.option_a || "",
          B: q.option_b || "",
          C: q.option_c || "",
          D: q.option_d || "",
        },
        correct_option: q.correct_option, // Correct text
      })),
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && examData) {
      alert("Time's up! Submitting the exam.");
      handleSubmit();
    }
  }, [timer]);

  const handleOptionChange = (event) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: event.target.value,
    }));
  };

  const handleNext = () => setCurrentQuestionIndex((prev) => prev + 1);

  const handlePrevious = () => setCurrentQuestionIndex((prev) => prev - 1);

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
  

  if (loading) return <div>Loading exam data...</div>;

  if (!examData) {
    return (
      <>
      <UserNavbar/>
     
      <div>
        <h3>Enter Exam ID</h3>
        <input
          type="text"
          value={examIdInput}
          onChange={(e) => setExamIdInput(e.target.value)}
          placeholder="Enter Exam ID"
        />
        <button onClick={handleSubmitExamId}>Start Exam</button>
      </div>
      </>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];

  return (
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
                {key}: {value}
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
  );
};

export default OldUserExam;
