const express = require('express');
const requestController = require('../controllers/requestController');
const router = express.Router();

// POST: Submit a new request
router.post('/submit', requestController.createRequest);

module.exports = router;
