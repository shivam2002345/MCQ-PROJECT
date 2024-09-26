const express = require('express');
const { fetchAllLevels } = require('../controllers/levelController'); // Correct import path

const router = express.Router();

// Route to fetch all levels
router.get('/', fetchAllLevels);

module.exports = router;