const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // tel:{
    //     type:Number,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    role: { 
        type: String, 
        default: "User",
        enum:["Admin","Staff","User"],
    } 

},{timestamps:true})

const User = mongoose.model('User',userSchema);
module.exports = User;