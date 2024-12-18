const fs = require('fs');
const csvParser = require('csv-parser');
const { insertQuestions } = require('../models/InsertQuestionModel');



exports.uploadQuestions = async (filePath) => {
  const questions = [];

  return new Promise((resolve, reject) => {
    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const { tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id } = row;

        // Validate required fields
        if (!tech_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
          reject(new Error('Missing required fields in the CSV file.'));
        }

        questions.push({ tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id });
      })
      .on('end', async () => {
        try {
          await insertQuestions(questions); // Insert into database
          resolve();
        } catch (error) {
          reject(new Error('Database error: ' + error.message));
        }
      })
      .on('error', (error) => {
        reject(new Error('Invalid CSV format: ' + error.message));
      });
  });
};
