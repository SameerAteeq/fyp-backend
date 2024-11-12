const express = require("express");
const router = express.Router();

const {
  adminLogin,
  me,
  createAdmin,
  getDashboardData,
  getDonors,
  getRecipients,
  createCompany,
  addMedicineToCompany,
  getCompaniesWithMedicines,
  deleteCompany,
  updateCompany,
  updateMedicineInCompany,
  getSingleUser,
  getCompany,
} = require("../src/controllers/adminController");

const authenticateAdmin = require("../src/middleware/adminAuthorization");
const authTokenRequired = require("../src/middleware/authTokenRequired");
const upload = require("../src/middleware/upload");

// Route for admin login
router.post("/admin/login", adminLogin);
router.post("/admin/create", createAdmin);

// Get current admin
router.get("/admin/me", authTokenRequired, me);

// Route for getting paginated donors
router.get("/admin/donors", authTokenRequired, authenticateAdmin, getDonors);
router.get(
  "/admin/user/:role/:_id",
  authTokenRequired,
  authenticateAdmin,
  getSingleUser
);

// Route for getting paginated recipients
router.get(
  "/admin/recipients",
  authTokenRequired,
  authenticateAdmin,
  getRecipients
);

// Admin-only route for fetching dashboard data
router.get(
  "/admin/dashboard",
  authTokenRequired,
  authenticateAdmin,
  getDashboardData
);

// Admin-only routes for managing companies and medicines
router.post(
  "/admin/company",
  authTokenRequired,
  authenticateAdmin,
  createCompany
);

router.post(
  "/admin/company/:companyId/medicine",
  authTokenRequired,
  authenticateAdmin,
  upload.single("image"),
  addMedicineToCompany
);

router.get(
  "/admin/companies",
  authTokenRequired,
  authenticateAdmin,
  getCompaniesWithMedicines
);

router.get(
  "/admin/company/:id",
  authTokenRequired,
  authenticateAdmin,
  getCompany
);

router.put(
  "/admin/company/:companyId",
  authTokenRequired,
  authenticateAdmin,
  updateCompany
);

router.put(
  "/admin/company/:companyId/medicine/:medicineId",
  authTokenRequired,
  authenticateAdmin,
  upload.single("image"),
  updateMedicineInCompany
);

router.delete(
  "/admin/company/:companyId",
  authTokenRequired,
  authenticateAdmin,
  deleteCompany
);

module.exports = router;
