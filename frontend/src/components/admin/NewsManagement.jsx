import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import FileUploader from './FileUploader';

const NewsManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    author: '',
    tags: '',
    isPublished: true
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news');
      
      if (Array.isArray(response.data)) {
        setArticles(response.data);
      } else if (response.data.articles && Array.isArray(response.data.articles)) {
        setArticles(response.data.articles);
      } else {
        setArticles([]);
        setError('Unexpected data format received from server');
        console.error('Unexpected data format:', response.data);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles. ' + (err.response?.data?.message || err.message));
      console.error('Error fetching articles:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
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
      content: '',
      summary: '',
      imageUrl: '',
      author: '',
      tags: '',
      isPublished: true
    });
    setCurrentArticle(null);
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setFormData({
      title: article.title,
      content: article.content || '',
      summary: article.summary || '',
      imageUrl: article.imageUrl || '',
      author: article.author || '',
      tags: article.tags ? article.tags.join(', ') : '',
      isPublished: article.isPublished !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/news/${id}`);
        setArticles(articles.filter(article => article._id !== id));
      } catch (err) {
        setError('Failed to delete article. ' + (err.response?.data?.message || err.message));
        console.error('Error deleting article:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process tags from comma-separated string to array
    const processedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    };
    
    try {
      if (currentArticle) {
        // Update existing article
        const response = await api.put(`/news/${currentArticle._id}`, processedData);
        console.log('Update response:', response.data);
      } else {
        // Create new article
        const response = await api.post('/news', processedData);
        console.log('Create response:', response.data);
      }
      fetchArticles();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to save article. ' + (err.response?.data?.message || err.message));
      console.error('Error saving article:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Server error details:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers
        });
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFF7D1]">News Management</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center gap-2"
          >
            <FaPlus /> {showForm ? "Cancel" : "Add Article"}
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
              {currentArticle ? "Edit Article" : "Create Article"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Summary (optional)</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    rows="2"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    rows="10"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="gaming, news, updates"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Featured Image</label>
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
                        alt="Article"
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80';
                        }}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#8B5DFF] bg-gray-700 border-gray-600 rounded focus:ring-[#8B5DFF]"
                    />
                    <label htmlFor="isPublished" className="ml-2 text-gray-400">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  {currentArticle ? "Update Article" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        )}

        {showImageUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold">Upload Image</h3>
                <button 
                  onClick={() => setShowImageUploader(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <FileUploader onFileUploaded={handleFileUploaded} />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">No articles found</p>
            <p className="mt-2 text-gray-500">
              Click the "Add Article" button to create your first article
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Article</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id} className="border-t border-gray-700">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-10 h-10 object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                        <span className="font-medium">{article.title}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {formatDate(article.createdAt || new Date())}
                    </td>
                    <td className="p-3">
                      {article.author || 'Anonymous'}
                    </td>
                    <td className="p-3 text-center">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          article.isPublished !== false 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-yellow-900 text-yellow-200'
                        }`}
                      >
                        {article.isPublished !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/news/${article._id}`}
                          target="_blank"
                          className="text-blue-400 hover:text-blue-300"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-400 hover:text-red-300"
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
        )}
      </div>
    </div>
  );
};

export default NewsManagement; 