const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleares/authMiddleware");

router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;
