const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to add a new chat message
router.post('/:request_id', chatController.addChatMessage);

// Route to get chat messages for a specific request
router.get('/:request_id', chatController.getChatMessages);

module.exports = router;
