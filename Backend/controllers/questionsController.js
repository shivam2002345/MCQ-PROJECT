const fs = require('fs');
const csv = require('csv-parser');
const Question = require('../models/questions'); // Adjust path as necessary

const uploadQuestions = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'CSV file is required.' });
    }

    const questions = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        questions.push({
          tech_id: row.tech_id,
          level_id: row.level_id || null,
          question_text: row.question_text,
          option_a: row.option_a,
          option_b: row.option_b,
          option_c: row.option_c,
          option_d: row.option_d,
          correct_option: row.correct_option,
          subtopic_id: row.subtopic_id || null,
        });
      })
      .on('end', async () => {
        try {
          await Question.bulkCreate(questions);
          res.status(201).json({ message: 'Questions uploaded successfully.' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error saving questions.' });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = {
  uploadQuestions,
};
