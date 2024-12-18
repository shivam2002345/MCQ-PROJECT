const express = require('express');
const { fetchAllTechnologies, addTechnology, updateTechnology, deleteTechnology } = require('../controllers/technologyController');

const router = express.Router();

// Route to fetch all technologies
router.get('/', fetchAllTechnologies);
router.post('/add', addTechnology);
router.put('/edit/:tech_id', updateTechnology);
router.delete('/delete/:tech_id', deleteTechnology);

module.exports = router;
