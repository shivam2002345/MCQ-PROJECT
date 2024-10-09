const pool = require('../config/db');  // Assuming you're using a PostgreSQL pool

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Create new user
const createUser = async (name, email, password) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id',
    [name, email, password]
  );
  return result.rows[0];
};

module.exports = { findUserByEmail, createUser };


// Get user details by user ID
const getUserDetails = async (userId) => {
  const query = 'SELECT name, email FROM users WHERE user_id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};


module.exports = { createUser, findUserByEmail ,getUserDetails};
