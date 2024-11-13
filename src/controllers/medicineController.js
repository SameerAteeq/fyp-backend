const Medicine = require("../model/Medicine");
const path = require("path");
const fs = require("fs");
// Create a new medicine donation
const createMedicineDonation = async (req, res) => {
  try {
    const {
      name,
      type,
      manufacturer,
      batchNumber,
      dosage,
      expirationDate,
      price,
      quantityAvailable,
      description,
      donationStatus,
    } = req.body;

    // Ensure req.user exists (for donor information)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Validate the required fields
    if (
      !name ||
      !type ||
      !manufacturer ||
      !batchNumber ||
      !dosage ||
      !expirationDate ||
      !price ||
      !donationStatus
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    // Check if a medicine with the same batch number already exists
    const existingMedicine = await Medicine.findOne({ batchNumber });
    if (existingMedicine) {
      return res.status(400).json({
        message:
          "Batch number already exists. Please provide a unique batch number.",
      });
    }

    // Handle image uploads (main image and front image)
    let imagePath = "";
    let frontImagePath = "";

    if (req.files) {
      if (req.files.image) {
        imagePath = req.files.image[0].path; // Save the image path
      }
      if (req.files.frontImage) {
        frontImagePath = req.files.frontImage[0].path; // Save the front image path
      }
    }

    // Create new medicine donation entry
    const newMedicine = new Medicine({
      name,
      type,
      manufacturer,
      batchNumber,
      dosage,
      expirationDate,
      price,
      quantityAvailable: quantityAvailable || 1, // Default to 1 if not provided
      description,
      donor: req.user._id, // Set the current authenticated user as the donor
      donationStatus, // Set the default status to 'Pending'
      image: imagePath, // Set the main image path
      frontImage: frontImagePath, // Set the front image path
    });

    // Save the new medicine donation to the database
    await newMedicine.save();

    res.status(201).json({
      message: "Medicine donation created successfully!",
      data: newMedicine,
    });
  } catch (error) {
    console.log("🚀 ~ createMedicineDonation ~ error:", error);
    res.status(500).json({
      message: "Error creating medicine donation.",
      error: error.message,
    });
  }
};

// Get all medicine donations
const getAllMedicineDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    let query =
      req?.user?.role === "Donor"
        ? { donor: req?.user?._id }
        : req?.user?.role === "Recipient"
        ? { company: null }
        : {};

    const medicines = await Medicine.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Get total count of recipients
    const totalMedicine = await Medicine.countDocuments(query);

    res.status(200).json({
      page: pageNumber,
      totalPages: Math.ceil(totalMedicine / pageSize),
      totalMedicine,
      data: medicines,
    });
  } catch (error) {
    console.log("🚀 ~ getAllMedicineDonations ~ error:", error);
    res
      .status(500)
      .json({ message: "Error fetching medicine donations.", error });
  }
};

const getAllMedicineDonationsAuthNot = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const medicines = await Medicine.find({ company: null })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Get total count of recipients
    const totalMedicine = await Medicine.countDocuments({ company: null });

    res.status(200).json({
      page: pageNumber,
      totalPages: Math.ceil(totalMedicine / pageSize),
      totalMedicine,
      data: medicines,
    });
  } catch (error) {
    console.log("🚀 ~ getAllMedicineDonations ~ error:", error);
    res
      .status(500)
      .json({ message: "Error fetching medicine donations.", error });
  }
};

// Get a single medicine donation by ID
const getMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findById(medicineId).populate("donor");

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    res.status(200).json({ data: medicine });
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicine.", error });
  }
};

// Update donation status or medicine details
const updateMedicineDonation = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const updatedData = req.body;

    // Ensure req.user exists (for donor information)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Validate the required fields if they are being updated
    if (updatedData.batchNumber) {
      // Check if a medicine with the same batch number already exists, excluding the current medicine
      const existingMedicine = await Medicine.findOne({
        batchNumber: updatedData.batchNumber,
        _id: { $ne: medicineId },
      });

      if (existingMedicine) {
        return res.status(400).json({
          message:
            "Batch number already exists. Please provide a unique batch number.",
        });
      }
    }

    // Find the existing medicine
    const existingMedicine = await Medicine.findById(medicineId);
    if (!existingMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Handle image uploads (main image and front image)
    if (req.files) {
      // Handle main image replacement
      if (req.files.image) {
        // Delete the old image if it exists
        if (existingMedicine.image) {
          fs.unlink(path.resolve(existingMedicine.image), (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
              // Not throwing error to allow update to proceed
            }
          });
        }

        // Update the image path in the updatedData
        updatedData.image = req.files.image[0].path.replace(/\\/g, "/"); // Replace backslashes with forward slashes for cross-platform compatibility
      }

      // Handle front image replacement
      if (req.files.frontImage) {
        // Delete the old front image if it exists
        if (existingMedicine.frontImage) {
          fs.unlink(path.resolve(existingMedicine.frontImage), (err) => {
            if (err) {
              console.error("Failed to delete old front image:", err);
              // Not throwing error to allow update to proceed
            }
          });
        }

        // Update the front image path in the updatedData
        updatedData.frontImage = req.files.frontImage[0].path.replace(
          /\\/g,
          "/"
        ); // Replace backslashes with forward slashes for cross-platform compatibility
      }
    }

    // Update the donor to the current user (optional, based on your requirements)
    // updatedData.donor = req.user._id; // Uncomment if donor should be updated

    // Update the medicine donation entry
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      updatedData,
      { new: true, runValidators: true }
    ).populate("donor"); // Populate donor information if needed

    res.status(200).json({
      message: "Medicine donation updated successfully!",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("🚀 ~ updateMedicineDonation ~ error:", error);
    res.status(500).json({
      message: "Error updating medicine donation.",
      error: error.message,
    });
  }
};

// Delete a medicine donation
const deleteMedicineDonation = async (req, res) => {
  try {
    const medicineId = req.params.id;

    const deletedMedicine = await Medicine.findByIdAndDelete(medicineId);

    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    res
      .status(200)
      .json({ message: "Medicine donation deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting medicine donation.", error });
  }
};

module.exports = {
  createMedicineDonation,
  getAllMedicineDonations,
  getMedicineById,
  updateMedicineDonation,
  deleteMedicineDonation,
  getAllMedicineDonationsAuthNot,
};
