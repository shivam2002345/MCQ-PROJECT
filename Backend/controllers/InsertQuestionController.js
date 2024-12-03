const csv = require('csv-parser');
const { Readable } = require('stream');
const pool = require('../config/db');
const pgFormat = require('pg-format'); // for bulk insert query formatting

// Process the CSV file and convert it into an array of objects
const processCsvFile = (file) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(file.data);

    stream
      .pipe(csv({ headers: true, skipEmptyLines: true }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// Main function for uploading and processing the CSV file
const uploadCsv = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }

    const csvFile = req.files.file;
    const questions = await processCsvFile(csvFile);

    const validQuestions = [];
    const invalidQuestions = [];

    questions.forEach((question) => {
      if (question.tech_id && question.subtopic_id) {
        validQuestions.push([
          question.tech_id,
          question.level_id,
          question.question_text,
          question.option_a,
          question.option_b,
          question.option_c,
          question.option_d,
          question.correct_option,
          question.subtopic_id,
        ]);
      } else {
        invalidQuestions.push(question);
      }
    });

    if (validQuestions.length === 0) {
      return res.status(400).send('No valid data to insert.');
    }

    const queryText = `
      INSERT INTO questions (
        tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id
      ) VALUES %L RETURNING id
    `;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Use pg-format to construct bulk insert query
      const pgFormat = require('pg-format');
      const bulkInsertQuery = pgFormat(queryText, validQuestions);

      await client.query(bulkInsertQuery);
      await client.query('COMMIT');

      res.status(200).json({
        message: 'Questions inserted successfully.',
        insertedCount: validQuestions.length,
        skippedCount: invalidQuestions.length,
        skippedData: invalidQuestions,
      });
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
