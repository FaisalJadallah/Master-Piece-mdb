import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaTrophy, FaUserEdit } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const TournamentParticipants = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tournaments/${id}`);
        setTournament(response.data);
        setParticipants(response.data.participants || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tournament details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const updateParticipantStatus = async (participantId, newStatus) => {
    try {
      await axios.put(`${API_URL}/tournaments/${id}/participants`, {
        participantId,
        status: newStatus
      });

      // Update local state
      setParticipants(prevParticipants => 
        prevParticipants.map(p => 
          p._id === participantId ? { ...p, status: newStatus } : p
        )
      );

      setShowStatusModal(false);
    } catch (err) {
      alert('Failed to update participant status');
      console.error(err);
    }
  };

  const openStatusModal = (participant) => {
    setSelectedParticipant(participant);
    setShowStatusModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-600 text-white';
      case 'checked-in':
        return 'bg-green-600 text-white';
      case 'eliminated':
        return 'bg-red-600 text-white';
      case 'winner':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-600 text-white p-4 rounded-lg text-center">
            {error || "Tournament not found"}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin" className="text-purple-400 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/tournaments" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFF7D1]">
              {tournament.gameName} - Participants
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs ${
              tournament.status === 'upcoming' ? 'bg-blue-900 text-blue-200' :
              tournament.status === 'ongoing' ? 'bg-green-900 text-green-200' :
              'bg-gray-700 text-gray-300'
            }`}>
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </span>
            <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-xs">
              {participants.length} / {tournament.numberOfPlayers} Players
            </span>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">No participants have registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Gamer Tag</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Registered On</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant._id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{participant.fullName}</td>
                    <td className="p-3">{participant.gamerTag}</td>
                    <td className="p-3">{participant.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(participant.status)}`}>
                        {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(participant.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openStatusModal(participant)}
                          className="p-2 text-purple-400 hover:text-purple-300"
                          title="Update Status"
                        >
                          <FaUserEdit />
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

      {/* Status Update Modal */}
      {showStatusModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#FFF7D1] mb-4">
              Update Participant Status
            </h2>
            <p className="mb-4">
              Change status for <span className="font-bold">{selectedParticipant.fullName}</span> ({selectedParticipant.gamerTag})
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => updateParticipantStatus(selectedParticipant._id, 'checked-in')}
                className="p-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2"
              >
                <FaCheck /> Check In
              </button>
              <button
                onClick={() => updateParticipantStatus(selectedParticipant._id, 'eliminated')}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2"
              >
                <FaTimes /> Eliminate
              </button>
              <button
                onClick={() => updateParticipantStatus(selectedParticipant._id, 'winner')}
                className="p-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg flex items-center justify-center gap-2 col-span-2"
              >
                <FaTrophy /> Mark as Winner
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentParticipants; 