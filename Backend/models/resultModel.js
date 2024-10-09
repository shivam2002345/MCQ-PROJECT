const pool = require('../config/db'); // Assuming you are using PostgreSQL

// Create result
const createResult = async (exam_id, user_id, total_questions, correct_answers, score, selected_answers) => {
  const query = `INSERT INTO results (exam_id, user_id, total_questions, correct_answers, score, selected_answers)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [exam_id, user_id, total_questions, correct_answers, score, selected_answers];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get result by exam_id and user_id
const getResultByExamAndUser = async (exam_id, user_id) => {
  const query = `SELECT * FROM results WHERE exam_id = $1 AND user_id = $2`;
  const values = [exam_id, user_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getTestHistoryByUserId = async (userId) => {
  const query = `
      SELECT 
          u.name,
          u.email,
          r.result_id,  -- Assuming result_id is the primary key in the results table
          e.exam_id,
          t.tech_name AS technology,
          l.level_name AS level,
          r.score,
          r.total_questions,
          e.exam_date
      FROM 
          users u
      JOIN 
          results r ON u.user_id = r.user_id
      JOIN 
          exams e ON r.exam_id = e.exam_id
      JOIN 
          technologies t ON e.tech_id = t.tech_id
      JOIN 
          levels l ON e.level_id = l.level_id
      WHERE 
          u.user_id = $1;
  `;

  try {
      const result = await pool.query(query, [userId]);
      return result.rows;  // This will now include the result_id
  } catch (error) {
      console.error("Error fetching test history:", error);
      throw error;
  }
};



module.exports = { createResult, getResultByExamAndUser ,getTestHistoryByUserId};
