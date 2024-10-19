// models/Question.js
const pool = require('../config/db');

const Question = {
    getAllQuestions: async () => {
        const res = await pool.query('SELECT * FROM questions');
        return res.rows;
    },
};

module.exports = Question;
