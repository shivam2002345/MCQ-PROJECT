const pool = require('../config/db'); // Your database connection

// Fetch all levels
const getAllLevels = async () => {
    const result = await pool.query('SELECT * FROM levels');
    return result.rows;
};

module.exports = { getAllLevels };