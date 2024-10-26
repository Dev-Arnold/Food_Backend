const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();
const cors = require('cors')
// const User = require('./models/User')
// const Restaurant = require("./models/Restaurant")
const multer = require('multer');
const generalcontroller = require("./controllers/generalcontroller")

const port = process.env.PORT || 3000

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/images'); // Absolute path to the images folder

        // Check if the directory exists; if not, create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory and any necessary parent folders
        }

        cb(null, uploadDir); // Set upload destination to the verified path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
    }
});


const upload = multer({ storage: storage });

// app.use(express.static(path.join(__dirname,"../client/dist")))
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use(express.json());//Middleware to parse json


app.use(cors({
    // origin: 'https://feedme-inky.vercel.app' // Allow only this origin
    origin: 'http://localhost:5173' // Allow only this origin
}));

//This is the logic to add to the database
app.post('/add', upload.single('image'), generalcontroller.foradding);

//This is the logic to fetch the api from the database and send it as JSON.
app.get('/api/restaurants', generalcontroller.for_restaurantapi)

//This is the logic to fetch the a limited number of restaurant from the database and send it as JSON.
app.get('/api/fewrestaurants', generalcontroller.for_fewrestaurants);

app.get('/api/allrestaurants',generalcontroller.for_allrestaurant)

app.post('/add-menu', upload.single('image'),generalcontroller.for_addmenu)

app.get('/api/food-types',generalcontroller.for_foodtypes);

app.get('/menu/:restaurantid',generalcontroller.for_Eachmenu)

app.post('/sign-up',upload.single('image'), generalcontroller.signup)

app.post('/sign-in',upload.single('image'), generalcontroller.signin)

app.delete('/admin/allrestaurants/:id', generalcontroller.deleteone)

app.put('/restaurants/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body; // The updated restaurant data
  
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updatedData, { new: true });
      
      if (!updatedRestaurant) return res.status(404).send('Restaurant not found');
  
      res.json(updatedRestaurant);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
app.get('/',(req,res)=>{
    res.send("<h1>Welcome!!!!</h1>")
})

// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,"../client/dist/index.html"))
// })
