import React, { useState } from 'react';
import axios from 'axios';
import './Csv.css'; // Assuming this file contains the styles

const CsvUploader = () => {
  // State to manage the selected CSV file
  const [csvFile, setCsvFile] = useState(null);
  // State to manage the success or error message
  const [message, setMessage] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    // Reset the message when a new file is selected
    setMessage('');
    const file = e.target.files[0]; // Get the selected file

    // Validate the file type
    if (file && file.type !== 'text/csv') {
      setMessage('Please upload a valid CSV file.');
      return;
    }

    setCsvFile(file); // Set the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if a file is selected
    if (!csvFile) {
      setMessage('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      // Post the file to the server
      const response = await axios.post('http://localhost:8080/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage('File uploaded and processed successfully!');
      } else {
        setMessage('File uploaded but encountered issues during processing.');
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      setMessage('Error processing file. Please check the logs or try again.');
    }
  };

  return (
    <div className="csv-uploader-page">
      <div className="csv-uploader-container">
        <h2 className="csv-title">Upload CSV File</h2>
        <form className="csv-form" onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="csv-input"
          />
          <button type="submit" className="csv-upload-button">
            Upload
          </button>
        </form>
        {message && (
          <p className={`csv-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CsvUploader;
