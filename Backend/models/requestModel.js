const pool = require('../config/db');

// Fetch user details based on user_id
const getUserById = async (user_id) => {
  const query = `SELECT name, email FROM users WHERE user_id = $1`;
  const result = await pool.query(query, [user_id]);
  return result.rows[0];
};

// Create a new request
const createRequest = async (user_id, note) => {
  const user = await getUserById(user_id);  // Fetch user details

  if (!user) {
    throw new Error('User not found');
  }

  const { name, email } = user;
  const query = `
    INSERT INTO request (username, email, note, request_status, created_at, user_id) 
    VALUES ($1, $2, $3, 0, NOW(), $4) 
    RETURNING *;
  `;

  const values = [name, email, note, user_id];  // Include user_id in the values array
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createRequest
};
