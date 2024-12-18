const express = require('express');
const router = express.Router();
const SuperAdminRequest = require('../controllers/SuperAdminRequest');

// Route to create a new request
router.post('/', SuperAdminRequest.createRequest);

// Route to get all requests
router.get('/', SuperAdminRequest.getAllRequests);

// Route to get a request by ID
router.get('/:id', SuperAdminRequest.getRequest);

// Route to update request status (e.g., mark as 'Resolved')
router.put('/:id/status', SuperAdminRequest.updateRequestStatus);

module.exports = router;
