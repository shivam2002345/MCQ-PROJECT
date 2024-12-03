import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse"; // Library for parsing CSV files
import "./HostExamForm.css";

const HostExamForm = () => {
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    technology: "",
    num_questions: "",
    duration: "",
    questions: [],
  });
  const [csvFile, setCsvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch technologies on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/technologies")
      .then((response) => setTechnologies(response.data))
      .catch((error) => console.error("Error fetching technologies:", error));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle technology selection
  const handleTechnologyChange = (e) => {
    setFormData({ ...formData, technology: e.target.value });
  };

  // Handle CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const transformedQuestions = results.data.map((row) => ({
            question_text: row.question_text,
            options: row.options ? row.options.split(",") : [],
            correct_option: row.correct_option,
          }));
          setFormData((prevData) => ({
            ...prevData,
            questions: transformedQuestions,
          }));
        },
      });
    }
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    const adminId = localStorage.getItem("admin_id");
    if (!adminId) {
      alert("Admin ID is missing. Please log in.");
      return;
    }

    if (!formData.name || !formData.email || !formData.technology || !formData.num_questions || !formData.duration) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (formData.num_questions > 25) {
      alert("Number of questions cannot exceed 25.");
      return;
    }

    const postData = {
      ...formData,
      num_questions: Number(formData.num_questions),
      duration: Number(formData.duration),
      admin_id: parseInt(adminId, 10),
    };

    setIsSubmitting(true);

    axios
      .post("http://localhost:8080/api/customexams/exams/newuser/create", postData)
      .then((response) => {
        alert("Exam hosted successfully!");
        console.log("Exam created successfully:", response.data);
        setFormData({
          name: "",
          email: "",
          technology: "",
          num_questions: "",
          duration: "",
          questions: [],
        });
        setCsvFile(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error hosting exam. Please try again.";
        alert(errorMessage);
        console.error("Error hosting exam:", error.response?.data || error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="exam-form-container">
      <h2 className="exam-heading" color="white">Host New Exam</h2>
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Technology:</label>
          <select
            name="technology"
            value={formData.technology}
            onChange={handleTechnologyChange}
            required
          >
            <option value="">Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_name}>
                {tech.tech_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Number of Questions (max 25):</label>
            <input
              type="number"
              name="num_questions"
              value={formData.num_questions}
              onChange={handleChange}
              required
              max={25}
            />
          </div>

          <div className="form-group col-md-6">
            <label>Duration (minutes):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Upload Questions (CSV):</label>
          <input type="file" accept=".csv" onChange={handleCsvUpload} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Hosting..." : "Host Exam"}
        </button>
      </form>

      {formData.questions.length > 0 && (
        <div>
          <h3>Questions Preview:</h3>
          <pre>{JSON.stringify(formData.questions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HostExamForm;
