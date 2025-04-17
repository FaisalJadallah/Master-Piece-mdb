const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log(`[AUTH] Request path: ${req.method} ${req.path}`);
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('[AUTH] No Authorization header present');
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  
  if (!authHeader.startsWith("Bearer ")) {
    console.log('[AUTH] Authorization header present but not in Bearer format');
    return res.status(401).json({ message: "Invalid token format, expected Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  console.log(`[AUTH] Token received: ${token.substring(0, 10)}...`);

  try {
    const decoded = jwt.verify(token, "jwt-secret-key");
    console.log(`[AUTH] Token verified successfully for user ID: ${decoded.userId}`);
    req.user = decoded; // يحتوي على userId
    next();
  } catch (err) {
    console.error('[AUTH] Token verification failed:', err.message);
    return res.status(401).json({ 
      message: "Invalid or expired token",
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
