const express = require("express");
const app = express();
const port = 4000;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

// Database Connection
require("./db");

// Model Imports
// require("./src/model/User");
// require("./src/model/Ask");
// require("./src/model/Donate");
// require("./src/model/Contact");
// require("./src/model/Medicine"); // Added Medicine model

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// In your main server file (e.g., app.js or server.js)

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Imports
// const authRoutes = require("./routes/authRoutes");
// const askRoutes = require("./routes/askRoutes");
// const donateRoutes = require("./routes/donateRoutes");
// const contactRoutes = require("./routes/contactRoutes");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes"); // Added Medicine routes

// Register Routes
// app.use(authRoutes);
// app.use(askRoutes);
// app.use(donateRoutes);
// app.use(contactRoutes);

app.use(userRoutes);
app.use(adminRoutes);
app.use(medicineRoutes); // Using the medicine routes

// Base route to test the server
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Handle other errors
    return res.status(500).json({ message: err.message });
  }
  next();
};
app.use(errorHandler);
