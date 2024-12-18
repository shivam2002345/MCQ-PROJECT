const express = require('express');
const router = express.Router();
const { downloadFileById } = require('../controllers/examCsvController');

// Route to handle file download based on ID
router.get('/download/:id', downloadFileById);

module.exports = router;
