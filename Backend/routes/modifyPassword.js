const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/modifyPassword');

router.put('/users/:user_id/password', updatePassword);

module.exports = router;
