const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const {wn} = require('../config/function');

const ownerSchema = new mongoose.Schema({
    ownerID : String,
    ownerName : String
});

const userSchema = new mongoose.Schema({
    name : { type: String, required : [true, "Name is required"] },
    email : { type : String, required : [true, "Email is required"], unique: [true, "Email already exist."] },
    password : { type : String, required : [true, "Password is required"] },
    role : {type: String, required: [true, "Role is required"] },
    forget_password_code : {type: String},
    createdAt : { type : Date, default : Date.now },
    createdBy : ownerSchema
});

const User = new mongoose.model('users', userSchema);
const Owner = new mongoose.model('userOwner', ownerSchema);


module.exports.User = User;
module.exports.userOwner = Owner;