const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');


const signup = async (req,res,next)=>{
    // const email_ent = await User.findOne({email});

    try{
        const {username,email,tel,password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(404).json({ message: "All fields are required" });
        }
        
        let email_ent = await User.findOne({email});

        if(email_ent){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please login",
            });
        }

        const hashedpassword = await bcrypt.hash(password,10);

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
        console.error(`Failed to create user : ${err}`); 
        next(err)
    }
}

const signin = async (req,res,next)=>{
    try{
        const {email,password } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({emailMessage:"User not found"})
        }

        const checkpassword = await bcrypt.compare(password, user.password);

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
    }
    catch(err){
        console.log(`Error while trying to login : ${err}`)
        next(err)
    }
}

module.exports = {
    signup,
    signin
}