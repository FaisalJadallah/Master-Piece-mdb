import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaShareAlt, FaTag } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { getNewsById } from '../../utils/api';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await getNewsById(id);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load the article. It may have been removed or is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary || article.content.substring(0, 100) + '...',
        url: window.location.href,
      })
      .catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Format content with paragraphs
  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
    ));
  };

  // Navigate to news page with selected tag
  const handleTagClick = (tag) => {
    navigate(`/news?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/news')} 
            className="flex items-center text-[#FFF7D1] hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to News
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" color="purple" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-6 rounded-lg text-center">
            <p className="text-xl mb-4">{error}</p>
            <Link 
              to="/news" 
              className="inline-block px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
            >
              Return to News
            </Link>
          </div>
        ) : article ? (
          <article className="bg-[#2a293a] rounded-2xl overflow-hidden shadow-2xl">
            {/* Featured Image */}
            <div className="h-72 sm:h-96 w-full relative">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Article+Image';
                }}
              />
              
              {/* Tags positioned on top of the image */}
              {article.tags && article.tags.length > 0 && (
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end max-w-[60%]">
                  {article.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1 bg-[#6A42C2] bg-opacity-90 hover:bg-opacity-100 rounded-full text-sm text-white transition-colors flex items-center"
                    >
                      <FaTag className="mr-1" size={10} /> {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 sm:p-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF7D1] mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-400 mb-8 border-b border-gray-700 pb-6">
                <div className="flex items-center mr-6 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  {formatDate(article.createdAt)}
                </div>
                {article.author && (
                  <div className="flex items-center mr-6 mb-2">
                    <FaUser className="mr-2" />
                    {article.author}
                  </div>
                )}
                <div className="flex items-center mr-6 mb-2">
                  <FaClock className="mr-2" />
                  {getReadingTime(article.content)}
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center text-[#FFF7D1] hover:text-[#8B5DFF] transition-colors mb-2"
                >
                  <FaShareAlt className="mr-2" />
                  Share
                </button>
              </div>
              
              {/* Article summary if available */}
              {article.summary && (
                <div className="mb-8 italic text-xl text-gray-300 border-l-4 border-[#6A42C2] pl-4">
                  {article.summary}
                </div>
              )}
              
              {/* Main content */}
              <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                {formatContent(article.content)}
              </div>
              
              {/* Tags at bottom */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-700">
                  <h3 className="text-gray-400 mb-3 flex items-center">
                    <FaTag className="mr-2" /> Related Tags:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        className="px-3 py-1 bg-[#3a3650] hover:bg-[#6A42C2] rounded-full text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Back to News button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button 
                  onClick={() => navigate('/news')}
                  className="px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to All News
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-[#FFF7D1]">Article not found</p>
            <Link 
              to="/news" 
              className="inline-block mt-6 px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors"
            >
              Return to News
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail; 