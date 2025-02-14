const express = require('express');
const { signup, signin, forgot_password, reset_password } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's name
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: "StrongPass123!"
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Email already exists
 *       404:
 *         description: All fields are required
 */
router.post('/',signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: "StrongPass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials (email or password)
 */

router.post('/login',signin);

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email to receive the reset link
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending reset link
 */

router.post('/forgot-password', forgot_password);

/**
 * @swagger
 * /user/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The password reset token sent via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user
 *                 example: "NewStrongPass123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */

router.post('/reset-password/:token', reset_password);

module.exports = router;