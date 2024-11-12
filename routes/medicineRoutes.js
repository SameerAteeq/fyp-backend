const express = require("express");
const router = express.Router();
const medicineController = require("../src/controllers/medicineController");
const authTokenRequired = require("../src/middleware/authTokenRequired");
const upload = require("../src/middleware/upload");

// Create a new medicine donation
router.post(
  "/medicines",
  upload.single("image"),
  authTokenRequired,
  medicineController.createMedicineDonation
);

router.get(
  "/medicines/no-auth",
  medicineController.getAllMedicineDonationsAuthNot
);

// Get all medicine donations
router.get(
  "/medicines",
  authTokenRequired,
  medicineController.getAllMedicineDonations
);

// Get a specific medicine donation by ID
router.get(
  "/medicines/:id",
  authTokenRequired,
  medicineController.getMedicineById
);

// Update a medicine donation
router.put(
  "/medicines/:id",
  authTokenRequired,
  upload.single("image"),
  medicineController.updateMedicineDonation
);

// Delete a medicine donation
router.delete(
  "/medicines/:id",
  authTokenRequired,
  medicineController.deleteMedicineDonation
);

module.exports = router;
