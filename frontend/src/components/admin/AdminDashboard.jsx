// src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-[#FFF7D1]">Admin Dashboard</h1>
      <Link
        to="/admin/tournaments"
        className="px-6 py-3 bg-[#8B5DFF] text-white rounded hover:bg-[#6A42C2]"
      >
        Manage Tournaments
      </Link>
    </div>
  );
};

export default AdminDashboard;
