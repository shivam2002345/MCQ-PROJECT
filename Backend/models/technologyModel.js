const {pool} = require('../config/database'); // Your database connection config

// Function to get all technologies
const getAllTechnologies = async () => {
  const result = await pool.query('SELECT * FROM technologies');
  return result.rows;
};

module.exports = { getAllTechnologies };
