const express = require('express');
const router = express.Router();
const hostedresult = require('../controllers/hostedresult');

// Route to save an exam result
router.post('/save', hostedresult.saveResult);

// Route to fetch results by user ID
// router.get('/user/:user_id', hostedresult.fetchResultsByUserId);
router.get('/user/:user_id', hostedresult.getResultsByUserId);
module.exports = router;
