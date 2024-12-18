const express = require('express');
const router = express.Router();
const examStatus = require('../controllers/examStatus');

// Route to update exam status
// The exam_id will be passed as a parameter
router.put('/update-status/:exam_id', examStatus.changeExamStatus);

module.exports = router;
