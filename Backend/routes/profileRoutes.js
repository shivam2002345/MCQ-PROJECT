const express = require('express');
const { getUserProfile } = require('../controllers/profileController');

const router = express.Router();

// Route to get user profile and test history
router.get('/:user_id/profile', getUserProfile);

module.exports = router;
