const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const donateSchema = new mongoose.Schema({
  name: {
    type: String,
    // required:true
  },
  email: {
    type: String,
    // required:true
  },
  address: {
    type: String,
    // required:true
  },
  medicineName: {
    type: String,
    // required:true
  },
  medicineQty: {
    type: String,
    // required:true
  },
  medicineImg: {
    type: String,
    // required:true
  },
  medicineExp: {
    type: String,
    // required:true
  },
  status: {
    type: String,
  },
  donar_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

mongoose.model("Donate", donateSchema);
