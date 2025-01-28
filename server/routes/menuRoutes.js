const express = require('express');
const { for_addmenu, for_Eachmenu } = require('../controllers/menuController');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'restaurant-images',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: APIs for managing menus
 */

/**
 * @swagger
 * /api/menu/add:
 *   post:
 *     summary: Add a new menu item
 *     tags: [Menus]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the menu item
 *                 example: Grilled Chicken
 *               price:
 *                 type: number
 *                 description: Price of the menu item
 *                 example: 15.99
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Menu item image
 *     responses:
 *       201:
 *         description: Menu item added successfully
 *       400:
 *         description: Bad request (e.g., missing fields or invalid file format)
 */
router.post('/add', upload.single('image'), for_addmenu);

/**
 * @swagger
 * /api/menu/{restaurantid}:
 *   post:
 *     summary: Get menu items for a specific restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantid
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: List of menu items for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Menu item ID
 *                   name:
 *                     type: string
 *                     description: Name of the menu item
 *                   price:
 *                     type: number
 *                     description: Price of the menu item
 *                   image:
 *                     type: string
 *                     description: Image URL of the menu item
 *       404:
 *         description: Restaurant not found or no menu items available
 */
router.post('/:restaurantid', for_Eachmenu);

module.exports = router;
