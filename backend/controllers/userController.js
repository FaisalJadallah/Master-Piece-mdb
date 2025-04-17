const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, "jwt-secret-key", { expiresIn: "1d" });
  console.log(`[TOKEN] Generated new token for user ${userId}, first few chars: ${token.substring(0, 10)}...`);
  return token;
};

// تسجيل مستخدم
exports.userRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(`[REGISTER] Attempting to register user with email: ${email}`);
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`[REGISTER] Registration failed - email already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password, role });
    console.log(`[REGISTER] User registered successfully: ${user._id} (${username})`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('[REGISTER] Error during registration:', err);
    res.status(500).json({ message: err.message });
  }
};

// تسجيل الدخول
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN] Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[LOGIN] Login failed - user not found: ${email}`);
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[LOGIN] Login failed - invalid password for user: ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    console.log(`[LOGIN] User logged in successfully: ${user._id} (${user.username}), role: ${user.role}`);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[LOGIN] Error during login:', err);
    res.status(500).json({ message: err.message });
  }
};

// عرض بيانات المستخدم (محمي)
exports.getProfile = async (req, res) => {
  try {
    console.log(`[PROFILE] Fetching profile for user ID: ${req.user.userId}`);
    
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      console.log(`[PROFILE] User not found: ${req.user.userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`[PROFILE] Profile retrieved successfully for: ${user.username}`);
    res.status(200).json(user);
  } catch (err) {
    console.error('[PROFILE] Error retrieving profile:', err);
    res.status(500).json({ message: err.message });
  }
};

// التحقق من صلاحيات المسؤول
exports.verifyAdmin = async (req, res) => {
  try {
    console.log(`[VERIFY_ADMIN] Verifying admin status for user ID: ${req.user.userId}`);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log(`[VERIFY_ADMIN] User not found: ${req.user.userId}`);
      return res.status(404).json({ message: "User not found", isAdmin: false });
    }
    
    const isAdmin = user.role === "admin";
    console.log(`[VERIFY_ADMIN] User ${user.username} admin status: ${isAdmin}`);
    
    res.status(200).json({ isAdmin });
  } catch (err) {
    console.error('[VERIFY_ADMIN] Error verifying admin status:', err);
    res.status(500).json({ message: err.message, isAdmin: false });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    console.log(`[GET_USERS] Admin ${req.user.userId} requesting all users`);
    
    const users = await User.find().select('-password');
    
    console.log(`[GET_USERS] Retrieved ${users.length} users`);
    res.status(200).json(users);
  } catch (err) {
    console.error('[GET_USERS] Error retrieving users:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    console.log(`[UPDATE_ROLE] Admin ${req.user.userId} attempting to change role of user ${id} to ${role}`);
    
    if (!['user', 'admin'].includes(role)) {
      console.log(`[UPDATE_ROLE] Invalid role specified: ${role}`);
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      console.log(`[UPDATE_ROLE] User to update not found: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`[UPDATE_ROLE] User ${user.username} role updated to: ${role}`);
    res.status(200).json(user);
  } catch (err) {
    console.error('[UPDATE_ROLE] Error updating user role:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DELETE_USER] Admin ${req.user.userId} attempting to delete user ${id}`);
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      console.log(`[DELETE_USER] User to delete not found: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`[DELETE_USER] User ${user.username} deleted successfully`);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('[DELETE_USER] Error deleting user:', err);
    res.status(500).json({ message: err.message });
  }
};
