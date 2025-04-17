const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleares/authMiddleware");
const adminMiddleware = require("../middleares/adminMiddleware");

// Auth routes - accessible to all authenticated users
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/verify-admin", authMiddleware, userController.verifyAdmin);

// Admin routes - require admin privileges
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.put("/:id/role", authMiddleware, adminMiddleware, userController.updateUserRole);
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
