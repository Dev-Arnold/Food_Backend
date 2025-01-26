const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {cloudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');
const { foradding, for_allrestaurant, getone, restaurantFilter, for_foodtypes, updateone, deleteone } = require('../controllers/restaurantController');
const authorize = require('../middlewares/authorize')

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'restaurant-images',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

router.post('/add',authorize(["Admin", "Staff"]) , upload.single('restaurantImage'), foradding );

//get all restaurants
router.get('/',for_allrestaurant)

//get 1 restaurant
router.get('/:id',getone)

// logic for searching for a restaurant
router.get('/filter',restaurantFilter)

//get the food types
router.get('/food-types',for_foodtypes)

// edit a restaurant 
router.put('/:id',authorize(["Admin","Staff"]) ,updateone)

//delete a restaurant 
router.delete('/:id',authorize(["Admin"]),deleteone)


module.exports = router;