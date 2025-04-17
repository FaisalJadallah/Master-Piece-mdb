import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaTrophy, FaGamepad } from 'react-icons/fa';

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-600 text-white p-4 rounded-lg text-center">
            {error}
          </div>
          <div className="mt-4 text-center">
            <Link to="/tournaments" className="text-purple-400 hover:underline">
              Back to tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800 p-8 rounded-lg">
            <p className="text-xl">Tournament not found</p>
            <div className="mt-4">
              <Link to="/tournaments" className="text-purple-400 hover:underline">
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/tournaments" className="flex items-center text-purple-400 hover:text-purple-300">
            <FaArrowLeft className="mr-2" />
            Back to Tournaments
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Tournament Header */}
          <div className="relative">
            {tournament.imageUrl && (
              <div className="w-full h-48 md:h-64 overflow-hidden">
                <img 
                  src={tournament.imageUrl} 
                  alt={tournament.gameName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x400?text=Tournament';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-[#FFF7D1] drop-shadow-lg">
                {tournament.gameName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#8B5DFF] rounded-full text-sm font-medium">
                  <FaGamepad className="inline mr-1" /> Game Tournament
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tournament.status === 'upcoming' ? 'bg-blue-600' :
                  tournament.status === 'ongoing' ? 'bg-green-600' :
                  'bg-gray-600'
                }`}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <FaCalendarAlt className="text-purple-400 mr-3 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="font-medium">{formatDate(tournament.dateTime)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-purple-400 mr-3 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Players</p>
                  <p className="font-medium">{tournament.numberOfPlayers}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaTrophy className="text-purple-400 mr-3 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Prize</p>
                  <p className="font-medium">{tournament.prize}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#FFF7D1] mb-4">About This Tournament</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{tournament.description}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Registration Fee</h3>
                  <p className="text-2xl font-bold text-[#FFF7D1]">${registrationFee.toFixed(2)}</p>
                </div>
                <button
                  onClick={handleRegister}
                  className="px-6 py-3 bg-[#8B5DFF] hover:bg-[#6A42C2] rounded-lg font-bold transition-colors duration-200"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails; 