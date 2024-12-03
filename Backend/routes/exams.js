const express = require('express');
const router = express.Router();
const examsController = require('../controllers/HostedExamController');

// Route to create a new exam
router.post('/create', examsController.createExam);

// Route to get an exam by ID
router.get('/exams/:exam_id', examsController.getExamById);


router.post('/check-answers', examsController.checkAnswers);

router.post("/exams/newuser/create", examsController.createExamForNewUser);

module.exports = router;
