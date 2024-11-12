const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt'); 
const db = require("../askDb")
const Contact =mongoose.model("Contact");
require('dotenv').config()



router.post('/contact',(req,res)=>{  
    console.log(req.body);
    const {name ,email ,message}=req.body;
    if(!name ||! email || !message){
        return res.status(422).send({error:'please fill out all the fields '})
    }

    Contact.findOne({name:name})
        .then(
            async()=>{
                // if (savedUser){
                //     return res.status(422).send({error:'invalid credentials'}) 
                //  }
                 const user = new Contact({
                    name,
                    email,
                    message            
                })
                
                try{
                    await user.save()
                    res.send('done')
                    // const database =  Ask.find();
                    // console.log(database)
                    // // db.connection.once("open",()=>console.log('connected to db'))
                    // res.send(database)
                    // const token = jwt.sign({_id:user._id},process.env.jwt_secret);
                    // res.send({token});
                }
                catch(err){
                    console.log('db err', err)
                    return res.status(422).send({error:err.message});
                }

            }
            
            )

})

router.get('/contactData',async(req,res)=>{
    const database = await Contact.find();
    console.log(database)
    res.send({database})
})

module.exports = router ;