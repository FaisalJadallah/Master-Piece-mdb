const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleares/authMiddleware');
const adminMiddleware = require('../middleares/adminMiddleware');

// Public routes
router.get('/latest/:limit', newsController.getLatestNews);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Admin routes - require admin privileges
router.post('/', authMiddleware, adminMiddleware, newsController.createNews);
router.put('/:id', authMiddleware, adminMiddleware, newsController.updateNews);
router.delete('/:id', authMiddleware, adminMiddleware, newsController.deleteNews);

module.exports = router; 