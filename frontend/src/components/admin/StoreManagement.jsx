import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaGamepad, FaChevronLeft, FaChevronRight, FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FileUploader from './FileUploader';
import api, { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../utils/api';

const StoreManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    platform: 'steam',
    category: 'game',
    subcategory: 'headphones',
    stock: 10,
    type: 'digital'
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Using the centralized API utility which handles authentication, set triedFallback to true to avoid loops
      const response = await getAllProducts({}, true);
      
      // Check if response.data is an array or contains a products property
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        // Fallback to empty array if neither condition is met
        setProducts([]);
        setError('Unexpected data format received from server');
        console.error('Unexpected data format:', response.data);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. ' + (err.response?.data?.message || err.message));
      console.error('Error fetching products:', err);
      setProducts([]); // Ensure products is an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'stock') {
      // Ensure we're dealing with valid numbers
      const numValue = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue // Default to 0 if NaN
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      imageUrl: '',
      platform: 'steam',
      category: 'game',
      subcategory: 'headphones',
      stock: 10,
      type: 'digital'
    });
    setCurrentProduct(null);
  };

  const handleEdit = (product) => {
    // Ensure numeric values are always valid numbers
    const price = parseFloat(product.price);
    const stock = parseInt(product.stock);
    
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: isNaN(price) ? 0 : price,
      imageUrl: product.imageUrl,
      platform: product.platform || 'steam',
      category: product.category || 'game',
      subcategory: product.subcategory || 'headphones',
      stock: isNaN(stock) ? 0 : stock,
      type: product.category === 'accessories' ? 'accessory' : 'digital'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Using the centralized API utility for deletion
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        setError('Failed to delete product. ' + (err.response?.data?.message || err.message));
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a product object with common fields
    const productData = {
      title: formData.title,
      description: formData.description,
      price: isNaN(parseFloat(formData.price)) ? 0 : parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      stock: isNaN(parseInt(formData.stock)) ? 0 : parseInt(formData.stock),
    };
    
    // Add product type specific fields
    if (formData.type === 'digital') {
      productData.category = 'game';
      productData.platform = formData.platform;
    } else if (formData.type === 'accessory') {
      productData.category = 'accessories';
      productData.subcategory = formData.subcategory;
    }
    
    // Log what we're sending to help debug
    console.log('Sending product data to server:', productData);
    
    try {
      let response;
      if (currentProduct) {
        // Update existing product using centralized API utility
        response = await updateProduct(currentProduct._id, productData, true);
        console.log('Update response:', response.data);
      } else {
        // Create new product using centralized API utility
        response = await createProduct(productData, true);
        console.log('Create response:', response.data);
      }
      
      await fetchProducts();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to save product. ' + (err.response?.data?.message || err.message));
      console.error('Error saving product:', err);
      
      // More detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error details:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers
        });
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
      }
    }
  };

  const handleFileUploaded = (fileUrl) => {
    console.log('File uploaded successfully, URL:', fileUrl);
    setFormData(prev => ({
      ...prev,
      imageUrl: fileUrl
    }));
    setShowImageUploader(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-8 px-6">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <FaArrowLeft />
              </Link>
              <div className="flex items-center">
                <FaStore className="text-yellow-500 text-2xl mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Store Management
                </h1>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaPlus /> {showForm ? "Cancel" : "Add Product"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 mb-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <FaGamepad className="text-yellow-500 mr-2" />
              {currentProduct ? "Edit Product" : "Create Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Product Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  >
                    <option value="digital">Digital Product</option>
                    <option value="accessory">Gaming Accessory</option>
                  </select>
                </div>
                {formData.type === 'accessory' && (
                  <div>
                    <label className="block text-gray-300 mb-2">Accessory Type</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    >
                      <option value="headphones">Gaming Headsets</option>
                      <option value="keyboards">Gaming Keyboards</option>
                      <option value="mouse">Gaming Mouse</option>
                      <option value="controllers">Controllers</option>
                      <option value="chairs">Gaming Chairs</option>
                      <option value="monitors">Gaming Monitors</option>
                      <option value="other">Other Accessories</option>
                    </select>
                  </div>
                )}
                {formData.type === 'digital' && (
                  <div>
                    <label className="block text-gray-300 mb-2">Platform</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    >
                      <option value="steam">Steam</option>
                      <option value="playstation">PlayStation</option>
                      <option value="xbox">Xbox</option>
                      <option value="nintendo">Nintendo</option>
                      <option value="epic-games">Epic Games</option>
                      <option value="google-play">Google Play</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-gray-300 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Image</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowImageUploader(true)}
                      className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Upload Image
                    </button>
                    {formData.imageUrl && (
                      <div className="flex items-center gap-3">
                        <div className="border border-gray-700 rounded-lg p-1">
                          <img
                            src={formData.imageUrl}
                            alt="Product"
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2240%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 break-all max-w-[200px]">{formData.imageUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300"
                >
                  {currentProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <FaStore className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-xl text-white mb-2">No products found</p>
            <p className="text-gray-400 mb-8">
              Click the "Add Product" button to create your first product
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              <FaPlus /> Add Product
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="p-4 text-left text-gray-300 font-medium">Product</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Type</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Category</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Price</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Stock</th>
                    <th className="p-4 text-center text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-gray-700 overflow-hidden flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2240%22%20height%3D%2240%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2220%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                              }}
                            />
                          </div>
                          <span className="font-medium text-white">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {product.category === 'accessories' ? 'Accessory' : 'Digital'}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.category === 'accessories' 
                            ? 'bg-blue-900/50 text-blue-200 border border-blue-700' 
                            : 'bg-green-900/50 text-green-200 border border-green-700'
                        }`}>
                          {product.category === 'accessories' ? product.subcategory : product.platform}
                        </span>
                      </td>
                      <td className="p-4 text-yellow-500 font-medium">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-gray-300">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-red-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {products.length > productsPerPage && (
              <div className="px-4 py-5 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400'
                    }`}
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 rounded-md ${
                          currentPage === number
                            ? 'bg-yellow-600 text-black font-bold'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400'
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showImageUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Upload Product Image</h3>
                <button 
                  onClick={() => setShowImageUploader(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <FileUploader 
                  onFileUploaded={handleFileUploaded} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement; 