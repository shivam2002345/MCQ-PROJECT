import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import "./CreateCustomExam.css";
import  logAction  from '../utils/logAction'; // Import logAction function

const CreateCustomExam = () => {
  const { user_id, exam_id } = useParams(); // Extract user_id and exam_id from the URL
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axios.get("https://mcq-project-backend.onrender.com/api/technologies");
        setTechnologies(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch technologies");
      }
    };
    fetchTechnologies();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setErrorMessage("Please upload a valid CSV file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result.split("\n").map((row) => row.split(","));
      const parsedQuestions = csvData.slice(1).map((row, index) => ({
        question_id: index + 1,
        question_text: row[0],
        option_a: row[1],
        option_b: row[2],
        option_c: row[3],
        option_d: row[4],
        correct_option: row[5]?.trim().toUpperCase(),
      }));
      if (parsedQuestions.length === 0) {
        setErrorMessage("CSV file is empty or invalid.");
      } else {
        setQuestions(parsedQuestions);
        setErrorMessage("");
      }
    };
    if (file) reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numQuestions || !duration) {
      setErrorMessage("Please enter valid values for number of questions and duration.");
      return;
    }
    const admin_id = localStorage.getItem("admin_id");
    if (!admin_id) {
      setErrorMessage("Admin ID is missing in local storage.");
      return;
    }
    const payload = {
      user_id: user_id,
      exam_id: exam_id || null,
      technology: selectedTechnology,
      num_questions: parseInt(numQuestions, 10),
      duration: parseInt(duration, 10),
      questions,
      admin_id: admin_id,
    };
    try {
      await axios.post("https://mcq-project-backend.onrender.com/api/customexams/create", payload);
      setSuccessMessage("Exam created successfully!");
      setErrorMessage("");
      setSelectedTechnology("");
      setNumQuestions("");
      setDuration("");
      setQuestions([]);

      // Log the action
      logAction('create', 'custom exam', { user_id, exam_id, technology: selectedTechnology });
    } catch (error) {
      setErrorMessage("Failed to create exam");
    }
  };

  return (
    <div className="custom-exam-container">
      <h2 className="text-center mb-4">Create Customized Exam</h2>
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger text-center" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-group">
          <label>Technology</label>
          <select
            className="form-control"
            value={selectedTechnology}
            onChange={(e) => setSelectedTechnology(e.target.value)}
            required
          >
            <option value="">Select Technology</option>
            {technologies.map((tech, index) => (
              <option key={index} value={tech.tech_name}>
                {tech.tech_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Number of Questions</label>
            <input
              type="number"
              className="form-control"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label>Duration (in minutes)</label>
            <input
              type="number"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Upload Questions (CSV)</label>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={handleFileUpload}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-3">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateCustomExam;
