const jwt = require("jsonwebtoken");

const Admin = require("../model/Admin");
const User = require("../model/User");
const Medicine = require("../model/Medicine");
const Company = require("../model/Company");
const { default: mongoose } = require("mongoose");
// const Company = require("../model/Company");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if the password is correct
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful!",
      token, // Send the token to the client
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during admin login.",
      error: error.message,
    });
  }
};

// Me call
const me = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find users by role
    const users = await Admin.findById(_id);
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin", error });
  }
};

const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    if (admin.length) {
      return res.status(200).json({
        message: "Admin already exits",
      });
    }

    await Admin({
      email: "admin@gmail.com",
      password: 123456,
    }).save();

    res.status(200).json({
      message: "Admin create successful!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during admin login.",
      error: error.message,
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    // Check if req.user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Aggregation for counts and totals
    const [
      donorsCount,
      recipientsCount,
      totalDonatedMedicines,
      totalMedicineCompanies,
    ] = await Promise.all([
      User.countDocuments({ role: "Donor" }),
      User.countDocuments({ role: "Recipient" }),
      Medicine.countDocuments({ donor: { $ne: null } }),
      Company.countDocuments({}),
    ]);

    res.status(200).json({
      donorsCount,
      recipientsCount,
      totalDonatedMedicines,
      totalMedicineCompanies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard data.",
      error: error.message,
    });
  }
};

const getDonors = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Fetch paginated donors
    const donors = await User.find({ role: "Donor" })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Get total count of donors
    const totalDonors = await User.countDocuments({ role: "Donor" });

    res.status(200).json({
      page: pageNumber,
      totalPages: Math.ceil(totalDonors / pageSize),
      totalDonors,
      donors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching paginated donors.",
      error: error.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { role, _id = null } = req.params;

    // Construct match criteria
    const matchCriteria = { role };
    if (_id) {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid user ID format." });
      }
      matchCriteria._id = mongoose.Types.ObjectId(_id);
    }

    // Aggregation Pipeline
    const users = await User.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: "medicines", // Collection name in MongoDB (plural, lowercase by default)
          localField: "_id",
          foreignField: "donor",
          as: "medicines",
        },
      },
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0]; // Since we're fetching a single user

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

const getRecipients = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Fetch paginated recipients
    const recipients = await User.find({ role: "Recipient" })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Get total count of recipients
    const totalRecipients = await User.countDocuments({ role: "recipient" });

    res.status(200).json({
      page: pageNumber,
      totalPages: Math.ceil(totalRecipients / pageSize),
      totalRecipients,
      recipients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching paginated recipients.",
      error: error.message,
    });
  }
};

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { name, address, contactNumber } = req.body;
    if (!name || !address || !contactNumber) {
      return res.status(400).json({ message: "Please Fill All Fields!" });
    }

    const newCompany = new Company({ name, address, contactNumber });
    await newCompany.save();

    res
      .status(201)
      .json({ message: "Company created successfully!", data: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Error creating company.", error });
  }
};

// Add medicines to a company
// const addMedicineToCompany = async (req, res) => {
//   try {
//     const { companyId } = req.params;
//     const medicineData = req.body;

//     // Check if the company exists
//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: "Company not found." });
//     }

//     // Check if a medicine with the same batch number already exists in this company
//     const existingMedicine = await Medicine.findOne({
//       batchNumber: medicineData.batchNumber,
//       company: mongoose.Types.ObjectId(companyId),
//     });

//     if (existingMedicine) {
//       return res.status(400).json({
//         message:
//           "Batch number already exists for this company. Please provide a unique batch number.",
//       });
//     }

//     // Create new medicine and associate with company
//     const newMedicine = new Medicine({
//       ...medicineData,
//       company: companyId,
//     });
//     await newMedicine.save();

//     // Update company with the new medicine reference
//     await Company.findByIdAndUpdate(companyId, {
//       $push: { medicines: newMedicine._id },
//     });

//     res.status(201).json({
//       message: "Medicine added to company successfully!",
//       data: newMedicine,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error adding medicine to company.", error });
//   }
// };

// controllers/medicineController.js

const addMedicineToCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const medicineData = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "type",
      "manufacturer",
      "batchNumber",
      "dosage",
      "expirationDate",
      "price",
      "donationStatus",
    ];

    for (const field of requiredFields) {
      if (!medicineData[field]) {
        return res.status(400).json({ message: `Please provide ${field}.` });
      }
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Check if a medicine with the same batch number already exists in this company
    const existingMedicine = await Medicine.findOne({
      batchNumber: medicineData.batchNumber,
      company: mongoose.Types.ObjectId(companyId),
    });

    if (existingMedicine) {
      return res.status(400).json({
        message:
          "Batch number already exists for this company. Please provide a unique batch number.",
      });
    }

    // Handle image upload
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/"); // Replace backslashes with forward slashes for cross-platform compatibility
    }

    // Create new medicine and associate with company
    const newMedicine = new Medicine({
      ...medicineData,
      company: companyId,
      image: imagePath, // Set the image path
    });
    await newMedicine.save();

    // Update company with the new medicine reference
    await Company.findByIdAndUpdate(companyId, {
      $push: { medicines: newMedicine._id },
    });

    res.status(201).json({
      message: "Medicine added to company successfully!",
      data: newMedicine,
    });
  } catch (error) {
    console.error("🚀 ~ addMedicineToCompany ~ error:", error);
    res.status(500).json({
      message: "Error adding medicine to company.",
      error: error.message,
    });
  }
};

