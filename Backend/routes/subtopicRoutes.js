// routes/subtopicRoutes.js
const express = require('express');
const router = express.Router();
const subtopicController = require('../controllers/subtopicController');

// Get all subtopics for a specific tech_id
router.get('/:tech_id', subtopicController.getSubtopicsByTechId);

// Create a new subtopic
router.post('/', subtopicController.createSubtopic);

// Update an existing subtopic by subtopic_id
router.put('/:subtopic_id', subtopicController.updateSubtopic);

// Delete a subtopic by subtopic_id
router.delete('/:subtopic_id', subtopicController.deleteSubtopic);

module.exports = router;
