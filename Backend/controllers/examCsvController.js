const express = require('express');
const fs = require('fs');
const path = require('path');
const {pool} = require('../config/database'); // Import the pool to query the database
const router = express.Router();

// Route to handle file download
router.get('/download/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    // Query the database for the file based on fileId
    const result = await pool.query(
      'SELECT * FROM exam_csv_files WHERE file_id = $1',
      [fileId]
    );

    if (result.rows.length === 0) {
      console.error(`File with ID ${fileId} not found in database.`);
      return res.status(404).send('File not found');
    }

    const file = result.rows[0];
    const filePath = path.join(__dirname, '..', file.file_path); 

    console.log(`Trying to download file at: ${filePath}`);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      res.download(filePath, file.file_name, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          return res.status(500).send(`Failed to download file: ${err.message}`);
        }
      });
    } else {
      console.error(`File does not exist at path: ${filePath}`);
      return res.status(404).send('File not found');
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send(`Server error: ${err.message}`);
  }
});

module.exports = router;
