// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrophy, FaUsers, FaStore, FaChartBar, FaNewspaper, FaSignOutAlt, FaShieldAlt, FaBars, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const menuItems = [
    { title: "Tournaments", icon: FaTrophy, path: "/admin/tournaments", description: "Manage gaming tournaments, participants, and schedules" },
    { title: "Users", icon: FaUsers, path: "/admin/users", description: "Manage user accounts, roles, and permissions" },
    { title: "Store", icon: FaStore, path: "/admin/store", description: "Manage digital products, inventory, and orders" },
    { title: "News", icon: FaNewspaper, path: "/admin/news", description: "Manage news articles, blog posts, and announcements" },
    { title: "Analytics", icon: FaChartBar, path: "/admin/analytics", description: "View site statistics, user engagement, and sales data" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaShieldAlt className="text-yellow-500 text-2xl sm:text-3xl mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Admin Dashboard
              </h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
            
            {/* Desktop logout button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all shadow-lg text-sm sm:text-base"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-xl animate-slideIn">
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="text-yellow-500" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors mt-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Quick stats summary - mobile only */}
        <div className="md:hidden mb-6 grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <Link 
              key={item.path}
              to={item.path} 
              className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg border border-gray-800"
            >
              <item.icon className="text-yellow-500 text-xl mb-2" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Main dashboard cards - desktop/tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="block group">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 sm:p-6 rounded-xl shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold">{item.title}</h2>
                  <div className="p-2 sm:p-3 bg-gray-800 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                    <item.icon className="text-yellow-500 text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">{item.description}</p>
                <div className="bg-yellow-500 hover:bg-yellow-400 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center text-black font-bold transition-colors group-hover:shadow-md group-hover:shadow-yellow-500/20 text-sm sm:text-base">
                  Manage {item.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
