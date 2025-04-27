const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create products directory inside uploads
const productsDir = path.join(uploadDir, 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save product images to the products directory
    const isProduct = req.query.type === 'product';
    cb(null, isProduct ? productsDir : uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = req.query.type || 'image';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
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

// Route to handle file uploads
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct the URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
    const fileUrl = `/uploads${relativePath}`;
    const fullUrl = `${baseUrl}${fileUrl}`;
    
    console.log('File uploaded successfully:', {
      filename: req.file.filename,
      path: req.file.path,
      relativePath,
      fileUrl,
      fullUrl
    });
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      fullUrl: fullUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 