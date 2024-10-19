const express = require('express');
const { getUserDetails } = require('../controllers/infoController');
const router = express.Router();

// Route to get user details by user_id
router.get('/users/:user_id', getUserDetails);

module.exports = router;
