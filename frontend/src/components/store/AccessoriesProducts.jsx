import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const AccessoriesProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryNames = {
    'headphones': 'Gaming Headsets',
    'keyboards': 'Gaming Keyboards',
    'mouse': 'Gaming Mouse',
    'controllers': 'Controllers',
    'chairs': 'Gaming Chairs',
    'monitors': 'Gaming Monitors'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from backend filtered by accessory category
        const response = await axios.get(`http://localhost:5000/api/store`, {
          params: { 
            type: 'accessory',
            category: categoryId 
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
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/store" className="flex items-center text-[#FFF7D1] hover:text-white transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Store
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-[#FFF7D1] mb-8">
          {categoryNames[categoryId] || 'Accessories'}
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
            <p className="text-xl text-[#FFF7D1]">No products found in this category.</p>
            <Link 
              to="/store" 
              className="inline-block mt-4 px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
            >
              Browse Other Categories
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
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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
                        to={`/store/accessories/${categoryId}/product/${product._id}`}
                        className="px-4 py-2 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors text-sm"
                      >
                        Details
                      </Link>
                      <button 
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center"
                        onClick={() => {/* Add to cart functionality */}}
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

export default AccessoriesProducts; 