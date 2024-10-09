const pool = require('../config/db'); // Your database pool configuration

const createExam = async (user_id, level_id, tech_id) => {
  try {
    const result = await pool.query(
      'INSERT INTO exams (user_id, level_id, tech_id) VALUES ($1, $2, $3) RETURNING exam_id',
      [user_id, level_id, tech_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Exam creation failed: No exam returned.');
    }

    return result.rows[0]; // Return the created exam ID
  } catch (error) {
    console.error('Error in examModel.createExam:', error); // Log the error for debugging
    throw new Error('Failed to create exam'); // Rethrow with context
  }
};

module.exports = { createExam };
