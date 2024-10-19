const express = require('express');
const router = express.Router();
const { getNotificationsByUserId ,markNotificationAsRead} = require('../controllers/NotificationController');

// Route to retrieve notifications by user ID
router.get('/:userId', getNotificationsByUserId);
router.patch('/notifications/:id/read', markNotificationAsRead);

module.exports = router;
