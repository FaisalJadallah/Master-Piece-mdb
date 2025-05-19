import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaTrophy, FaGamepad, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/tournaments/${id}`);
        setTournament(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tournament details. Please try again later.');
        setLoading(false);
        console.error('Error fetching tournament details:', err);
      }
    };

    fetchTournament();
  }, [id]);

  const handleRegister = () => {
    navigate(`/tournaments/${id}/checkout`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg text-center my-10">
            <p className="text-xl">{error}</p>
          </div>
          <div className="mt-4 text-center">
            <Link to="/tournaments" className="text-yellow-500 hover:text-yellow-400 font-medium">
              Back to tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900/80 border border-gray-800 p-8 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-400 mt-4">Tournament not found</p>
            <div className="mt-6">
              <Link to="/tournaments" className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
                Back to tournaments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use registration fee from the tournament data, or fall back to default
  const registrationFee = tournament.registrationFee || 10;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Tournament header image with overlay */}
        <div className="w-full h-[40vh] relative overflow-hidden">
          <img 
            src={tournament.imageUrl} 
            alt={tournament.gameName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1600x900?text=Tournament';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
          
          {/* Status badge */}
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              tournament.status === 'upcoming' ? 'bg-blue-500 text-white' :
              tournament.status === 'ongoing' ? 'bg-green-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {tournament.status.toUpperCase()}
            </span>
          </div>
          
          {/* Back button */}
          <div className="absolute top-6 left-6">
            <Link to="/tournaments" className="flex items-center bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full transition">
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Tournament Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 -mt-20 relative z-10">
        <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Tournament Title */}
          <div className="p-8 border-b border-gray-800">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {tournament.gameName}
            </h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-3 py-1 bg-purple-700 rounded-full text-sm font-medium">
                <FaGamepad className="inline mr-1" /> Game Tournament
              </span>
            </div>
          </div>

          {/* Tournament Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4">
                    <FaCalendarAlt className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="font-medium text-white">{formatDate(tournament.dateTime)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <FaUsers className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Players</p>
                    <p className="font-medium text-white">{tournament.numberOfPlayers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
                    <FaTrophy className="text-cyan-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Prize</p>
                    <p className="font-medium text-white">{tournament.prize}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">About This Tournament</h2>
              <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-800">
                <p className="text-gray-300 leading-relaxed">{tournament.description || "Join this exciting tournament and compete with players from around the world. Show your skills and win amazing prizes!"}</p>
              </div>
            </div>

            {/* Registration Section */}
            <div className="bg-gradient-to-r from-purple-900/30 to-black p-8 rounded-xl border border-purple-900/30 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold text-white">Ready to join?</h3>
                  <div className="flex items-center mt-2">
                    <FaMoneyBillWave className="text-yellow-500 mr-2" />
                    <p className="text-3xl font-bold text-yellow-500">${registrationFee.toFixed(2)}</p>
                  </div>
                  <p className="text-gray-400 mt-1">Registration fee</p>
                </div>
                
                {tournament.status === 'upcoming' ? (
                  <button
                    onClick={handleRegister}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors duration-200 w-full md:w-auto text-center"
                  >
                    Register Now
                  </button>
                ) : (
                  <div className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-bold w-full md:w-auto text-center">
                    Registration Closed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails; 