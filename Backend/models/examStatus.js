const {pool} = require('../config/database');

module.exports = {
  // Function to update the status of an exam in the hosted_exam table
  updateExamStatus: async (exam_id) => {
    const query = `
      UPDATE hosted_exam
      SET status = $1
      WHERE exam_id = $2
      RETURNING *;  -- Return the updated row for confirmation
    `;
    const values = [true, exam_id];  // Set status to true
    
    try {
      const result = await pool.query(query, values);
      
      // If no rows were affected, it means the exam_id was not found
      if (result.rowCount === 0) {
        throw new Error('Exam not found or status already updated.');
      }

      return result.rows[0]; // Return the updated exam row
    } catch (error) {
      console.error('Error updating exam status:', error);
      throw new Error('Failed to update exam status.');
    }
  },
};
