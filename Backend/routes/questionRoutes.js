// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route to get question counts by technology
router.get('/count', questionController.getQuestionCounts);

module.exports = router;