// Update the company
const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyData = req.body;

    // Find the company by ID and update it with the new data
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      companyData,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json({
      message: "Company updated successfully.",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating company.", error });
  }
};

// Update company medicine

const updateMedicineInCompany = async (req, res) => {
  try {
    const { companyId, medicineId } = req.params;
    const medicineData = req.body;

    // Validate required fields if they are being updated
    const requiredFields = [
      "name",
      "type",
      "manufacturer",
      "batchNumber",
      "dosage",
      "expirationDate",
      "price",
      "donationStatus",
    ];

    for (const field of requiredFields) {
      if (medicineData[field] === undefined || medicineData[field] === null) {
        return res.status(400).json({ message: `Please provide ${field}.` });
      }
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Check if a medicine with the same batch number already exists in this company
    if (medicineData.batchNumber) {
      const existingMedicine = await Medicine.findOne({
        batchNumber: medicineData.batchNumber,
        company: mongoose.Types.ObjectId(companyId),
        _id: { $ne: mongoose.Types.ObjectId(medicineId) }, // Exclude the current medicine
      });

      if (existingMedicine) {
        return res.status(400).json({
          message:
            "Batch number already exists for this company. Please provide a unique batch number.",
        });
      }
    }

    // Check if the medicine belongs to the company
    const medicine = await Medicine.findOne({
      _id: medicineId,
      company: companyId, // Ensure the medicine belongs to the company
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ message: "Medicine not found for this company." });
    }

    // Handle image upload
    if (req.file) {
      // Delete the old image if it exists
      if (medicine.image) {
        fs.unlink(path.resolve(medicine.image), (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
            // Not throwing error to allow update to proceed
          }
        });
      }

      // Update the image path in the medicineData
      medicineData.image = req.file.path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
    }

    // Update the medicine with new data
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      medicineData,
      { new: true, runValidators: true }
    )
      .populate("company")
      .populate("donor"); // Populate references if needed

    res.status(200).json({
      message: "Medicine updated successfully.",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("🚀 ~ updateMedicineInCompany ~ error:", error);
    res
      .status(500)
      .json({ message: "Error updating medicine.", error: error.message });
  }
};

// Get all companies and their medicines
const getCompaniesWithMedicines = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10
    // Use aggregation to fetch companies and their associated medicines
    const companiesWithMedicines = await Company.aggregate([
      {
        $lookup: {
          from: "medicines", // The collection to join with (MongoDB automatically lowercases collection names)
          localField: "_id", // The field from the 'Company' collection
          foreignField: "company", // The field from the 'Medicine' collection that references the company
          as: "medicines", // The name of the field that will contain the joined documents (medicines)
        },
      },
      {
        $skip: (page - 1) * limit, // Skip documents to match the page number
      },
      {
        $limit: parseInt(limit), // Limit the number of documents per page
      },
    ]);
    // Get the total number of companies for pagination metadata
    const totalCompanies = await Company.countDocuments();

    res.status(200).json({
      companies: companiesWithMedicines,
      totalPages: Math.ceil(totalCompanies / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies.", error });
  }
};

// Get all companies and their medicines
const getCompany = async (req, res) => {
  try {
    const { id } = req.params; // Default page is 1, limit is 10
    // Use aggregation to fetch companies and their associated medicines
    const companyWithMedicines = await Company.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "medicines", // The collection to join with (MongoDB automatically lowercases collection names)
          localField: "_id", // The field from the 'Company' collection
          foreignField: "company", // The field from the 'Medicine' collection that references the company
          as: "medicines", // The name of the field that will contain the joined documents (medicines)
        },
      },
    ]);

    res.status(200).json({
      company: companyWithMedicines[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies.", error });
  }
};

// Delete a company (and its medicines)
const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Delete the company's medicines first
    await Medicine.deleteMany({ company: companyId });

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    res
      .status(200)
      .json({ message: "Company and its medicines deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company.", error });
  }
};

module.exports = {
  adminLogin,
  me,
  createAdmin,
  getDashboardData,
  getDonors,
  getSingleUser,
  getRecipients,

  createCompany,
  addMedicineToCompany,
  updateCompany,
  getCompaniesWithMedicines,
  getCompany,
  updateMedicineInCompany,
  deleteCompany,
};
