const pool = require('../config/db'); // Your database connection config

const getAllTechnologies = async () => {
  const result = await pool.query('SELECT * FROM technologies');
  return result.rows;
};


const Technology = {
  getAllTechnologies: async () => {
      const res = await pool.query('SELECT * FROM technologies');
      return res.rows;
  },
};

module.exports = { getAllTechnologies ,Technology};