const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleares/authMiddleware");
const adminMiddleware = require("../middleares/adminMiddleware");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Auth routes - accessible to all authenticated users
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/verify-admin", authMiddleware, userController.verifyAdmin);

// Admin routes - require admin privileges
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.put("/:id/role", authMiddleware, adminMiddleware, userController.updateUserRole);
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

// Set up multer for profile picture uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Set up multer with our configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route for updating profile with image upload
router.put("/profile", authMiddleware, upload.single('profilePicture'), userController.updateProfile);

module.exports = router;
