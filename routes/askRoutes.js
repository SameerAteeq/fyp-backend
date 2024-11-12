const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt'); 
const db = require("../askDb")

const nodemailer = require('nodemailer');
const Donate = mongoose.model("Donate")
const Ask =mongoose.model("Ask");
require('dotenv').config()








const sendEmail = function (email,address) {

  
    // const {host,port}=data.dataValues
    let mailTransporter = nodemailer.createTransport({
        // host: host,
        host: 'smtp.ionos.com',
        // port: port,
        port: 587,
        secure: false,
        maxMessages: 'infinity',
        pool: true,
        auth: {
            // user: username,
            user: 'ashar.usman@commtel.ae',
            // pass: password,
            pass: '1234567'
        }
    });
    //   var email = JSON.parse(req.body.emails)
    var emailFrom ="ashar.usman@commtel.ae"
    // var toBcc = ' '
    
    var toBcc = email
    //console.log("targetAnalysts",contributors)
    //console.log("toBcc",toBcc)
    var subjects = "MedBridge - Collect Your Medicine"
    //   var reportingType = email.reportingType


    const mailoptions = {
        from: emailFrom,
        bcc: toBcc,
        subject: subjects,
        html: `<html><body>Dear User,<br/><br/> Please Collect your Medicine from ${address} <br/><br/><p style="color:#2F5496">Regards,<br/>MedBridge<br/></body></html>`,
        // attachments: [{
        //     filename: 'mail_signature2.png',
        //     path: 'controller/assets/images/mail_signature2.png',
        //     cid: 'unique@kreata.ee' //same cid value as in the html img src
        // },],
    };
    // <img src="../assets/images/commtel_signature.png" />
    mailTransporter.sendMail(mailoptions)
    // , function (err, info) {
    //     if (err) {
    //         res.status(400).json({ message: "Email Could Not Sent", error: err })
    //         //console.log(err);
    //     } else {
    //         let response = {
    //             message: "Successful"
    //         }
    //         res.status(200).json(response);
    //     }
    // });


//   } catch (error) {
//       //console.log(error)
//       res.status(400).send("Could Not Sent");
//   }
}











// router.post('/ask',(req,res)=>{  
//     console.log(req.body);
//     const {name ,email,address,medicineName,medicineQty }=req.body;
//     if(!name ||! email||! address){
//         return res.status(422).send({error:'please fill out all the fields '})
//     }

//     Ask.findOne({name:name})
//         .then(
//             async()=>{
//                 // if (savedUser){
//                 //     return res.status(422).send({error:'invalid credentials'}) 
//                 //  }
//                  const user = new Ask({
//                     name,
//                     email,
//                     address                  
//                 })
                
//                 try{
//                     await user.save()
//                     res.send('done')
//                     // const database =  Ask.find();
//                     // console.log(database)
//                     // // db.connection.once("open",()=>console.log('connected to db'))
//                     // res.send(database)
//                     // const token = jwt.sign({_id:user._id},process.env.jwt_secret);
//                     // res.send({token});
//                 }
//                 catch(err){
//                     console.log('db err', err)
//                     return res.status(422).send({error:err.message});
//                 }

//             }
            
//             )
// Donate.findOne({medicineName:medicineName})
// .then(
//     async()=>{
//         // if (savedUser){
//         //     return res.status(422).send({error:'invalid credentials'}) 
//         //  }
//          const user = new Donate({
//        medicineName:medicineName,
//        medicineQty:medicineQty           
//         })
        
//         try{
//             await user.save()
//             res.send('done')
//             // const database =  Ask.find();
//             // console.log(database)
//             // // db.connection.once("open",()=>console.log('connected to db'))
//             // res.send(database)
//             // const token = jwt.sign({_id:user._id},process.env.jwt_secret);
//             // res.send({token});
//         }
//         catch(err){
//             console.log('db err', err)
//             return res.status(422).send({error:err.message});
//         }

//     }
    
//     )
// })


// router.post('/ask', async (req, res) => {
//     console.log(req.body);
//     const { name, email, address, medicineName, medicineQty } = req.body;
    
//     if (!name || !email || !address) {
//         return res.status(422).send({ error: 'Please fill out all the fields' });
//     }

//     try {
//         // Check if the Donate document with the provided medicineName exists
//         const existingDonate = await Donate.findOne({ medicineName });

//         if (existingDonate) {
//             // If the document exists, update its medicineQty
//             existingDonate.medicineQty = medicineQty;
//             await existingDonate.save();
//         } else {
//             // If the document doesn't exist, create a new Donate document
//             const newDonate = new Donate({
//                 medicineName,
//                 medicineQty
//             });
//             await newDonate.save();
//         }

//         // Create a new Ask document
//         const user = new Ask({
//             name,
//             email,
//             address
//         });

//         await user.save();

//         res.send('done');
//     } catch (err) {
//         console.log('db err', err);
//         return res.status(500).send({ error: err.message });
//     }
// });


// router.post('/ask', async (req, res) => {
//     console.log(req.body);
//     const { name, email, address, medicineName, medicineQty } = req.body;

//     if (!name || !email || !address || !medicineName || !medicineQty) {
//         return res.status(422).send({ error: 'Please fill out all the fields' });
//     }

//     try {
//         // Find the existing Donate document with the provided medicineName
//         const existingDonate = await Donate.findOne({ medicineName });

//         if (!existingDonate) {
//             return res.status(404).send({ error: 'Medicine not found' });
//         }

//         // Subtract the requested medicineQty from the existing value
//         existingDonate.medicineQty -= medicineQty;

//         // If the new medicineQty becomes negative, you might want to handle that scenario here

//         // Save the updated Donate document
//         await existingDonate.save();

//         // Create a new Ask document
//         const user = new Ask({
//             name,
//             email,
//             address
//         });

//         await user.save();

//         res.send('done');
//     } catch (err) {
//         console.log('db err', err);
//         return res.status(500).send({ error: err.message });
//     }
// });



router.post('/ask', async (req, res) => {
    console.log(req.body);
    const { name, email, address, medicineName, medicineQty } = req.body;

    if (!name || !email || !address || !medicineName || !medicineQty) {
        return res.status(422).send({ error: 'Please fill out all the fields' });
    }

    try {
        // Find the existing Donate document with the provided medicineName
        const existingDonate = await Donate.findOne({ medicineName });

        if (!existingDonate) {
            return res.status(404).send({ error: 'Medicine not found' });
        }

        // Subtract the requested medicineQty from the existing value
        existingDonate.medicineQty -= medicineQty;

        // If the new medicineQty becomes 0 or negative, delete the Donate document
        if (existingDonate.medicineQty <= 0) {
            await Donate.deleteOne({ medicineName });
        } else {
            // Save the updated Donate document
            await existingDonate.save();
        }

        // Create a new Ask document
        const user = new Ask({
            name,
            email,
            address
        });

        await user.save();
        console.log('exist>>>>>',existingDonate.address)
sendEmail(email,existingDonate.address)
        res.send('done');
    } catch (err) {
        console.log('db err', err);
        return res.status(500).send({ error: err.message });
    }
});




router.get('/askData',async(req,res)=>{
    const database = await Ask.find();
    console.log(database)
    res.send({database})
})

module.exports = router ;