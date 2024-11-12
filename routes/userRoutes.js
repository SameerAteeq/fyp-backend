// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../src/controllers/userController");
const authTokenRequired = require("../src/middleware/authTokenRequired");

// Register a new user (Donor or Recipient)
router.post("/register", userController.registerUser);

// Login a user
router.post("/login", userController.loginUser);

// Get users by role (Donor or Recipient)
router.get("/user/me", authTokenRequired, userController.me);

// Get users by role (Donor or Recipient)
router.get("/users/:role", authTokenRequired, userController.getUsersByRole);

// Update Current User
router.patch("/users", authTokenRequired, userController.updateUser);

module.exports = router;
