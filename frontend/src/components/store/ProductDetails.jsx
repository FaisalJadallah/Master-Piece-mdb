import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaStar, FaBox, FaCheck, FaGamepad, FaHeadphones } from 'react-icons/fa';
import { Heart } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetails = () => {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const platformColors = {
    'playstation': 'from-blue-700 to-blue-900',
    'steam': 'from-gray-700 to-gray-900',
    'xbox': 'from-green-700 to-green-900'
  };

  const accessoryColors = {
    'headphones': 'from-purple-700 to-purple-900',
    'keyboards': 'from-blue-700 to-blue-900',
    'mouse': 'from-green-700 to-green-900',
    'controllers': 'from-red-700 to-red-900',
    'chairs': 'from-yellow-700 to-yellow-900',
    'monitors': 'from-indigo-700 to-indigo-900'
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/store/${productId}`);
        setProduct(response.data);
        
        if (response.data.category === 'accessories') {
          console.log('This is an accessory product');
        } else if (response.data.category === 'game') {
          console.log('This is a game product');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Check if product is in wishlist when it loads
  useEffect(() => {
    if (product) {
      setAddedToWishlist(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.imageUrl,
        quantity: quantity,
        category: product.category,
        platform: product.platform
      };
      
      addToCart(cartItem);
      setAddedToCart(true);
      
      // Reset the "Added to cart" indicator after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    const wishlistItem = {
      id: product._id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      category: product.category,
      platform: product.platform,
      subcategory: product.subcategory
    };
    
    if (addedToWishlist) {
      removeFromWishlist(product._id);
      setAddedToWishlist(false);
    } else {
      addToWishlist(wishlistItem);
      setAddedToWishlist(true);
      
      // Show feedback briefly
      setTimeout(() => {
        // Don't reset if user removes it during the timeout
        if (isInWishlist(product._id)) {
          // Keep it true
        }
      }, 2000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  // Function to navigate back based on product category
  const navigateBack = () => {
    if (product) {
      if (product.category === 'accessories' && categoryId) {
        navigate(`/store/accessories/${categoryId}`);
      } else if (product.category === 'game' && product.platform) {
        // Convert platform to lowercase and replace spaces with hyphens
        const platformSlug = product.platform.toLowerCase().replace(/\s+/g, '-');
        navigate(`/store/${platformSlug}`);
      } else {
        // Default fallback
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // Get the appropriate gradient based on product type
  const getGradientClass = () => {
    if (!product) return 'from-purple-900 to-black';
    
    if (product.category === 'game' && product.platform) {
      const platformKey = product.platform.toLowerCase();
      return platformColors[platformKey] || 'from-purple-900 to-black';
    } else if (product.category === 'accessories' && categoryId) {
      return accessoryColors[categoryId] || 'from-purple-900 to-black';
    }
    
    return 'from-purple-900 to-black';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${getGradientClass()} py-16`}>
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button 
            onClick={navigateBack} 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          {!loading && !error && product && (
            <div className="flex items-center">
              {product.category === 'game' ? (
                <FaGamepad className="text-2xl md:text-3xl text-yellow-400 mr-3" />
              ) : (
                <FaHeadphones className="text-2xl md:text-3xl text-yellow-400 mr-3" />
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Product <span className="text-yellow-400">Details</span>
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 -mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg text-center my-10">
            <p className="text-xl">{error}</p>
          </div>
        ) : product ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="p-6 flex items-center justify-center bg-black/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-30"></div>
                <div className="overflow-hidden rounded-xl w-full max-w-md relative z-10">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22200%22%20font-size%3D%2230%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-white">{product.title}</h1>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2 rounded-full transition-all ${
                      addedToWishlist 
                        ? 'bg-red-900/50 text-red-400 hover:bg-red-900/30' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-red-900/30 hover:text-red-400'
                    }`}
                    aria-label={addedToWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart 
                      size={20} 
                      fill={addedToWishlist ? "currentColor" : "none"} 
                    />
                  </button>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-400">(5.0)</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-3xl font-bold text-yellow-500">
                    {product.price.toFixed(2)} JOD
                  </p>
                </div>
                
                <div className="mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-300">{product.description}</p>
                </div>
                
                {product.category === 'game' && (
                  <div className="mb-6 flex items-center bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                    <div className="bg-gray-800 p-2 rounded-md mr-3">
                      <FaGamepad className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Platform</p>
                      <p className="text-white font-medium">{product.platform}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mb-6 bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                  <div className={`${product.stock > 0 ? 'bg-green-900/50' : 'bg-red-900/50'} p-2 rounded-md mr-3`}>
                    <FaBox className={`${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Availability</p>
                    <p className={`font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center">
                    <label htmlFor="quantity" className="block mr-4 text-gray-300">Quantity:</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      addedToCart 
                        ? 'bg-green-600 text-white'
                        : product.stock > 0
                          ? 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold'
                          : 'bg-gray-700 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck className="mr-2" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" />
                        <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                      </>
                    )}
                  </button>
                  
                  <Link 
                    to="/cart"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-400 mt-4">Product not found.</p>
            <Link 
              to="/store" 
              className="inline-block mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
            >
              Return to Store
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails; 