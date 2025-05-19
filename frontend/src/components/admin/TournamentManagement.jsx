import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUsers, FaTrophy, FaCalendarAlt, FaMoneyBillWave, FaGamepad } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FileUploader from './FileUploader';

const API_URL = 'http://localhost:5000';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTournament, setCurrentTournament] = useState(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [formData, setFormData] = useState({
    gameName: '',
    imageUrl: '',
    description: '',
    numberOfPlayers: 2,
    dateTime: '',
    prize: '',
    registrationFee: 10,
    status: 'upcoming'
  });
  // Get today's date in YYYY-MM-DDThh:mm format for the min attribute
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().slice(0, 16);

  // Fetch tournaments on component mount
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tournaments`);
      setTournaments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tournaments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPlayers' || name === 'registrationFee' ? parseInt(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      gameName: '',
      imageUrl: '',
      description: '',
      numberOfPlayers: 2,
      dateTime: '',
      prize: '',
      registrationFee: 10,
      status: 'upcoming'
    });
    setCurrentTournament(null);
  };

  const handleEdit = (tournament) => {
    setCurrentTournament(tournament);
    
    // Convert tournament date to local datetime format
    let tournamentDate = new Date(tournament.dateTime);
    let formattedDate = tournamentDate.toISOString().slice(0, 16);
    
    // If the tournament date is in the past, set it to today's date
    const now = new Date();
    if (tournamentDate < now) {
      formattedDate = minDate;
    }
    
    setFormData({
      gameName: tournament.gameName,
      imageUrl: tournament.imageUrl,
      description: tournament.description || '',
      numberOfPlayers: tournament.numberOfPlayers,
      dateTime: formattedDate,
      prize: tournament.prize,
      registrationFee: tournament.registrationFee || 10,
      status: tournament.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await axios.delete(`${API_URL}/tournaments/${id}`);
        setTournaments(tournaments.filter(t => t._id !== id));
      } catch (err) {
        setError('Failed to delete tournament');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that the selected date is not in the past
    const selectedDate = new Date(formData.dateTime);
    const currentDate = new Date();
    
    if (selectedDate < currentDate) {
      setError('Tournament date cannot be in the past. Please select a future date and time.');
      return;
    }
    
    try {
      if (currentTournament) {
        // Update existing tournament
        await axios.put(`${API_URL}/tournaments/${currentTournament._id}`, formData);
      } else {
        // Create new tournament
        await axios.post(`${API_URL}/tournaments`, formData);
      }
      fetchTournaments();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to save tournament');
      console.error(err);
    }
  };

  const handleFileUploaded = (fileUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: fileUrl
    }));
    setShowImageUploader(false);
  };

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
                <FaTrophy className="text-yellow-500 text-2xl mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Tournament Management
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
              <FaPlus /> {showForm ? "Cancel" : "Add Tournament"}
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
              <FaGamepad className="text-yellow-500 mr-2" />
              {currentTournament ? "Edit Tournament" : "Create Tournament"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Game Name</label>
                  <input
                    type="text"
                    name="gameName"
                    value={formData.gameName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Tournament Image</label>
                  {showImageUploader ? (
                    <FileUploader onFileUploaded={handleFileUploaded} />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                          placeholder="Enter image URL or upload an image"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowImageUploader(true)}
                          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          Upload
                        </button>
                      </div>
                      {formData.imageUrl && (
                        <div className="mt-2 border border-gray-700 rounded-lg p-2 inline-block">
                          <img
                            src={formData.imageUrl}
                            alt="Tournament"
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    rows="4"
                    placeholder="Provide details about the tournament, rules, etc."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Number of Players</label>
                  <input
                    type="number"
                    name="numberOfPlayers"
                    value={formData.numberOfPlayers}
                    onChange={handleInputChange}
                    min="2"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    disabled={currentTournament}
                    title={currentTournament ? "Player limit cannot be changed after creation" : ""}
                  />
                  {currentTournament && (
                    <p className="text-sm text-gray-400 mt-1">
                      Current participants: {currentTournament.participants?.length || 0} / {currentTournament.numberOfPlayers}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <FaCalendarAlt className="text-yellow-500 mr-2" /> Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <FaTrophy className="text-yellow-500 mr-2" /> Prize
                  </label>
                  <input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    placeholder="E.g., $1000, Gaming PC, etc."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <FaMoneyBillWave className="text-yellow-500 mr-2" /> Registration Fee
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300"
                >
                  {currentTournament ? "Update Tournament" : "Create Tournament"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <FaTrophy className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-xl text-white mb-2">No tournaments found</p>
            <p className="text-gray-400 mb-8">
              Click the "Add Tournament" button to create your first tournament
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              <FaPlus /> Add Tournament
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="p-4 text-left text-gray-300 font-medium">Game</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Players</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Date & Time</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Prize</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                    <th className="p-4 text-center text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((tournament, index) => (
                    <tr key={tournament._id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-gray-700 overflow-hidden flex-shrink-0">
                            <img
                              src={tournament.imageUrl}
                              alt={tournament.gameName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <span className="font-medium text-white">{tournament.gameName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`${
                          (tournament.participants?.length || 0) >= tournament.numberOfPlayers 
                            ? 'text-red-400' 
                            : 'text-green-400'
                        }`}>
                          {tournament.participants?.length || 0} / {tournament.numberOfPlayers}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(tournament.dateTime).toLocaleString()}
                      </td>
                      <td className="p-4 text-yellow-500 font-medium">{tournament.prize}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tournament.status === 'upcoming' ? 'bg-blue-900/50 text-blue-200 border border-blue-700' :
                          tournament.status === 'ongoing' ? 'bg-green-900/50 text-green-200 border border-green-700' :
                          'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(tournament)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <Link
                            to={`/admin/tournaments/${tournament._id}/participants`}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 rounded-lg transition-colors"
                            title="Manage Participants"
                          >
                            <FaUsers />
                          </Link>
                          <button
                            onClick={() => handleDelete(tournament._id)}
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

export default TournamentManagement; 