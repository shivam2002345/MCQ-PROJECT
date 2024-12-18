const fs = require('fs');
const csvParser = require('csv-parser');
const insertQuestionsModel = require('../models/insertQuestionsModel');

const insertQuestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const questions = [];

        // Parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                questions.push(row);
            })
            .on('end', async () => {
                try {
                    await insertQuestionsModel.insertQuestionsToDB(questions);
                    fs.unlinkSync(filePath); // Delete the file after processing
                    res.status(200).json({ message: 'Questions inserted successfully' });
                } catch (error) {
                    res.status(500).json({ error: 'Error inserting questions into database', details: error.message });
                }
            });
    } catch (error) {
        res.status(500).json({ error: 'Error processing file', details: error.message });
    }
};

module.exports = { insertQuestions };
