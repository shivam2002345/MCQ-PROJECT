const {pool} = require('../config/database');  // Assuming you're using a PostgreSQL pool

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Create new user with user_count and allowed_count
const createUser = async (name, email, password, user_count = 0, allowed_count = 1) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, user_count, allowed_count) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
    [name, email, password, user_count, allowed_count]
  );
  return result.rows[0];
};

// Get user details by user ID
const getUserDetails = async (userId) => {
  const query = 'SELECT name, email FROM users WHERE user_id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};
//get all user
const getAllUsers = async () => {
  try {
      const result = await pool.query('SELECT name, email FROM users');
      return result.rows;
  } catch (err) {
      throw new Error('Error fetching users: ' + err.message);
  }
};


module.exports = { createUser, findUserByEmail,getAllUsers, getUserDetails };
