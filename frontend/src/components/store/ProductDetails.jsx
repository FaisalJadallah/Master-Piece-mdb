import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaStar, FaBox, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

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

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={navigateBack} 
            className="flex items-center text-[#FFF7D1] hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : product ? (
          <div className="bg-[#2a293a] rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="p-6 flex items-center justify-center bg-[#323046]">
                <div className="overflow-hidden rounded-xl w-full max-w-md">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-auto object-cover bg-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22200%22%20font-size%3D%2230%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-[#FFF7D1] mb-4">{product.title}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-400">(5.0)</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-2xl font-bold text-[#FFF7D1]">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#FFF7D1] mb-2">Description</h2>
                  <p className="text-gray-300">{product.description}</p>
                </div>
                
                <div className="flex items-center mb-6">
                  <FaBox className="text-green-400 mr-2" />
                  <span className="text-gray-300">
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center">
                    <label htmlFor="quantity" className="block mr-4 text-gray-300">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 ${
                      addedToCart 
                        ? 'bg-green-700'
                        : product.stock > 0
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-700 cursor-not-allowed'
                    } transition-colors`}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  
                  <Link 
                    to="/cart"
                    className="px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-[#FFF7D1]">Product not found.</p>
            <Link 
              to="/store" 
              className="inline-block mt-4 px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
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