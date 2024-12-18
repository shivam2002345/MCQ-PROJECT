// Backend: routes.js
const express = require('express');
const router = express.Router();
const { logAction } = require('../controllers/logController');

// Route to log actions
router.post('/api/logs', logAction);

module.exports = router;
