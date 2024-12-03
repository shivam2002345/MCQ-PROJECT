const pool = require('../config/db'); // PostgreSQL pool

// Get user details by user ID, including password
const getUserDetailsById = async (user_id) => {
  const query = `
    SELECT 
      user_id, 
      name, 
      email, 
      allowed_count, 
      user_count, 
      password 
    FROM users 
    WHERE user_id = $1
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows[0];
};

module.exports = { getUserDetailsById };

