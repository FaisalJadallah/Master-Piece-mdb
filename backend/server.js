const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const usersRoutes = require("./routes/usersRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use("/users", usersRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/upload", uploadRoutes);
app.use("/store", storeRoutes);
app.use("/products", productRoutes);

// Debug route for unhandled routes
app.use((req, res, next) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  
  // Log all available routes for debugging
  console.log('Available routes:');
  console.log('- /users');
  console.log('- /tournaments');
  console.log('- /upload');
  console.log('- /store');
  console.log('- /products');
  
  res.status(404).json({ 
    message: 'Route not found', 
    requestedRoute: req.originalUrl,
    method: req.method,
    availableRoutes: ['/users', '/tournaments', '/upload', '/store', '/products']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

mongoose
  .connect("mongodb+srv://faisal:12341234@cluster0.kmdqfxk.mongodb.net/GamingHive?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
