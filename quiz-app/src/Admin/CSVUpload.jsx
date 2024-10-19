import React, { useState } from 'react';
import axios from 'axios';
import './Csv.css'; // Assuming you are using this for the styles

const CsvUploader = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setMessage('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axios.post('http://localhost:8080/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded and processed successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Error processing file.');
    }
  };

  return (
    <div className="csv-uploader-page">
      <div className="csv-uploader-container">
        <h2 className="csv-title">Upload CSV File</h2>
        <form className="csv-form" onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} className="csv-input" />
          <button type="submit" className="csv-upload-button">Upload</button>
        </form>
        {message && <p className="csv-message">{message}</p>}
      </div>
    </div>
  );
};

export default CsvUploader;
