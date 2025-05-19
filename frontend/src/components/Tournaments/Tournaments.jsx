import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VoltageButton from "../common/VoltageButton";
import axios from "axios";

const TOURNAMENTS_PER_PAGE = 4;

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/tournaments");
        setTournaments(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to load tournaments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filtering logic
  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return tournament.status === "upcoming";
    if (filter === "Ongoing") return tournament.status === "ongoing";
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTournaments.length / TOURNAMENTS_PER_PAGE);
  const paginatedTournaments = filteredTournaments.slice(
    (currentPage - 1) * TOURNAMENTS_PER_PAGE,
    currentPage * TOURNAMENTS_PER_PAGE
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-black py-20">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Tournaments
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto my-6"></div>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              Compete in our high-stakes tournaments and prove your skills against the best players
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg text-center my-10">
            <p className="text-xl">{error}</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-400 mt-4">No tournaments available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Available Tournaments</h2>
              <div className="flex space-x-2">
                {['All', 'Upcoming', 'Ongoing'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg text-white transition font-semibold focus:outline-none ${
                      filter === type
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {paginatedTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Tournament Image */}
                    <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                      <img
                        src={tournament.imageUrl}
                        alt={tournament.gameName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=Tournament';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tournament.status === "upcoming" ? "bg-blue-500 text-white" :
                          tournament.status === "ongoing" ? "bg-green-500 text-white" :
                          "bg-gray-500 text-white"
                        }`}>
                          {tournament.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tournament Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {tournament.gameName}
                          </h3>
                          <div className="flex items-center text-yellow-500 mb-4">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">Prize: {tournament.prize}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-yellow-500 text-black font-bold rounded-lg px-4 py-2">
                            ${tournament.registrationFee}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-300">{formatDate(tournament.dateTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-300">{tournament.numberOfPlayers} Players</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Link to={`/tournaments/${tournament._id}`} className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
                          View Details
                        </Link>
                        {tournament.status === "upcoming" && (
                          <Link to={`/tournaments/${tournament._id}/checkout`} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors">
                            Register Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-l-lg bg-gray-800 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 font-semibold transition ${
                      currentPage === idx + 1
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-r-lg bg-gray-800 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
