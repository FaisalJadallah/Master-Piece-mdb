// src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTrophy, FaUsers, FaStore, FaChartBar, FaNewspaper } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FFF7D1] mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tournaments Card */}
          <Link to="/admin/tournaments" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tournaments</h2>
                <FaTrophy className="text-[#8B5DFF] text-2xl" />
              </div>
              <p className="text-gray-400 mb-4">Manage gaming tournaments</p>
              <div className="bg-[#8B5DFF] py-2 px-4 rounded-md text-center text-white">
                Manage
              </div>
            </div>
          </Link>
          
          {/* Users Card */}
          <Link to="/admin/users" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Users</h2>
                <FaUsers className="text-blue-500 text-2xl" />
              </div>
              <p className="text-gray-400 mb-4">Manage user accounts</p>
              <div className="bg-blue-600 py-2 px-4 rounded-md text-center text-white">
                Manage
              </div>
            </div>
          </Link>
          
          {/* Store Card */}
          <Link to="/admin/store" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Store</h2>
                <FaStore className="text-green-500 text-2xl" />
              </div>
              <p className="text-gray-400 mb-4">Manage digital products</p>
              <div className="bg-green-600 py-2 px-4 rounded-md text-center text-white">
                Manage
              </div>
            </div>
          </Link>
          
          {/* News Card */}
          <Link to="/admin/news" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">News</h2>
                <FaNewspaper className="text-purple-500 text-2xl" />
              </div>
              <p className="text-gray-400 mb-4">Manage news articles</p>
              <div className="bg-purple-600 py-2 px-4 rounded-md text-center text-white">
                Manage
              </div>
            </div>
          </Link>
          
          {/* Analytics Card */}
          <Link to="/admin/analytics" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Analytics</h2>
                <FaChartBar className="text-yellow-500 text-2xl" />
              </div>
              <p className="text-gray-400 mb-4">View site statistics</p>
              <div className="bg-yellow-600 py-2 px-4 rounded-md text-center text-white">
                View
              </div>
            </div>
          </Link>
        </div>
        
        {/* Quick Stats Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#FFF7D1]">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Active Users</h3>
              <p className="text-3xl font-bold">1,245</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Upcoming Tournaments</h3>
              <p className="text-3xl font-bold">7</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Revenue (Month)</h3>
              <p className="text-3xl font-bold">$12,840</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
