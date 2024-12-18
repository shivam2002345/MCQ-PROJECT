const chatModel = require('../models/chatModel');

const addChatMessage = async (req, res) => {
    const { request_id } = req.params;  // Get request_id from route parameters
    const { message, user_id } = req.body;  // Get message and user_id from request body

    // Validate input
    if (!message || !user_id) {
        return res.status(400).json({ error: 'Message and user_id are required' });
    }

    try {
        // Call the addMessage function to add the chat message
        const newMessage = await chatModel.addMessage(request_id, message, user_id);
        res.status(201).json(newMessage);  // Send the newly added message back to the client
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Failed to add chat message: ${err.message}` });
    }
};

// Controller to fetch chat messages by request ID
const getChatMessages = async (req, res) => {
  const { request_id } = req.params;

  try {
    const messages = await chatModel.getMessagesByRequestId(request_id);
    res.status(200).json(messages);  // Send back the list of messages
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
module.exports = { addChatMessage, getChatMessages };
