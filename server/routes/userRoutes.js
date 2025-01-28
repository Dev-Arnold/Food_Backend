const express = require('express');
const { signup, signin, forgot_password, reset_password } = require('../controllers/authController');
const router = express.Router();

router.post('/',signup);

router.post('/login',signin);

router.post('/forgot-password', forgot_password);

router.post('/reset-password/:token', reset_password);

module.exports = router;