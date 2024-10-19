const express = require('express');
const router = express.Router();
const AdminRequestController = require('../controllers/AdminRequestController'); // Adjust the path as needed

// Route to fetch all unhandled (pending) requests
router.get('/requests', AdminRequestController.getPendingRequests);

// Route to accept a request
router.post('/requests/accept/:id', AdminRequestController.acceptRequest);

// Route to reject a request
router.post('/requests/reject/:id', AdminRequestController.rejectRequest);

// Optional: Add a route to fetch unhandled requests if different logic is needed
router.get('/requests/unhandled', AdminRequestController.getPendingRequests);

module.exports = router;
