const csv = require('csv-parser');
const { Readable } = require('stream');
const pool = require('../config/db');

// Function to process the CSV file and return the data as an array of objects
const processCsvFile = (file) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Create a stream from the file buffer
    const stream = Readable.from(file.data);
    
    console.log('Raw CSV Data:', file.data.toString()); // Log raw data

    // Define the expected headers
    const headers = [
      'tech_id',
      'level_id',
      'question_text',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_option'
    ];

    stream.pipe(csv({ headers: headers, skipEmptyLines: true }))
      .on('data', (data) => {
        console.log('Parsed CSV Data:', data); // Log parsed data
        results.push(data);
      })
      .on('end', () => {
        console.log('All Parsed CSV Data:', results); // Log all parsed data
        resolve(results);
      })
      .on('error', (err) => {
        console.error('Error processing CSV:', err);
        reject(err);
      });
  });
};

// Controller function to handle CSV upload and bulk insert
const uploadCsv = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file uploaded.');
    }

    const csvFile = req.files.file;
    
    // Process the CSV file
    const questions = await processCsvFile(csvFile);

    // Check if any questions were parsed
    if (questions.length === 0) {
      return res.status(400).send('The uploaded CSV file contains no questions.');
    }

    // Prepare the insert query
    const queryText = `
      INSERT INTO questions (tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert each question from the CSV
      for (const question of questions) {
        // Convert tech_id and level_id to integers
        const techId = parseInt(question.tech_id, 10);
        const levelId = parseInt(question.level_id, 10);

        // Validate tech_id and level_id
        if (isNaN(techId) || isNaN(levelId)) {
          console.error('Invalid tech_id or level_id for question:', question.question_text);
          continue;  // Skip this question
        }

        // Validate all required fields
        if (!question.question_text || !question.option_a || !question.option_b || !question.option_c || !question.option_d || !question.correct_option) {
          console.error('Missing required field(s) for question:', question.question_text);
          continue;  // Skip this question
        }

        const values = [
          techId,
          levelId,
          question.question_text,
          question.option_a,
          question.option_b,
          question.option_c,
          question.option_d,
          question.correct_option,
        ];

        try {
          await client.query(queryText, values);
          // Log the inserted question
          console.log('Inserted Question:', values);
        } catch (insertError) {
          console.error('Error inserting question:', insertError);
        }
      }

      await client.query('COMMIT');
      res.status(200).send('Questions inserted successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting questions:', error);
      res.status(500).send('Error inserting questions.');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).send('Error processing CSV file.');
  }
};

module.exports = uploadCsv;
