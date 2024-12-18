import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import "./CreateCustomExam.css";
import './Csv.css'; // Assuming this file contains the styles

const CreateCustomExam = () => {
  const { user_id, exam_id } = useParams(); // Extract user_id and exam_id from the URL
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null); // File state for CSV upload
  const [message, setMessage] = useState(''); // Feedback message for CSV upload
  const [isUploading, setIsUploading] = useState(false); // Loading state for CSV upload

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/technologies");
        setTechnologies(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch technologies");
      }
    };
    fetchTechnologies();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setMessage(''); // Clear any previous message
    } else {
      setMessage('Please upload a valid CSV file.');
    }
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setMessage('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    setIsUploading(true); // Start loading

    try {
      const response = await axios.post(
        'http://localhost:8080/api/questions/upload-questions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setMessage('File uploaded and processed successfully!');
        setQuestions(response.data.questions); // Assuming the backend sends questions
      } else {
        setMessage('File uploaded but encountered issues during processing.');
      }
    } catch (error) {
      console.error('Error uploading the file:', error.response?.data || error.message);
      setMessage(
        error.response?.data?.error || 'Error processing the file. Please check and try again.'
      );
    } finally {
      setIsUploading(false); // Stop loading
    }
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
      await axios.post("http://localhost:8080/api/customexams/create", payload);
      setSuccessMessage("Exam created successfully!");
      setErrorMessage("");
      setSelectedTechnology("");
      setNumQuestions("");
      setDuration("");
      setQuestions([]);
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
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-3">
          Create Exam
        </button>
      </form>

      <div className="csv-uploader-container mt-4">
        <h2 className="csv-title">Upload CSV File</h2>
        <form className="csv-form" onSubmit={handleCsvSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="csv-input"
          />
          <button
            type="submit"
            className="csv-upload-button"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {message && (
          <p
            className={`csv-message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateCustomExam;
