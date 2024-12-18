const express = require('express');
const multer = require('multer');
const { uploadQuestions } = require('../controllers/questionsController'); // Adjust path as necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary directory for uploads

router.post('/uploadquestions', upload.single('file'), uploadQuestions);

module.exports = router;
