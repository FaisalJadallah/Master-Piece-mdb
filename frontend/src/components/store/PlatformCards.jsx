import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PlatformCards = () => {
  const { platformId } = useParams();
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, getCartItemsCount } = useCart();

  const platformNames = {
    playstation: 'PlayStation',
    steam: 'Steam',
    xbox: 'Xbox',
    'epic-games': 'Epic Games',
    nintendo: 'Nintendo',
    'google-play': 'Google Play'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get platform-specific products
        const response = await axios.get(`http://localhost:5000/store`, {
          params: { 
            category: 'game',
            platform: platformId
          }
        });
        
        if (response.data.products) {
          setProducts(response.data.products);
        } else {
          setProducts(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [platformId]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.imageUrl
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/store" className="flex items-center text-[#FFF7D1] hover:text-white transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Store
          </Link>
          
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center space-x-2 bg-[#6A42C2] text-white px-4 py-2 rounded-lg hover:bg-[#8B5DFF] transition-colors duration-300 group"
          >
            <FaShoppingCart className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{getCartItemsCount()}</span>
          </button>
        </div>

        <h1 className="text-4xl font-extrabold text-[#FFF7D1] mb-8">
          {platformNames[platformId] || 'Platform'} Games
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[#FFF7D1]">No products found for this platform.</p>
            <Link 
              to="/store" 
              className="inline-block mt-4 px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
            >
              Browse Other Platforms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-[#2a293a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 bg-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%22100%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-[#FFF7D1] mb-2 truncate">{product.title}</h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#FFF7D1]">${product.price.toFixed(2)}</span>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/store/${platformId}/product/${product._id}`}
                        className="px-4 py-2 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors text-sm"
                      >
                        Details
                      </Link>
                      <button 
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
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

export default PlatformCards; 