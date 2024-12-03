const express = require('express');
const { fetchAllTechnologies,addTechnology,updateTechnology ,deleteTechnology} = require('../controllers/technologyController');

const router = express.Router();

// Route to fetch all technologies
router.get('/', fetchAllTechnologies);
router.post('/technologies', addTechnology);
router.put('/technologies/:tech_id', updateTechnology);
router.delete('/technologies/:tech_id', deleteTechnology);
module.exports = router;