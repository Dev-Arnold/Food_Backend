const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();
const cors = require('cors')
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {cloudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');
const generalcontroller = require("./controllers/generalcontroller");

const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI) 
    .then(()=> app.listen(port,()=> console.log("connected"))) 
    .catch(err=>console.log(err));
    
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

// app.use(express.static(path.join(__dirname,"../client/dist")))
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(express.json());//Middleware to parse json


app.use(cors({
    origin: ['https://feedme-inky.vercel.app','http://localhost:5173'], // Allow only this origin
    optionsSuccessStatus: 200
}));

//This is the logic to add to the database
app.post('/add', upload.single('restaurantImage'), generalcontroller.foradding);

//This is the logic to fetch the api from the database and send it as JSON.
app.get('/api/restaurants', generalcontroller.for_restaurantapi)

//This is the logic to fetch the a limited number of restaurant from the database and send it as JSON.
app.get('/api/fewrestaurants', generalcontroller.for_fewrestaurants);

app.get('/api/allrestaurants',generalcontroller.for_allrestaurant)

app.post('/add-menu', upload.single('restaurantImage'),generalcontroller.for_addmenu)

app.get('/api/food-types',generalcontroller.for_foodtypes);

app.get('/menu/:restaurantid',generalcontroller.for_Eachmenu)

app.post('/sign-up',upload.single('image'), generalcontroller.signup)

app.post('/sign-in',upload.single('image'), generalcontroller.signin)

app.delete('/admin/allrestaurants/:id', generalcontroller.deleteone)

app.get('/restaurant/:id', generalcontroller.getone)

app.put('/editrestaurant/:id', upload.single('image'), generalcontroller.updateone);
  
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"../client/dist/index.html"))
})
