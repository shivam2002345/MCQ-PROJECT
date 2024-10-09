const pool = require('../config/db'); // Assuming you are using PostgreSQL

// Get result by result_id
const getResultById = async (result_id) => {
  const query = `SELECT * FROM results WHERE result_id = $1`;
  const values = [result_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { getResultById };
