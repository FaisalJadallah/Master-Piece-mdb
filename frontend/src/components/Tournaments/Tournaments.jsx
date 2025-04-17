import React, { useState } from "react";

const Tournaments = () => {
  // بيانات وهمية للعرض
  const [tournaments] = useState([
    {
      name: "Champions League",
      date: "2025-05-20",
      players: 16,
      image: "/images/tournament1.jpg",
    },
    {
      name: "Battle Royale",
      date: "2025-06-15",
      players: 32,
      image: "/images/tournament2.jpg",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#FFF7D1] mb-10">
          Gaming Tournaments
        </h1>

        <div className="space-y-6">
          {tournaments.length === 0 ? (
            <p className="text-center text-gray-300">No tournaments available.</p>
          ) : (
            tournaments.map((t, index) => (
              <div
                key={index}
                className="bg-[#6A42C2] p-5 rounded-xl shadow-md flex gap-4 items-center"
              >
                {t.image && (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-semibold text-[#FFF7D1]">{t.name}</h3>
                  <p className="text-sm mt-1">📅 {t.date}</p>
                  <p className="text-sm">👥 Players: {t.players}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
