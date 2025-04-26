import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUser, FaClock } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const NewsPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/news');
        
        if (response.data.articles) {
          setNewsArticles(response.data.articles);
        } else {
          setNewsArticles(response.data);
        }
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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#FFF7D1]">Latest Gaming News</h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, updates, and announcements from the gaming world.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" color="purple" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg">
            {error}
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[#FFF7D1]">No news articles available at the moment.</p>
            <p className="mt-4 text-gray-400">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {newsArticles.map((article) => (
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
                  
                  <p className="text-gray-300 mb-5 line-clamp-3">
                    {article.summary || article.content.substring(0, 150) + '...'}
                  </p>
                  
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
        )}
      </div>
    </div>
  );
};

export default NewsPage; 