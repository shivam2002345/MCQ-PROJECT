const pool = require('../config/db'); // Your database pool configuration

const createExam = async (user_id, level_id, tech_id) => {
  const result = await pool.query(
    'INSERT INTO exams (user_id, level_id, tech_id) VALUES ($1, $2, $3) RETURNING exam_id',
    [user_id, level_id, tech_id]
  );
  return result.rows[0];
};

module.exports = { createExam };