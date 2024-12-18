const {pool} = require('../config/database');

// Add a new request
const addRequest = async ({ admin_id, request_title, request_description = '' }) => {
    console.log('Inserting request with admin_id:', admin_id, 'request_title:', request_title);  // Add logs here

    try {
      const result = await pool.query(
        'INSERT INTO requests (admin_id, request_title, request_description, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [admin_id, request_title, request_description, 'Pending', new Date()]
      );
      return result.rows[0];
    } catch (err) {
      console.error(err);  // Log the error for better debugging
      throw new Error(`Error adding request: ${err.message}`);
    }
};

  

// Get all requests
const getAllRequests = async () => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    return result.rows;  // Return all requests
  } catch (err) {
    console.error(err);
    throw new Error(`Error fetching requests: ${err.message}`);
  }
};

// Get a request by ID
const getRequestById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    return result.rows[0];  // Return the requested request
  } catch (err) {
    console.error(err);
    throw new Error(`Error fetching request: ${err.message}`);
  }
};

// Update the status of a request
const updateRequestStatus = async (id, status) => {
  try {
    const result = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];  // Return the updated request
  } catch (err) {
    console.error(err);
    throw new Error(`Error updating request status: ${err.message}`);
  }
};

module.exports = { addRequest, getAllRequests, getRequestById, updateRequestStatus };
