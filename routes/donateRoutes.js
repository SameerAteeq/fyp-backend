const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donate = mongoose.model("Donate")
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt'); 
const db = require("../askDb")
const nodemailer = require('nodemailer');

const Ask = mongoose.model("Ask");
require('dotenv').config()








//sendEmail api
const sendEmail = function (email) {

  
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
      var subjects = "MedBridge - Medicine has been approved"
      //   var reportingType = email.reportingType


      const mailoptions = {
          from: emailFrom,
          bcc: toBcc,
          subject: subjects,
          html: `<html><body>Dear User,<br/><br/> your donated medicine has been approved  <br/><br/><p style="color:#2F5496">Regards,<br/>MedBridge<br/></body></html>`,
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





const sendEmail2 = function (email) {

  
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
  var subjects = "MedBridge - Medicine has been declined"
  //   var reportingType = email.reportingType


  const mailoptions = {
      from: emailFrom,
      bcc: toBcc,
      subject: subjects,
      html: `<html><body>Dear User,<br/><br/> your donated medicine has been declined  <br/><br/><p style="color:#2F5496">Regards,<br/> MedBridge <br/></body></html>`,
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





router.post('/donate',(req,res)=>{  
    // console.log(req.body);
    console.log('aaa');
    const {name ,email,medicineName , medicineQty , medicineImg , medicineExp,address }=req.body;
    console.log(name);
    if(!name ||!email||! medicineName ||! medicineQty ||! medicineImg ||! medicineExp ){
        return res.status(422).send({error:'please fill out all the fields '})
    }

    Donate.findOne({name:name})
        .then(
            async()=>{
            
                 const user = new Donate({
                    name,
                    email,
                    address,
                    medicineName,
                    medicineQty ,
                    medicineImg , 
                    medicineExp,
                    status:'pending'

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


router.get('/askDonator',async(req,res)=>{
    const database = await Donate.find();
    console.log(database)
    res.send({database})
})

// router.put('/approveStatus',async(req,res)=>{
//     const {medicineName} = req.body
//     const database = await Donate.findOne({name:medicineName});
//     const user = new Donate({
        
//         status:'approved'

//     })
//     console.log(database)
//     res.send({database})
// })

router.put('/approveStatus', async (req, res) => {
    try {
      const { medicineName ,email } = req.body;
      console.log('Medicine name in request:', medicineName);
      // Find the medicine by its name in the database
      const database = await Donate.findOne({ medicineName: medicineName });
      console.log('database name in request:', database);
      // If the medicine exists, update its status to 'approved'
      if (database) {
        database.status = 'approved';
        await database.save(); // Save the changes
  
        console.log('Medicine status updated:', database);


  // sendEmail()



  // sendEmail(email);

        res.send({ message: 'Medicine status updated', database });
      } else {
        res.status(404).send({ message: 'Medicine not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });


router.delete('/deleteMedicine', async (req, res) => {
  try {
    const { medicineName , email } = req.body;

    console.log('Medicine name to delete:', medicineName);

    // Find and remove the medicine by its name from the database
    const deletedMedicine = await Donate.findOneAndDelete({ medicineName: medicineName });

    if (deletedMedicine) {
      console.log('Medicine deleted:', deletedMedicine);
      // sendEmail2(email)
      res.send({ message: 'Medicine deleted', deletedMedicine });
    } else {
      console.log('Medicine not found');
      res.status(404).send({ message: 'Medicine not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;


module.exports = router ;