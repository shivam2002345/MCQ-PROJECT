const { pool } = require('../config/database');

// Fetch questions based on tech_id and level_id
const getQuestions = async (tech_id, level_id) => {
  let query = 'SELECT * FROM questions WHERE 1=1';
  const values = [];

  if (tech_id) {
    query += ` AND tech_id = $${values.length + 1}`;
    values.push(tech_id);
  }

  if (level_id) {
    query += ` AND level_id = $${values.length + 1}`;
    values.push(level_id);
  }

  const result = await pool.query(query, values);
  return result.rows;
};

// Fetch all technologies
const getTechnologies = async () => {
  const result = await pool.query('SELECT * FROM technologies');
  return result.rows;
};

// Fetch all levels
const getLevels = async () => {
  const result = await pool.query('SELECT * FROM levels');
  return result.rows;
};

// Delete a question by id
const deleteQuestion = async (id) => {
  const result = await pool.query('DELETE FROM questions WHERE question_id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Update a question by id
const updateQuestion = async (id, questionData) => {
    const fields = [];
    const values = [];
  
    // Build the fields and values array based on provided data
    if (questionData.question_text) {
      fields.push(`question_text = $${fields.length + 1}`);
      values.push(questionData.question_text);
    }
    if (questionData.option_a) {
      fields.push(`option_a = $${fields.length + 1}`);
      values.push(questionData.option_a);
    }
    if (questionData.option_b) {
      fields.push(`option_b = $${fields.length + 1}`);
      values.push(questionData.option_b);
    }
    if (questionData.option_c) {
      fields.push(`option_c = $${fields.length + 1}`);
      values.push(questionData.option_c);
    }
    if (questionData.option_d) {
      fields.push(`option_d = $${fields.length + 1}`);
      values.push(questionData.option_d);
    }
    if (questionData.correct_option) {
      fields.push(`correct_option = $${fields.length + 1}`);
      values.push(questionData.correct_option);
    }
  
    // If no fields are provided, return an error
    if (fields.length === 0) {
      throw new Error("No fields provided for update.");
    }
  
    // Add the question id for the WHERE clause
    values.push(id);
  
    // Query to update only provided fields
    const result = await pool.query(
      `UPDATE questions
       SET ${fields.join(', ')}
       WHERE question_id = $${values.length}
       RETURNING *`,
      values
    );
  
    return result.rows[0];
  };
  


module.exports = { getQuestions, getTechnologies, getLevels, deleteQuestion, updateQuestion };