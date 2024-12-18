const { Pool } = require('pg');
const pool = new Pool(); // Ensure your PostgreSQL environment variables are set

exports.insertQuestions = async (questions) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Start a transaction
    const queryText = `
      INSERT INTO questions 
      (tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    
    // Loop through each question and insert
    for (const question of questions) {
      const { tech_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_option, subtopic_id } = question;
      await client.query(queryText, [
        tech_id,
        level_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        subtopic_id,
      ]);
    }
    
    await client.query('COMMIT'); // Commit the transaction if all inserts are successful
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    throw error; // Rethrow the error to be handled by the controller
  } finally {
    client.release(); // Release the client back to the pool
  }
};
