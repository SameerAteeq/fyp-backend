const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const askSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
    }
)

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

mongoose.model("Ask",askSchema);