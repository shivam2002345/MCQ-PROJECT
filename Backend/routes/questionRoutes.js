// routes/questionsRoutes.js
const express = require('express');
const router = express.Router();
const { getQuestionCounts } = require('../controllers/questionController');

// Route to get question counts by technology
router.get('/questions/count', getQuestionCounts);

module.exports = router;
