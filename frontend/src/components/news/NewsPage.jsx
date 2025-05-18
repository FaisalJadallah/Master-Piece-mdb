import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaClock, FaSearch, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { getAllNews } from '../../utils/api';

const NewsPage = () => {
  const location = useLocation();
  const [newsArticles, setNewsArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  // Parse URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tagFromUrl = queryParams.get('tag');
    
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllNews();
        
        let articles = [];
        if (Array.isArray(response.data)) {
          articles = response.data;
        } else if (response.data.articles && Array.isArray(response.data.articles)) {
          articles = response.data.articles;
        } else {
          setError('Unexpected data format received from server');
          console.error('Unexpected data format:', response.data);
        }
        
        setNewsArticles(articles);
        setFilteredArticles(articles);
        
        // Extract all unique tags from articles
        const tags = new Set();
        articles.forEach(article => {
          if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach(tag => tags.add(tag));
          }
        });
        setAvailableTags(Array.from(tags).sort());
        
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Filter articles based on search term and selected tag
    let filtered = [...newsArticles];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        article => 
          article.title.toLowerCase().includes(term) || 
          (article.content && article.content.toLowerCase().includes(term)) ||
          (article.summary && article.summary.toLowerCase().includes(term)) ||
          (article.author && article.author.toLowerCase().includes(term)) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(
        article => article.tags && article.tags.includes(selectedTag)
      );
    }
    
    setFilteredArticles(filtered);
  }, [searchTerm, selectedTag, newsArticles]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    
    // Update URL without refreshing the page
    const url = new URL(window.location);
    if (tag === selectedTag) {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', tag);
    }
    window.history.pushState({}, '', url);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    
    // Remove query parameters from URL
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate reading time based on content length
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes > 1 ? `${minutes} mins read` : '1 min read';
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#FFF7D1]">Latest Gaming News</h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, updates, and announcements from the gaming world.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search news by title, content, author, or tags..."
                className="block w-full pl-10 pr-4 py-3 border-0 bg-gray-800 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] placeholder-gray-500 text-white focus:outline-none"
              />
            </div>
          </div>
          
          {/* Filter by tags */}
          {availableTags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === tag 
                        ? 'bg-[#8B5DFF] text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Active filters */}
          {(searchTerm || selectedTag) && (
            <div className="mt-4 flex justify-center items-center">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span>Active filters:</span>
                {selectedTag && (
                  <span className="bg-[#6A42C2] text-white px-2 py-1 rounded-md flex items-center">
                    Tag: {selectedTag}
                    <button onClick={() => handleTagClick(selectedTag)} className="ml-2 text-gray-300 hover:text-white">
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-[#6A42C2] text-white px-2 py-1 rounded-md flex items-center">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-2 text-gray-300 hover:text-white">
                      <FaTimes size={12} />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-[#8B5DFF] hover:text-[#a17dff] transition-colors ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" color="purple" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm || selectedTag ? (
              <>
                <p className="text-xl text-[#FFF7D1]">No articles match your filter criteria.</p>
                <button 
                  className="mt-4 text-[#8B5DFF] hover:text-[#a17dff] transition-colors"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-xl text-[#FFF7D1]">No news articles available at the moment.</p>
                <p className="mt-4 text-gray-400">Check back later for updates!</p>
              </>
            )}
          </div>
        ) : (
          <>
            {(searchTerm || selectedTag) && (
              <div className="mb-6 text-center">
                <p className="text-[#FFF7D1]">
                  Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} matching your criteria
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {filteredArticles.map((article) => (
                <div 
                  key={article._id} 
                  className="bg-[#2a293a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/600x400?text=News';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <div className="flex items-center mr-4">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(article.createdAt)}
                      </div>
                      {article.author && (
                        <div className="flex items-center mr-4">
                          <FaUser className="mr-2" />
                          {article.author}
                        </div>
                      )}
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        {getReadingTime(article.content)}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-[#FFF7D1] mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {article.summary || article.content.substring(0, 150) + '...'}
                    </p>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedTag === tag 
                                ? 'bg-[#8B5DFF] text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <Link 
                      to={`/news/${article._id}`}
                      className="inline-block px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage; 