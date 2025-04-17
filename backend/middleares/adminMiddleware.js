const User = require("../models/users");

const adminMiddleware = async (req, res, next) => {
  console.log(`[ADMIN] Checking admin access for user ID: ${req.user?.userId}`);
  
  try {
    if (!req.user || !req.user.userId) {
      console.log('[ADMIN] No user ID in request (auth middleware should have caught this)');
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      console.log(`[ADMIN] User with ID ${req.user.userId} not found in database`);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`[ADMIN] User ${user.username} (${user.email}) has role: ${user.role}`);
    
    if (user.role !== "admin") {
      console.log(`[ADMIN] Access denied for non-admin user: ${user.username}`);
      return res.status(403).json({ message: "Access denied. Admin role required" });
    }
    
    console.log(`[ADMIN] Admin access granted for user: ${user.username}`);
    next();
  } catch (err) {
    console.error('[ADMIN] Error in admin middleware:', err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = adminMiddleware; 