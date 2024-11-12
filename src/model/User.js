// const mongoose = require('mongoose');
// const bcrypt =require('bcrypt');
// const userSchema = new mongoose.Schema({
//     fname:{
//         type:String,
//         required:true
//     },
//     lname:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     userRole:{
//         type:String,
//         required:true
//     }
//     // dob:{
//     //     type:String,
//     //     required:true
//     // },
//     // address:{
//     //     type:String,
//     //     required:true
//     // }
//     }
// )

// userSchema.pre('save',async function(next){
//     const user = this;
//     console.log(
//         'before saving before hashing',user.password
//     );
//     if (!user.isModified('password')){
//         return next();
//     }
//     user.password = await bcrypt.hash(this.password,8);
//     console.log(
//         'before saving after hashing',user.password
//     );
//     next();
// })

// mongoose.model("User",userSchema);

// src/model/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Donor", "Recipient"], // Only two possible roles
    default: "Recipient",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
