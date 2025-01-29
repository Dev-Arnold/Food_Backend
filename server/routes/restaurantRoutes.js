const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { foradding, for_allrestaurant, getone, restaurantFilter, for_foodtypes, updateone, deleteone, for_fewrestaurants } = require('../controllers/restaurantController');
const authorize = require('../middlewares/authorize');

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
 *   name: Restaurants
 *   description: APIs for managing restaurants
 */

/**
 * @swagger
 * /api/restaurant/add:
 *   post:
 *     summary: Add a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the restaurant
 *                 example: John's Diner
 *               address:
 *                 type: string
 *                 description: Address of the restaurant
 *                 example: 123 Main Street
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Restaurant image
 *     responses:
 *       201:
 *         description: Restaurant added successfully
 *       400:
 *         description: Bad request (e.g., missing fields or invalid file format)
 *       403:
 *         description: Unauthorized - Admin/Staff only
 */
router.post('/add', authorize(["Admin", "Staff"]), upload.single('image'), foradding);

/**
 * @swagger
 * /api/restaurant/:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Restaurant ID
 *                   name:
 *                     type: string
 *                     description: Restaurant name
 *                   address:
 *                     type: string
 *                     description: Restaurant address
 */
router.get('/', for_allrestaurant);

/**
 * @swagger
 * /api/restaurant/filter:
 *   get:
 *     summary: Search for restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by restaurant name
 *     responses:
 *       200:
 *         description: List of matching restaurants
 */
router.get('/filter', restaurantFilter);

router.get('/few',for_fewrestaurants)

/**
 * @swagger
 * /api/restaurant/food-types:
 *   get:
 *     summary: Get all food types
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of food types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/food-types', for_foodtypes);

/**
 * @swagger
 * /api/restaurant/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Restaurant ID
 *                 name:
 *                   type: string
 *                   description: Restaurant name
 *                 address:
 *                   type: string
 *                   description: Restaurant address
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', getone);


/**
 * @swagger
 * /api/restaurant/{id}:
 *   put:
 *     summary: Update a restaurant's details
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated restaurant name
 *               address:
 *                 type: string
 *                 description: Updated restaurant address
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 *       403:
 *         description: Unauthorized - Admin/Staff only
 */
router.put('/:id', authorize(["Admin", "Staff"]), updateone);

/**
 * @swagger
 * /api/restaurant/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 *       403:
 *         description: Unauthorized - Admin only
 */
router.delete('/:id', authorize(["Admin"]), deleteone);

module.exports = router;
