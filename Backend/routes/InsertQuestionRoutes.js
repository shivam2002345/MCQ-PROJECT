const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const { uploadQuestions } = require('../controllers/InsertQuestionController');

const router = express.Router();

// Use express-fileupload middleware
router.use(fileUpload());

// Route to upload questions
router.post('/upload', async (req, res) => {
  const { file } = req.files; // Use file from req.files

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded. Please upload a CSV file.' });
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, file.name);

  // Ensure the file is a CSV
  if (file.mimetype !== 'text/csv' && !file.name.endsWith('.csv')) {
    return res.status(400).json({ error: 'Only CSV files are allowed.' });
  }

  // Move the file to the desired location
  file.mv(filePath, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error moving file.', details: err });
    }

    try {
      // Process the uploaded CSV file
      await uploadQuestions(filePath);

      // Clean up the temporary file after processing
      fs.unlinkSync(filePath);

      res.status(201).json({ message: 'File uploaded and processed successfully.' });
    } catch (error) {
      console.error('Error processing file:', error);

      // Clean up temporary file on error
      if (filePath) fs.unlinkSync(filePath);

      // Handle specific error types
      if (error.message.includes('CSV')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes('Database')) {
        return res.status(500).json({ error: error.message });
      }

      res.status(500).json({ error: 'Something went wrong.', details: error.message });
    }
  });
});

module.exports = router;
