const express = require('express');
const testDetailsController = require('../controllers/testDetailsController');

const router = express.Router();

// Route to fetch a result by result_id
router.get('/:result_id', testDetailsController.getResultByResultId);

module.exports = router;
