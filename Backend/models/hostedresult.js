const pool = require('../config/db');

module.exports = {
  saveResult: async (resultData) => {
    console.log('Received resultData:', resultData); // Debug log
  
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
    
    console.log('Values for query:', values); // Debug log
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  

  getResultsByUserId: async (user_id) => {
    try {
      const query = `
        SELECT * 
        FROM exam_results 
        WHERE user_id = $1
      `;
      const results = await pool.query(query, [user_id]);
      return results.rows;  // Return the rows (results)
    } catch (error) {
      console.error("Error fetching results from exam_results table:", error);
      throw error;  // Rethrow error to be caught in the controller
    }
  }


};

