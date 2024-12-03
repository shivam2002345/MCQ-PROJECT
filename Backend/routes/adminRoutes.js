const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');



// Define the admin login route
router.post('/login', adminController.adminLogin);

// Define the admin login route
router.post('/newadmin/login', adminController.newadminLogin);

// POST request to submit admin request
router.post('/request', adminController.submitAdminRequest);

// Get all pending requests
router.get('/new/requests', adminController.getPendingAdminRequests);

// Approve or reject a specific request
router.put('/request/:id', adminController.updateAdminRequestStatus);

// Get notifications for a user
router.get('/notifications/:user_id', adminController.getUserNotifications);

// Mark a notification as read
router.put('/notification/:id/read', adminController.markNotificationAsRead);

module.exports = router;