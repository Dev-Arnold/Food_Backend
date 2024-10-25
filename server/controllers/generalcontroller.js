const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const foradding = async (req,res)=>{
    try {
        const { name, address, food_types, opening_time, closing_time, description, rating } = req.body;
        const image = req.file ? `/images/${req.file.filename}` : null;

        const newRestaurant = new Restaurant({
            name,
            address,
            food_types,
            opening_time,
            closing_time,
            description,
            rating,
            image

        });

        await newRestaurant.save(); 
        res.redirect('http://localhost:5173/admin/add');
    } catch (err) {
        console.error(err);
        // res.status(500).send('Server error');
    }
}

const for_restaurantapi = async (req,res)=>{
    const { foodtype, search } = req.query;
    // console.log(req.query)
    
    let query = {};
    
    if (foodtype) {
        const foodTypesArray = foodtype.split(',');
        query.food_types = { $in: foodTypesArray };
    }

    if (search) {
        query.$or = [ // This allows searching by name or description
          { name: { $regex: search, $options: 'i' } }, // 'i' makes it case-insensitive
          { food_types: { $regex: search, $options: 'i' } }
        ];
    }
    
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);

    // Restaurant.find()
    //     .then(response=>res.json(response))
    //     .catch(err=>console.log(err))

}

const for_allrestaurant = async(req,res)=>{
    await Restaurant.find()
        .then(response=>res.json(response))
        .catch(err=>console.log(err.message))
}

const for_fewrestaurants = async (req, res) => {
    try {
      // Limit the number of restaurants to 10
      const restaurants = await Restaurant.find().sort({ createdAt: -1 }).limit(6);
      res.json(restaurants);
    } catch (error) {
      res.status(500).send(error);
    }
}

const for_foodtypes =  async (req, res) => {
    try {
        const foodTypes = await Restaurant.distinct('food_types');// This is mongoDB distinct which allows you to get the unique values for a specific field across all documents in your collection.
        res.json(foodTypes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const for_Eachmenu = async (req,res)=>{
    try{
        const {restaurantid} = req.params;
        const menus = await Menu.find({restaurant: restaurantid})
            .populate('restaurant','address').populate('restaurant','description')
        res.json(menus)
        // console.log(req.params)
        // console.log('Menus found:', menus);
    }
    catch(err){
        console.log(err)
    }
}

const for_addmenu = async (req,res)=>{
    try{
        const {name,price,food_description,restaurant } = req.body;
        const image = req.file ? `/images/${req.file.filename}` : null;

        const newMenu = new Menu({
            name,
            price,
            food_description,
            restaurant ,
            image
        })

        await newMenu.save();
        // res.redirect('http://localhost:5173/admin/add')
    }catch(err){
        console.error(err);
    }

}
// const passwordToTest = 'nono';
// bcrypt.hash(passwordToTest, 10).then(hashedPassword => {
//   console.log("Hashed Password: ", hashedPassword);

//   bcrypt.compare(passwordToTest, hashedPassword).then(result => {
//     console.log("Password Match:", result); // Should print: true
//   });
// });


const signup = async (req,res)=>{
    // const email_ent = await User.findOne({email});

    try{
        const {username,email,tel,password } = req.body;
        console.log(username,email,password)
        
        let email_ent = await User.findOne({email});

        if(email_ent){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please login",
            });
        }

        const hashedpassword = await bcrypt.hash(password,10);
        console.log("Hashed Password: ", hashedpassword);

        const newUser = new User({
            username,
            email,
            // tel,
            password:hashedpassword,
            role:'user',
        })

        
        await newUser.save();
        res.status(201).json({ message: 'Signup successful!' });
    }
    catch(err){
        console.error(err); 
        res.status(500).json({ error: 'Failed to create user' });
    }

    
}

const signin = async (req,res)=>{
    try{
        const {email,password } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({emailMessage:"User not found"})
        }

        const checkpassword = await bcrypt.compare(password, user.password);
        // const checkpassword = await password === user.password

        if(!checkpassword){
            return res.status(400).json({passwordMessage:"Incorrect password"})
        }
        console.log("Password Match: ", checkpassword); 
 
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRETKEY,
            { expiresIn: "1h" }
          );

        const username = user ? user.username : ""
        
        res.json({ token, message: 'Login successful!',username });
        
        // const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });

    }
    
    catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteone = async (req,res)=>{
    try {
        let {id} = req.params;

        Restaurant.findByIdAndDelete(id)
            .then(response=>res.send(response))
            .catch(err=>console.log(err))
            
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    foradding,
    for_restaurantapi,
    for_allrestaurant,
    for_fewrestaurants,
    for_foodtypes,
    for_Eachmenu,
    for_addmenu,
    signup,
    signin,
    deleteone
}