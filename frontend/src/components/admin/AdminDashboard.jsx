// src/pages/AdminDashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrophy, FaUsers, FaStore, FaChartBar, FaNewspaper, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-12 px-6">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaShieldAlt className="text-yellow-500 text-3xl mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all shadow-lg"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tournaments Card */}
          <Link to="/admin/tournaments" className="block group">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Tournaments</h2>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaTrophy className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <p className="text-gray-400 mb-6">Manage gaming tournaments, participants, and schedules</p>
              <div className="bg-yellow-500 hover:bg-yellow-400 py-3 px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20">
                Manage Tournaments
              </div>
            </div>
          </Link>
          
          {/* Users Card */}
          <Link to="/admin/users" className="block group">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Users</h2>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaUsers className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <p className="text-gray-400 mb-6">Manage user accounts, roles, and permissions</p>
              <div className="bg-yellow-500 hover:bg-yellow-400 py-3 px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20">
                Manage Users
              </div>
            </div>
          </Link>
          
          {/* Store Card */}
          <Link to="/admin/store" className="block group">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Store</h2>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaStore className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <p className="text-gray-400 mb-6">Manage digital products, inventory, and orders</p>
              <div className="bg-yellow-500 hover:bg-yellow-400 py-3 px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20">
                Manage Store
              </div>
            </div>
          </Link>
          
          {/* News Card */}
          <Link to="/admin/news" className="block group">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">News</h2>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaNewspaper className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <p className="text-gray-400 mb-6">Manage news articles, blog posts, and announcements</p>
              <div className="bg-yellow-500 hover:bg-yellow-400 py-3 px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20">
                Manage News
              </div>
            </div>
          </Link>
          
          {/* Analytics Card */}
          <Link to="/admin/analytics" className="block group">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Analytics</h2>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaChartBar className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <p className="text-gray-400 mb-6">View site statistics, user engagement, and sales data</p>
              <div className="bg-yellow-500 hover:bg-yellow-400 py-3 px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20">
                View Analytics
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
