import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUsers } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFF7D1]">Tournament Management</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-[#8B5DFF] hover:bg-[#6A42C2] rounded-md flex items-center gap-2"
          >
            <FaPlus /> {showForm ? "Cancel" : "Add Tournament"}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {currentTournament ? "Edit Tournament" : "Create Tournament"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Game Name</label>
                  <input
                    type="text"
                    name="gameName"
                    value={formData.gameName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Tournament Image</label>
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
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                          placeholder="Enter image URL or upload an image"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowImageUploader(true)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                          Upload
                        </button>
                      </div>
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="Tournament"
                          className="w-20 h-20 object-cover rounded-md mt-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    rows="4"
                    placeholder="Provide details about the tournament, rules, etc."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Number of Players</label>
                  <input
                    type="number"
                    name="numberOfPlayers"
                    value={formData.numberOfPlayers}
                    onChange={handleInputChange}
                    min="2"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
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
                  <label className="block text-gray-400 mb-2">Date and Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    min={minDate}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Prize</label>
                  <input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                    placeholder="E.g., $1000, Gaming PC, etc."
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Registration Fee</label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  {currentTournament ? "Update Tournament" : "Create Tournament"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">No tournaments found</p>
            <p className="mt-2 text-gray-500">
              Click the "Add Tournament" button to create your first tournament
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Game</th>
                  <th className="p-3 text-left">Players</th>
                  <th className="p-3 text-left">Participants</th>
                  <th className="p-3 text-left">Date & Time</th>
                  <th className="p-3 text-left">Prize</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament) => (
                  <tr key={tournament._id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={tournament.imageUrl}
                          alt={tournament.gameName}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                        <span>{tournament.gameName}</span>
                      </div>
                    </td>
                    <td className="p-3">{tournament.numberOfPlayers}</td>
                    <td className="p-3">
                      <span className={`${
                        (tournament.participants?.length || 0) >= tournament.numberOfPlayers 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {tournament.participants?.length || 0} / {tournament.numberOfPlayers}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(tournament.dateTime).toLocaleString()}
                    </td>
                    <td className="p-3">{tournament.prize}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tournament.status === 'upcoming' ? 'bg-blue-900 text-blue-200' :
                        tournament.status === 'ongoing' ? 'bg-green-900 text-green-200' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(tournament)}
                          className="p-2 text-yellow-400 hover:text-yellow-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <Link
                          to={`/admin/tournaments/${tournament._id}/participants`}
                          className="p-2 text-blue-400 hover:text-blue-300"
                          title="Manage Participants"
                        >
                          <FaUsers />
                        </Link>
                        <button
                          onClick={() => handleDelete(tournament._id)}
                          className="p-2 text-red-400 hover:text-red-300"
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
        )}
      </div>
    </div>
  );
};

export default TournamentManagement; 