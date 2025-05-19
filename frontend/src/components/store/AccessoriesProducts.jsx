import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaCheck, FaSearch } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCart } from '../../context/CartContext';

const AccessoriesProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, getCartItemsCount } = useCart();
  const [addedToCartMap, setAddedToCartMap] = useState({});
  const [showCart, setShowCart] = useState(false);
  
  const categoryNames = {
    'headphones': 'Gaming Headsets',
    'keyboards': 'Gaming Keyboards',
    'mouse': 'Gaming Mouse',
    'controllers': 'Controllers',
    'chairs': 'Gaming Chairs',
    'monitors': 'Gaming Monitors'
  };

  const categoryColors = {
    'headphones': 'from-purple-700 to-purple-900',
    'keyboards': 'from-blue-700 to-blue-900',
    'mouse': 'from-green-700 to-green-900',
    'controllers': 'from-red-700 to-red-900',
    'chairs': 'from-yellow-700 to-yellow-900',
    'monitors': 'from-indigo-700 to-indigo-900'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/store`, {
          params: { 
            category: 'accessories',
            subcategory: categoryId
          }
        });
        
        let productsData = [];
        if (response.data.products) {
          productsData = response.data.products;
        } else {
          productsData = response.data;
        }
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(lowercaseSearchTerm) || 
        (product.description && product.description.toLowerCase().includes(lowercaseSearchTerm))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.imageUrl,
      isPhysical: true
    });
    
    // Set the added state for this specific product
    setAddedToCartMap(prev => ({
      ...prev,
      [product._id]: true
    }));
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedToCartMap(prev => ({
        ...prev,
        [product._id]: false
      }));
    }, 2000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${categoryColors[categoryId] || 'from-purple-900 to-black'} py-16`}>
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <Link to="/store" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6 md:mb-0">
                <FaArrowLeft className="mr-2" />
                Back to Store
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mt-2">
                {categoryNames[categoryId] || 'Accessories'} <span className="text-yellow-400">Collection</span>
              </h1>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center space-x-3 bg-yellow-500 text-black px-4 py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300 font-bold"
            >
              <FaShoppingCart className="text-xl" />
              <span className="text-lg">{getCartItemsCount()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter/Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-300 mb-4 md:mb-0">
            Showing {filteredProducts.length} of {products.length} products in {categoryNames[categoryId] || 'Accessories'}
          </p>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {searchTerm && (
              <button 
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg text-center my-10">
            <p className="text-xl">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
            {searchTerm ? (
              <>
                <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.5 15.5l5 5M10 17a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <p className="text-xl text-gray-400 mt-4">No products match your search "{searchTerm}"</p>
                <button 
                  onClick={clearSearch}
                  className="inline-block mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-gray-400 mt-4">No products found in this category.</p>
                <Link 
                  to="/store" 
                  className="inline-block mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
                >
                  Browse Other Categories
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%22100%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                      className={`w-full py-2 ${
                        addedToCartMap[product._id] 
                          ? 'bg-green-600 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                      } font-bold rounded-lg transition-colors flex items-center justify-center space-x-2`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedToCartMap[product._id] ? (
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
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-white mb-2 truncate">{product.title}</h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-500">${product.price.toFixed(2)}</span>
                    
                    <Link 
                      to={`/store/accessories/${categoryId}/product/${product._id}`}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesProducts; 