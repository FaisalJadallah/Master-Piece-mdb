import React, { useState, useEffect } from "react";
import videoFile from "../../assets/Home/next-level.mp4"; 
import VoltageButton from "../common/VoltageButton";
import { getLatestNews, getAllTournaments } from "../../utils/api";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [tournamentsError, setTournamentsError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await getLatestNews(3);
        
        if (!response.data) {
          throw new Error('No data received from the API');
        }

        // Ensure we're setting an array
        const newsData = Array.isArray(response.data) ? response.data : [];
        setLatestNews(newsData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch latest news");
        setLatestNews([]); // Ensure we have an empty array on error
        setLoading(false);
      }
    };

    const fetchTournaments = async () => {
      try {
        console.log('Fetching tournaments...');
        const response = await getAllTournaments();
        console.log('Tournaments API Response:', response.data);
        
        if (!response.data) {
          throw new Error('No tournament data received from the API');
        }

        // Get only upcoming tournaments and limit to 3
        const upcomingTournaments = response.data
          // No date filter, show all tournaments
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
          .slice(0, 3);
        
        console.log('Filtered upcoming tournaments:', upcomingTournaments);
        setTournaments(upcomingTournaments);
        setTournamentsLoading(false);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setTournamentsError(err.message || "Failed to fetch tournaments");
        setTournaments([]);
        setTournamentsLoading(false);
      }
    };

    fetchLatestNews();
    fetchTournaments();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section with Animated Overlay */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover z-0"
        >
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-20 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              GAMING<span className="text-yellow-400">HIVE</span>
            </h1>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mb-8"></div>
            <p className="mt-6 text-2xl text-gray-200 leading-relaxed">
              Level up your gaming experience with tournaments, exclusive content, and a vibrant community.
            </p>
            {/* <div className="mt-12 flex flex-wrap justify-center gap-6">
              <VoltageButton to="/tournaments">
                Join Tournaments
              </VoltageButton>
              <VoltageButton to="/store">
                Browse Store
              </VoltageButton>
            </div> */}
          </div>
          </div>
          
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Store Section - Redesigned with Neon Effect */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/50"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/Home/circuit-pattern.png')] bg-repeat opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block">
            <h2 className="text-5xl font-bold text-white">Gaming <span className="text-yellow-400">Store</span></h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mt-2"></div>
          </div>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Premium gaming gift cards and digital content for the ultimate gaming experience
          </p>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Cards */}
            {[
              {
                title: "PlayStation",
                desc: "Add money to your PlayStation account. You can use it to buy games, add-ons, movies, and more from the PlayStation Store. It's a quick and easy gift for any gamer!",
                img: "/src/assets/Home/playstation-store-logo-1200x900.jpg",
                color: "blue",
              },
              {
                title: "Xbox",
                desc: "Gives you credit to spend on your Xbox account. You can use it to get games, DLCs, movies, apps, and more from the Xbox Store. It's a fun and simple gift for any Xbox fan!",
                img: "/src/assets/Home/xbox.jpg",
                color: "green",
              },
              {
                title: "Steam",
                desc: "Steam Gift Cards let you top up your Steam account and buy games, add-ons, and more. Great for gamers who love PC gaming!",
                img: "/src/assets/Home/steam_logo_art_2000.webp",
                color: "cyan",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 hover:scale-105"
              >
                {/* Neon border effect on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r 
                  ${item.color === "blue" ? "from-blue-500 to-purple-600" : 
                   item.color === "green" ? "from-green-500 to-emerald-600" : 
                   "from-cyan-500 to-blue-600"} blur-xl`}>
                </div>
                
                <div className="relative z-10 p-6">
                  <div className="h-48 overflow-hidden rounded-lg mb-6">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mt-4 group-hover:text-yellow-400 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mt-3 line-clamp-3">
                    {item.desc}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <span className="inline-block px-4 py-2 bg-gray-800 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Explore Button */}
          <div className="flex justify-center mt-16">
            <VoltageButton to="/store">
              Explore All Products
            </VoltageButton>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned with Hexagon Icons */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-grid.png')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white">Why <span className="text-yellow-400">Choose Us</span></h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mt-2"></div>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              GamingHive offers a unique gaming ecosystem with premium features and an active community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Multiplayer Fun",
                desc: "Team up with friends or challenge players worldwide in our competitive tournaments with real-time matchmaking.",
                iconPath:
                  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                color: "purple",
              },
              {
                title: "Exciting Rewards",
                desc: "Earn exclusive prizes, limited-edition items, and unlock special challenges as you progress through our reward system.",
                iconPath:
                  "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
                color: "yellow",
              },
              {
                title: "24/7 Support",
                desc: "Our dedicated support team is always available to help with any issues, questions, or feedback you might have.",
                iconPath:
                  "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
                color: "blue",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
              >
                {/* Glowing background */}
                <div className={`absolute inset-0 ${
                  feature.color === "purple" ? "bg-purple-900/20" : 
                  feature.color === "yellow" ? "bg-yellow-900/20" : 
                  "bg-blue-900/20"
                } rounded-xl`}></div>
                
                {/* Feature content */}
                <div className="relative p-8 border border-gray-800 rounded-xl bg-gradient-to-br from-gray-900 to-black">
                  {/* Hexagon icon */}
                  <div className={`relative w-24 h-24 mx-auto mb-8`}>
                    <div className={`absolute inset-0 ${
                      feature.color === "purple" ? "bg-purple-500" : 
                      feature.color === "yellow" ? "bg-yellow-500" : 
                      "bg-blue-500"
                    } opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-opacity`}></div>
                    <div className={`absolute inset-0 ${
                      feature.color === "purple" ? "bg-purple-600" : 
                      feature.color === "yellow" ? "bg-yellow-600" : 
                      "bg-blue-600"
                    } clip-path-hexagon flex items-center justify-center`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.iconPath}
                    />
                  </svg>
                </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white text-center mb-4 group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments Section - Redesigned with Card Effects */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/Home/controller-pattern.png')] bg-repeat opacity-5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white">Upcoming <span className="text-yellow-400">Tournaments</span></h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mt-2"></div>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              Compete with players worldwide and win amazing prizes in our carefully curated tournaments
            </p>
          </div>

          {tournamentsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : tournamentsError ? (
            <div className="text-center text-red-500">{tournamentsError}</div>
          ) : tournaments.length === 0 ? (
            <div className="text-center text-gray-400">No upcoming tournaments at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tournaments.map((tournament, index) => (
                <Link
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                  className="group relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 hover:scale-105"
                >
                  {/* Glowing border effect on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-${['purple', 'yellow', 'blue'][index % 3]}-500 to-${['blue', 'orange', 'cyan'][index % 3]}-600 blur-xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                      <img
                        src={tournament.imageUrl}
                        alt={tournament.gameName}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=Tournament';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold rounded-full px-3 py-1 text-xs z-20">
                        ${tournament.registrationFee}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                        {tournament.gameName}
                      </h3>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(tournament.dateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{tournament.numberOfPlayers} Players</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span>{tournament.prize}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex">
                        <span className="w-full text-center py-2 bg-gray-800 rounded-full text-sm font-medium text-white group-hover:bg-gray-700 transition-colors">
                          View Tournament →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Tournaments Button */}
          <div className="flex justify-center mt-12">
            <VoltageButton to="/tournaments">
              View All Tournaments
            </VoltageButton>
          </div>
        </div>
      </section>

      {/* News Section - Redesigned with Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/src/assets/Home/code-pattern.png')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white">Latest <span className="text-yellow-400">News</span></h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mt-2"></div>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news, releases, and updates from the gaming world
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => (
                <Link 
                  key={news._id} 
                  to={`/news/${news._id}`}
                  className="group relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 hover:scale-105"
                >
                  {/* Glowing border effect on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-${['cyan', 'purple', 'yellow'][index % 3]}-500 to-${['blue', 'pink', 'orange'][index % 3]}-600 blur-xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=News';
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-yellow-500 text-black font-bold rounded-full px-3 py-1 text-xs z-20">
                        {new Date(news.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-300 line-clamp-3">
                        {news.content}
                      </p>
                      
                      <div className="mt-6 flex">
                        <span className="w-full text-center py-2 bg-gray-800 rounded-full text-sm font-medium text-white group-hover:bg-gray-700 transition-colors">
                          Read Article →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All News Button */}
          <div className="flex justify-center mt-12">
            <VoltageButton to="/news">
              View All News
            </VoltageButton>
          </div>
        </div>
      </section>

      {/* Newsletter Section - New Addition */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/grid-pattern.png')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-r from-gray-900 to-black p-10 rounded-2xl border border-gray-800 relative overflow-hidden">
            {/* Glowing effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-yellow-500 to-cyan-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white">Join Our <span className="text-yellow-400">Newsletter</span></h2>
                <p className="mt-4 text-gray-300">
                  Get exclusive gaming news, tournament updates, and special offers delivered directly to your inbox.
                </p>
                <ul className="mt-6 space-y-2">
                  {["Exclusive gaming deals", "Early access to tournaments", "Special event invitations"].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-xl border border-gray-800">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all"
                      >
                        Subscribe Now
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      By subscribing, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;