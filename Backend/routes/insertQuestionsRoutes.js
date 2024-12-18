const express = require('express');
const multer = require('multer');
const { insertQuestions } = require('../controllers/insertQuestionsController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temp storage for uploaded files

router.post('/upload-questions', upload.single('file'), insertQuestions);

module.exports = router;
