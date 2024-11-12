const authenticateAndAuthorizeAdmin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

module.exports = authenticateAndAuthorizeAdmin;
