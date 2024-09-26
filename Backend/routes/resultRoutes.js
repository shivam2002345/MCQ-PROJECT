const express = require('express');
const resultController = require('../controllers/resultController');

const router = express.Router();

// Route to create a result
router.post('/', resultController.createResult);

// Route to fetch a result by exam_id and user_id
router.get('/:exam_id/:user_id', resultController.getResult);

module.exports = router;
