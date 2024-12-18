const {pool} = require('../config/database');

module.exports = {
  // Save the result into the exam_results table
  saveResult: async (resultData) => {
    const query = `
      INSERT INTO exam_results 
      (user_id, hosted_exam_id, technology, question_text, selected_option, correct_option, total_questions, correct_answers, score, total_marks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      resultData.user_id,
      resultData.hosted_exam_id,
      resultData.technology,
      resultData.question_text,
      resultData.selected_option,
      resultData.correct_option,
      resultData.total_questions,
      resultData.correct_answers,
      resultData.score,
      resultData.total_marks,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return saved result
    } catch (error) {
      console.error('Error saving result:', error);
      throw new Error('Failed to save result.');
    }
  },

  // Update the exam status in hosted_exam table
  updateExamStatus: async (exam_id) => {
    const updateQuery = `
      UPDATE hosted_exam
      SET status = $1
      WHERE exam_id = $2
      RETURNING *;
    `;
    const updateValues = [true, exam_id];

    try {
      // Log the values to confirm they are correct
      console.log('Attempting to update status with exam_id:', exam_id);

      const updatedExam = await pool.query(updateQuery, updateValues);

      // If no rows are affected, it means the exam ID was not found
      if (updatedExam.rowCount === 0) {
        console.log('No rows updated, exam_id not found or already updated.');
        throw new Error('Exam not found or status already updated.');
      }

      console.log('Exam status updated successfully:', updatedExam.rows[0]);
      return updatedExam.rows[0]; // Return updated exam details
    } catch (error) {
      console.error('Error updating exam status:', error);
      throw new Error('Failed to update exam status.');
    }
  },

  // Fetch results by user ID
  getResultsByUserId: async (user_id) => {
    const query = `
      SELECT * 
      FROM exam_results 
      WHERE user_id = $1
    `;
    try {
      const results = await pool.query(query, [user_id]);
      return results.rows; // Return the exam results
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error; // Rethrow error to be handled by the controller
    }
  }
};
