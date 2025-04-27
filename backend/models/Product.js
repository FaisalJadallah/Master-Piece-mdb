const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['game', 'accessories', 'console', 'merchandise', 'other'],
    },
    subcategory: {
      type: String,
      required: function() {
        return this.category === 'accessories';
      },
      enum: ['headphones', 'keyboards', 'mouse', 'controllers', 'chairs', 'monitors', 'other'],
    },
    platform: {
      type: String,
      required: function() {
        return this.category === 'game' || this.category === 'console';
      },
      enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'steam', 'playstation', 'xbox', 'nintendo', 'epic-games', 'google-play', 'Other'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 