const express = require('express');
const { fetchAllTechnologies } = require('../controllers/technologyController');

const router = express.Router();

// Route to fetch all technologies
router.get('/', fetchAllTechnologies);

module.exports = router;