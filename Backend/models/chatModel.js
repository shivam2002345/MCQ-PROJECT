const {pool} = require('../config/database');

// Add a new chat message
const addMessage = async (request_id, message, user_id) => {
    try {
        // Validate inputs
        if (!request_id || !message || !user_id) {
            throw new Error('Missing required fields: request_id, message, or user_id');
        }

        // Insert the chat message into the database
        const result = await pool.query(
            'INSERT INTO chat_messages (request_id, message, user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [request_id, message, user_id, new Date()]
        );

        // Return the inserted chat message
        return result.rows[0];
    } catch (err) {
        console.error('Error adding chat message:', err);  // Log the error for better debugging
        throw new Error('Error adding message to the chat');
    }
};

// Get all chat messages for a specific request
const getMessagesByRequestId = async (request_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE request_id = $1 ORDER BY created_at',
      [request_id]
    );
    return result.rows;  // Return the messages
  } catch (err) {
    throw new Error('Error fetching chat messages.');
  }
};

module.exports = { addMessage, getMessagesByRequestId };
