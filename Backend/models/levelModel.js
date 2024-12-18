const {pool} = require('../config/database'); // Your database connection

// Fetch all levels
const getAllLevels = async () => {
    const result = await pool.query('SELECT * FROM levels');
    return result.rows;
};

module.exports = { getAllLevels };