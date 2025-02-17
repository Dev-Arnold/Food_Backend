const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();
const cors = require('cors')
const cookieParser = require("cookie-parser");
const restaurantRoutes = require('./routes/restaurantRoutes')
const menuRoutes = require('./routes/menuRoutes')
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./middlewares/errorHandler')
const connect = require('./dbConfig/dbconfig')
const {swaggerDocs,swaggerUi} = require('./dbConfig/swagger')
const port = process.env.PORT || 3000

app.use(express.json());//Middleware to parse json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connect()


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors({
    origin: ['https://feedme-inky.vercel.app','http://localhost:5173'], // Allow only this origin
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use('/restaurants',restaurantRoutes)

app.use('/menu',menuRoutes)

app.use('/user',userRoutes)


app.use(errorHandler)
//This is the logic to fetch the api from the database and send it as JSON.
// app.get('/api/restaurants', generalcontroller.for_restaurantapi)

//This is the logic to fetch the a limited number of restaurant from the database and send it as JSON.
// app.get('/api/fewrestaurants', generalcontroller.for_fewrestaurants);

// app.get('/api/allrestaurants',generalcontroller.for_allrestaurant)

// app.post('/add-menu', upload.single('restaurantImage'),generalcontroller.for_addmenu)

// app.get('/api/food-types',generalcontroller.for_foodtypes);

// app.get('/menu/:restaurantid',generalcontroller.for_Eachmenu)

// app.post('/sign-up',upload.single('image'), generalcontroller.signup)

// app.post('/sign-in',upload.single('image'), generalcontroller.signin)

// app.delete('/admin/allrestaurants/:id', generalcontroller.deleteone)

// app.get('/restaurant/:id', generalcontroller.getone)

// app.put('/editrestaurant/:id', upload.single('image'), generalcontroller.updateone);
  
// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,"../client/dist/index.html"))
// })

app.listen(port,()=>{
    console.log(`Mongodb running on port ${port}`)
})