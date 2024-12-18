// models/questionModel.js
const {pool} = require('../config/database');

const Question = {
    getAllQuestions: async () => {
        const res = await pool.query('SELECT * FROM questions');
        return res.rows;
    },

    getQuestionCountByTechId: async (techId) => {
        const res = await pool.query(
            'SELECT COUNT(*) AS question_count FROM questions WHERE tech_id = $1',
            [techId]
        );
        return parseInt(res.rows[0].question_count, 10); // Convert count to an integer
    },
};

module.exports = Question;
