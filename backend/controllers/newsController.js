const News = require('../models/News');

// Get latest news articles
exports.getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 3;
    const news = await News.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({ message: 'Failed to fetch latest news', error: error.message });
  }
};

// Get all news articles
exports.getAllNews = async (req, res) => {
  try {
    // By default, get only published articles for non-admin users
    const filter = req.user && req.user.role === 'admin' ? {} : { isPublished: true };
    
    // Sort by creation date (newest first)
    const news = await News.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news articles', error: error.message });
  }
};

// Get a specific news article by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id);
    
    if (!newsArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    // Check if article is published or user is admin
    if (!newsArticle.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'This article is not published yet' });
    }
    
    res.status(200).json(newsArticle);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Failed to fetch news article', error: error.message });
  }
};

// Create a new news article (admin only)
exports.createNews = async (req, res) => {
  try {
    const { title, content, summary, imageUrl, author, tags, isPublished } = req.body;
    
    // Process tags if they exist
    const processedTags = tags || [];
    
    const newsArticle = new News({
      title,
      content,
      summary,
      imageUrl,
      author,
      tags: processedTags,
      isPublished: isPublished !== undefined ? isPublished : true
    });
    
    const savedNews = await newsArticle.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ message: 'Failed to create news article', error: error.message });
  }
};

// Update an existing news article (admin only)
exports.updateNews = async (req, res) => {
  try {
    const { title, content, summary, imageUrl, author, tags, isPublished } = req.body;
    
    const newsArticle = await News.findById(req.params.id);
    
    if (!newsArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    // Update fields
    if (title !== undefined) newsArticle.title = title;
    if (content !== undefined) newsArticle.content = content;
    if (summary !== undefined) newsArticle.summary = summary;
    if (imageUrl !== undefined) newsArticle.imageUrl = imageUrl;
    if (author !== undefined) newsArticle.author = author;
    if (tags !== undefined) newsArticle.tags = tags;
    if (isPublished !== undefined) newsArticle.isPublished = isPublished;
    
    const updatedNews = await newsArticle.save();
    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ message: 'Failed to update news article', error: error.message });
  }
};

// Delete a news article (admin only)
exports.deleteNews = async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id);
    
    if (!newsArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ message: 'Failed to delete news article', error: error.message });
  }
}; 