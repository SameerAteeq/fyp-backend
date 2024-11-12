const mongoose = require("mongoose");

// Define the Medicine Schema
const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // e.g., Tablet, Syrup, Injection, etc.
      required: true,
      enum: ["Tablet", "Syrup", "Injection", "Capsule", "Cream", "Drops"], // Limit to specific types
    },
    manufacturer: {
      type: String,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    dosage: {
      type: String, // e.g., '500mg', '10ml', etc.
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number, // Optional, can be used to show original price value
      required: true,
      min: 0,
    },
    quantityAvailable: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },

    // Donor Information
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Company Information
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to Company model
      default: null,
    },

    donationStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Distributed"],
      default: "Pending",
    },

    image: { type: String },
  },
  { timestamps: true }
);

// Create the Medicine model
const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
