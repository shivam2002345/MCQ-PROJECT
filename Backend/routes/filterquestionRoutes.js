const express = require('express');
const { fetchQuestions, fetchTechnologies, fetchLevels, handleDeleteQuestion, handleUpdateQuestion } = require('../controllers/filterquestionController');

const router = express.Router();

// Route to get filtered questions
router.get('/questions', fetchQuestions);

// Route to get technologies
router.get('/technologies', fetchTechnologies);

// Route to get levels
router.get('/levels', fetchLevels);

// Route to delete a question
router.delete('/questions/delete/:id', handleDeleteQuestion);


// Route to update a question
router.put('/questions/edit/:id', handleUpdateQuestion);

module.exports = router;