const express = require('express');
const examController = require('../controllers/examController');

const router = express.Router();

router.post('/create', examController.createExam);
router.get('/:exam_id', examController.getExamQuestions); // Fetch exam questions

module.exports = router;