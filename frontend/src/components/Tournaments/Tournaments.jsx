import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#FFF7D1] mb-10">
          Gaming Tournaments
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-600 text-white p-4 rounded-lg text-center">
            {error}
          </div>
        ) : tournaments.length === 0 ? (
          <p className="text-center text-gray-300">No tournaments available.</p>
        ) : (
          <div className="space-y-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament._id}
                className="bg-[#6A42C2] p-5 rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center hover:transform hover:scale-[1.01] transition-all duration-200"
              >
                {tournament.imageUrl && (
                  <img
                    src={tournament.imageUrl}
                    alt={tournament.gameName}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=Game";
                    }}
                  />
                )}
                <div className="flex-1">
                  <Link to={`/tournaments/${tournament._id}`}>
                    <h3 className="text-2xl font-semibold text-[#FFF7D1] hover:underline">
                      {tournament.gameName}
                    </h3>
                  </Link>
                  <p className="text-sm mt-1">
                    📅 {formatDate(tournament.dateTime)}
                  </p>
                  <p className="text-sm">👥 Players: {tournament.numberOfPlayers}</p>
                  <p className="text-sm">🏆 Prize: {tournament.prize}</p>
                  <p className="text-sm">💰 Fee: ${tournament.registrationFee || 10}</p>

                  {tournament.status === "upcoming" && (
                    <div className="mt-3">
                      <Link
                        to={`/tournaments/${tournament._id}/checkout`}
                        className="inline-block bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      tournament.status === "upcoming"
                        ? "bg-blue-900 text-blue-200"
                        : tournament.status === "ongoing"
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {tournament.status.charAt(0).toUpperCase() +
                      tournament.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
