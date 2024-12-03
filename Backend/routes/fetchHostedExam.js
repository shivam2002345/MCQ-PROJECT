// routes/examRoutes.js

const express = require('express');
const router = express.Router();
const { getExamsByAdmin } = require('../controllers/fetchHostedExam');

// Route to fetch exams for a specific admin
router.get('/admin/:adminId/exams', getExamsByAdmin);

module.exports = router;
