import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaGamepad } from 'react-icons/fa';
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
    stock: 10,
    type: 'digital'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Using the centralized API utility which handles authentication
      const response = await getAllProducts();
      
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
      stock: isNaN(stock) ? 0 : stock,
      type: product.type || 'digital'
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
    
    // Create a simpler, more compatible product object
    // Focus only on the essential fields to minimize potential issues
    const productData = {
      title: formData.title,
      description: formData.description,
      price: isNaN(parseFloat(formData.price)) ? 0 : parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      category: formData.type === 'accessory' ? 'accessories' : 'game',
      stock: isNaN(parseInt(formData.stock)) ? 0 : parseInt(formData.stock),
    };
    
    // Only add platform if it's a digital product
    if (formData.type === 'digital') {
      productData.platform = formData.platform;
    }
    
    // Log what we're sending to help debug
    console.log('Sending product data to server:', productData);
    
    try {
      let response;
      if (currentProduct) {
        // Update existing product using centralized API utility
        response = await updateProduct(currentProduct._id, productData);
        console.log('Update response:', response.data);
      } else {
        // Create new product using centralized API utility
        try {
          response = await createProduct(productData);
        } catch (err) {
          // If the centralized utility fails, try a direct POST as fallback
          console.log('Trying direct API call as fallback');
          
          // Use the API instance that has the interceptors
          response = await api.post('/store', productData);
        }
        console.log('Create response:', response.data);
      }
      fetchProducts();
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
    setFormData(prev => ({
      ...prev,
      imageUrl: fileUrl
    }));
    setShowImageUploader(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFF7D1]">Store Management</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center gap-2"
          >
            <FaPlus /> {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {currentProduct ? "Edit Product" : "Create Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Product Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                  >
                    <option value="digital">Digital Product</option>
                    <option value="accessory">Gaming Accessory</option>
                  </select>
                </div>
                {formData.type === 'digital' ? (
                  <div>
                    <label className="block text-gray-400 mb-2">Platform</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    >
                      <option value="steam">Steam</option>
                      <option value="origin">Origin</option>
                      <option value="epic">Epic Games</option>
                      <option value="uplay">Ubisoft Connect</option>
                      <option value="battlenet">Battle.net</option>
                      <option value="microsoft">Microsoft Store</option>
                      <option value="playstation">PlayStation</option>
                      <option value="xbox">Xbox</option>
                      <option value="nintendo">Nintendo</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-400 mb-2">Accessory Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    >
                      <option value="headphones">Gaming Headsets</option>
                      <option value="keyboards">Gaming Keyboards</option>
                      <option value="mouse">Gaming Mouse</option>
                      <option value="controllers">Controllers</option>
                      <option value="chairs">Gaming Chairs</option>
                      <option value="monitors">Gaming Monitors</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-gray-400 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Image</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowImageUploader(true)}
                      className="px-4 py-2 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-md"
                    >
                      Upload Image
                    </button>
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="Product"
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80';
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  {currentProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">No products found</p>
            <p className="mt-2 text-gray-500">
              Click the "Add Product" button to create your first product
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-700">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                        <span>{product.title}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {product.type === 'digital' ? 'Digital' : 'Accessory'}
                    </td>
                    <td className="p-3">
                      {product.type === 'digital' ? product.platform : product.category}
                    </td>
                    <td className="p-3">${product.price.toFixed(2)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-400 hover:text-red-300"
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
        )}
      </div>
    </div>
  );
};

export default StoreManagement; 