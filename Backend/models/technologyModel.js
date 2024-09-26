const pool = require('../config/db'); // Your database connection config

const getAllTechnologies = async () => {
  const result = await pool.query('SELECT * FROM technologies');
  return result.rows;
};

module.exports = { getAllTechnologies };