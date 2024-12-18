const {pool} = require('../config/database'); // Database connection setup

const insertQuestionsToDB = async (questions) => {
    const query = `
        INSERT INTO questions 
        (tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        for (const question of questions) {
            const values = [
                question.tech_id,
                question.level_id,
                question.question_text,
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d,
                question.correct_option,
                question. subtopic_id,
            ];
            await client.query(query, values);
        }

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { insertQuestionsToDB };
