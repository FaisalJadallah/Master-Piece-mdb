const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const platform = req.query.platform ? { platform: req.query.platform } : {};
  
  // Add support for subcategory filtering (for accessories)
  const subcategory = req.query.subcategory ? { subcategory: req.query.subcategory } : {};
  
  const count = await Product.countDocuments({ ...keyword, ...category, ...platform, ...subcategory });
  const products = await Product.find({ ...keyword, ...category, ...platform, ...subcategory })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    imageUrl,
    category,
    subcategory,
    platform,
    stock,
    featured,
    discount
  } = req.body;

  const product = new Product({
    title,
    description,
    price,
    imageUrl,
    category,
    subcategory,
    platform,
    stock,
    featured: featured || false,
    discount: discount || 0
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    imageUrl,
    category,
    subcategory,
    platform,
    stock,
    featured,
    discount
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.platform = platform || product.platform;
    product.stock = stock || product.stock;
    product.featured = featured !== undefined ? featured : product.featured;
    product.discount = discount !== undefined ? discount : product.discount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 