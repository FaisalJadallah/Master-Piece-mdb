import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllNews, createNews, updateNews, deleteNews } from '../../utils/api';
import FileUploader from './FileUploader';

const NewsManagement = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    // Filter articles based on search term
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = articles.filter(
        article => 
          article.title.toLowerCase().includes(term) || 
          (article.content && article.content.toLowerCase().includes(term)) ||
          (article.summary && article.summary.toLowerCase().includes(term)) ||
          (article.author && article.author.toLowerCase().includes(term)) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await getAllNews();
      
      if (Array.isArray(response.data)) {
        setArticles(response.data);
        setFilteredArticles(response.data);
      } else if (response.data.articles && Array.isArray(response.data.articles)) {
        setArticles(response.data.articles);
        setFilteredArticles(response.data.articles);
      } else {
        setArticles([]);
        setFilteredArticles([]);
        setError('Unexpected data format received from server');
        console.error('Unexpected data format:', response.data);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles. ' + (err.response?.data?.message || err.message));
      console.error('Error fetching articles:', err);
      setArticles([]);
      setFilteredArticles([]);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        await deleteNews(id);
        setArticles(articles.filter(article => article._id !== id));
        setFilteredArticles(filteredArticles.filter(article => article._id !== id));
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
        const response = await updateNews(currentArticle._id, processedData);
        console.log('Update response:', response.data);
      } else {
        // Create new article
        const response = await createNews(processedData);
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
                <FaNewspaper className="text-yellow-500 text-2xl mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  News Management
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
              <FaPlus /> {showForm ? "Cancel" : "Add Article"}
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
              <FaNewspaper className="text-yellow-500 mr-2" />
              {currentArticle ? "Edit Article" : "Create Article"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Summary (optional)</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    rows="2"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    rows="10"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="gaming, news, updates"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Featured Image</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowImageUploader(true)}
                      className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Upload Image
                    </button>
                    {formData.imageUrl && (
                      <div className="border border-gray-700 rounded-lg p-1">
                        <img
                          src={formData.imageUrl}
                          alt="Article"
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </div>
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
                      className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isPublished" className="ml-2 text-gray-300">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300"
                >
                  {currentArticle ? "Update Article" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search bar for articles in admin view */}
        {!showForm && !loading && articles.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search articles..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 text-white focus:outline-none"
              />
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-400">
                Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} matching "{searchTerm}"
                <button 
                  className="ml-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {showImageUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Upload Image</h3>
                <button 
                  onClick={() => setShowImageUploader(false)}
                  className="text-gray-400 hover:text-white transition-colors"
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

        {articles.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <FaNewspaper className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-xl text-white mb-2">No articles found</p>
            <p className="text-gray-400 mb-8">
              Click the "Add Article" button to create your first article
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              <FaPlus /> Add Article
            </button>
          </div>
        ) : filteredArticles.length === 0 && searchTerm ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <FaSearch className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-xl text-white mb-2">No articles match your search criteria</p>
            <button 
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300 mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="p-4 text-left text-gray-300 font-medium">Article</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Date</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Author</th>
                    <th className="p-4 text-center text-gray-300 font-medium">Status</th>
                    <th className="p-4 text-center text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article, index) => (
                    <tr key={article._id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-gray-700 overflow-hidden flex-shrink-0">
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <span className="font-medium text-white">{article.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {formatDate(article.createdAt || new Date())}
                      </td>
                      <td className="p-4 text-gray-300">
                        {article.author || 'Anonymous'}
                      </td>
                      <td className="p-4 text-center">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            article.isPublished !== false 
                              ? 'bg-green-900/50 text-green-200 border border-green-700' 
                              : 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
                          }`}
                        >
                          {article.isPublished !== false ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/news/${article._id}`}
                            target="_blank"
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-500 hover:text-blue-400 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(article._id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement; 