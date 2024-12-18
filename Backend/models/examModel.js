const {pool} = require('../config/database'); // Your database pool configuration

// Function to create an exam and return the exam ID
const createExam = async (user_id, level_id, tech_id, subtopic_id) => {
  try {
    // Insert the exam with user_id, level_id, tech_id, and subtopic_id
    const result = await pool.query(
      'INSERT INTO exams (user_id, level_id, tech_id, subtopic_id) VALUES ($1, $2, $3, $4) RETURNING exam_id',
      [user_id, level_id, tech_id, subtopic_id]
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
