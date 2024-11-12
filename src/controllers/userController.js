// src/controllers/userController.js

const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Me call
const me = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find users by role
    const users = await User.findById(_id);
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Register a new user (Donor or Recipient)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password || !phone || !address || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all the required Field!" });
    }
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password, phone, address, role });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(201)
      .json({ message: "User registered successfully", token, data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, data: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

// Get users by role (Donor or Recipient)
const getUsersByRole = async (req, res) => {
  try {
    const { role, _id = null } = req.params;

    // Find users by role
    const users = await User.find({ role, ...(_id && { _id }) });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update User Call
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate({ _id: req.userId });
    res.status(200).json({ message: "User updated successfully!", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error updating users", error });
  }
};

module.exports = {
  me,
  registerUser,
  loginUser,
  getUsersByRole,
  updateUser,
};
