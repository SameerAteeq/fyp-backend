const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
    }
)


mongoose.model("Contact",contactSchema);