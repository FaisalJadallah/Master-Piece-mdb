import React, {useState, useEffect } from 'react';
import Navbar from "../navbar/Navbar";
import axios from 'axios';
import { Link } from 'react-router-dom';


const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('');
  // const [comments, setComments] = useState({});
 const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [articles, setArticles] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5000/api/news/allNews')
      .then((response) => {
        setArticles(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);


  
  const platforms = ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"];
  
  const categories = [
    { name: "FPS", icon: "🎯" },
    { name: "RPG", icon: "⚔️" },
    { name: "Adventure", icon: "🗺️" },
    { name: "Strategy", icon: "🧠" },
    { name: "Sports", icon: "🏆" },
    { name: "Hardware", icon: "🖥️" },
    { name: "Indie", icon: "🎮" },
    { name: "Mobile", icon: "📱" }
  ];
  
  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };
  
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const filteredArticles = articles.filter(article => {
    // Search filter
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Platform filter
    const matchesPlatform = selectedPlatforms.length === 0 || 
                            selectedPlatforms.some(platform => article.platform.includes(platform));
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(article.category);
    
    return matchesSearch && matchesPlatform && matchesCategory;

  });

    // Toggle like/bookmark
    const toggleLike = () => {
      setIsLiked(!isLiked);
    };
  
    const toggleBookmark = () => {
      setIsBookmarked(!isBookmarked);
    };
  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : '📰';
  };

  // const addComment = (id, comment) => {
  //   if (!comment.trim()) return;
  //   setComments((prev) => ({
  //     ...prev,
  //     [id]: prev[id] ? [...prev[id], comment] : [comment],
  //   }));
  // };


  return (
    <div className="min-h-screen bg-[#EFF5F5] px-4 py-8">
    <Navbar />
      <main className="max-w-6xl mx-auto mt-15">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#497174]">Home</a>
          <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <a href="/articles" className="hover:text-[#497174]">Articles</a>
          <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
         
        </div>
        {/* Featured Article - Conditional Display */}
        {filteredArticles.some(article => article.featured) && (
          <div className="mb-8">
            {filteredArticles.filter(article => article.featured).map(article => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
                <div className="md:flex">
                  <div className="md:w-2/3 relative">
                    <img src={article.images} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-[#EB6440] text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  </div>
                  <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="bg-[#D6E4E5] text-[#497174] text-sm font-medium px-3 py-1 rounded-full flex items-center">
                          {getCategoryIcon(article.category)} <span className="ml-1">{article.category}</span>
                        </span>
                        <span className="text-xs text-gray-500 ml-3">{article.platform}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#497174] mb-4">{article.title}</h2>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#497174] rounded-full flex items-center justify-center text-white">
                          {article.author}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium">{article.author}</p>
                          <p className="text-xs text-gray-500">{article.date} • {article.readTime}</p>
                        </div>
                      </div>
                      <Link to={`/news/${article._id}`} className="read-more">
                      <button className="px-4 py-2 bg-[#EB6440] text-white rounded-md hover:bg-opacity-90 flex items-center">
                        <span>Read</span>
                        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar/Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#497174] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
                </svg>
                Filters
              </h2>
              
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-[#D6E4E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] bg-[#EFF5F5]"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-[#497174] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedPlatforms.includes(platform)
                          ? 'bg-[#497174] text-white'
                          : 'bg-[#D6E4E5] text-[#497174] hover:bg-[#497174] hover:bg-opacity-20'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-[#497174] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.name}
                      onClick={() => toggleCategory(category.name)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                        selectedCategories.includes(category.name)
                          ? 'bg-[#EB6440] text-white'
                          : 'bg-[#D6E4E5] text-[#497174] hover:bg-[#EB6440] hover:bg-opacity-20'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span> {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {(selectedPlatforms.length > 0 || selectedCategories.length > 0 || searchTerm) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPlatforms([]);
                    setSelectedCategories([]);
                  }}
                  className="w-full px-4 py-2 bg-[#D6E4E5] text-[#497174] rounded-lg hover:bg-opacity-80 flex items-center justify-center font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Articles */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#497174] flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Latest Gaming News 
                <span className="ml-2 text-sm font-normal text-gray-500">({filteredArticles.length} articles)</span>
              </h1>
              
              <div className="flex border border-[#D6E4E5] rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#D6E4E5] text-[#497174]' : 'text-gray-500'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#D6E4E5] text-[#497174]' : 'text-gray-500'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {filteredArticles.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 mx-auto text-[#D6E4E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-xl text-gray-600 mt-4">No articles found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPlatforms([]);
                    setSelectedCategories([]);
                  }}
                  className="mt-6 px-6 py-2 bg-[#EB6440] text-white rounded-lg hover:bg-opacity-90"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.filter(article => !article.featured).map(article => (
                  <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>
                      <div className="absolute bottom-4 left-4 flex space-x-2">
                        <span className="bg-[#EB6440] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                          {getCategoryIcon(article.category)} <span className="ml-1">{article.category}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-[#497174] bg-[#D6E4E5] px-2 py-1 rounded-full">
                          {article.platform}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#497174] mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#497174] rounded-full flex items-center justify-center text-white text-sm">
                            {article.author}
                          </div>
                          <span className="ml-2 text-sm text-gray-700">{article.date}</span>
                        </div>
                        <Link to={`/news/${article._id}`} className="read-more">
                        <button className="px-4 py-2 bg-[#D6E4E5] text-[#497174] font-medium rounded-md hover:bg-[#497174] hover:text-white transition-colors">
                          Read More
                        </button>
                       </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.filter(article => !article.featured).map(article => (
                  <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img src={article.images} alt={article.title} className="w-full h-full md:h-48 object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-[#EB6440] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                            {getCategoryIcon(article.category)} <span className="ml-1">{article.category}</span>
                          </span>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-[#497174] bg-[#D6E4E5] px-2 py-1 rounded-full">
                            {article.platform}
                          </span>
                          <span className="text-xs text-gray-500">{article.date} • {article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#497174] mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#497174] rounded-full flex items-center justify-center text-white text-sm">
                              {article.author}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                              </svg>
                              {/* {article.comments} */}
                            </div>
                            
              <div className="flex space-x-3">
                {/* <button 
                  onClick={toggleLike}
                  className={`p-2 rounded-full ${isLiked ? 'bg-[#EB6440] text-white' : 'bg-[#D6E4E5] text-[#497174]'}`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button 
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full ${isBookmarked ? 'bg-[#497174] text-white' : 'bg-[#D6E4E5] text-[#497174]'}`}
                >
                  <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button> */}
                {/* <button className="p-2 rounded-full bg-[#D6E4E5] text-[#497174]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-[#D6E4E5] text-[#497174]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button> */}
              </div>
              <Link to={`/news/${article._id}`} className="read-more">

                            <button className="px-4 py-2 bg-[#D6E4E5] text-[#497174] font-medium rounded-md hover:bg-[#497174] hover:text-white transition-colors flex items-center">
                              <span>Read</span>
                              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                              </svg>
                            </button>
                            </Link>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="p-2 rounded-md bg-white text-gray-500 border border-[#D6E4E5]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="px-4 py-2 rounded-md bg-[#497174] text-white">
                  1
                </button>
                <button className="px-4 py-2 rounded-md bg-white text-gray-700 border border-[#D6E4E5]">
                  2
                </button>
                <button className="px-4 py-2 rounded-md bg-white text-gray-700 border border-[#D6E4E5]">
                  3
                </button>
                <span className="px-4 py-2 text-gray-500">...</span>
                <button className="px-4 py-2 rounded-md bg-white text-gray-700 border border-[#D6E4E5]">
                  8
                </button>
                <button className="p-2 rounded-md bg-white text-gray-500 border border-[#D6E4E5]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Articles;
