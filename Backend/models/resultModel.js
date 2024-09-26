const pool = require('../config/db');

// Insert result data into the database
const createResult = async (exam_id, user_id, total_questions, correct_answers, score, selected_answers) => {
  const result = await pool.query(
    `INSERT INTO results (exam_id, user_id, total_questions, correct_answers, score, selected_answers) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [exam_id, user_id, total_questions, correct_answers, score, selected_answers]
  );
  return result.rows[0];
};


// Fetch result by exam_id and user_id
const getResultByExamAndUser = async (exam_id, user_id) => {
    const result = await pool.query(
      `SELECT exam_id, user_id, total_questions, correct_answers, score, selected_answers 
       FROM results 
       WHERE exam_id = $1 AND user_id = $2`,
      [exam_id, user_id]
    );
    return result.rows[0];
  };

module.exports = { createResult , getResultByExamAndUser};
