import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTrophy, FaShoppingCart, FaArrowLeft, FaChartPie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { verifyAdmin, getAllUsers, getAllTournaments, getAllProducts } from '../../utils/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTournaments: 0, 
    totalProducts: 0,
    recentRegistrations: 0,
    revenue: 0,
  });
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Debug information
        const debugData = {
          hasToken: !!token,
          tokenFirstChars: token ? `${token.substring(0, 15)}...` : 'No token'
        };
        setDebugInfo(debugData);
        
        if (!token) {
          throw new Error('No authentication token found in localStorage');
        }
        
        console.log('Analytics: Starting data fetch process');
        
        // First try to verify admin status
        try {
          console.log('Verifying admin status first...');
          const verifyResponse = await verifyAdmin();
          console.log('Admin verification response:', verifyResponse.data);
          
          if (!verifyResponse.data.isAdmin) {
            throw new Error('User does not have admin privileges');
          }
        } catch (verifyErr) {
          console.error('Admin verification failed:', verifyErr);
          throw new Error(`Admin verification failed: ${verifyErr.response?.data?.message || verifyErr.message}`);
        }
        
        // Get user count with error handling
        let usersData = [];
        try {
          console.log('Fetching users data...');
          const usersResponse = await getAllUsers();
          console.log('Users response:', usersResponse.data);
          usersData = usersResponse.data;
        } catch (usersErr) {
          console.error('Error fetching users:', usersErr);
          setDebugInfo(prev => ({
            ...prev,
            usersError: usersErr.response?.data?.message || usersErr.message,
            usersStatus: usersErr.response?.status
          }));
        }
        
        // Get tournaments with error handling
        let tournamentsData = [];
        try {
          console.log('Fetching tournaments data...');
          const tournamentsResponse = await getAllTournaments();
          console.log('Tournaments response:', tournamentsResponse.data);
          tournamentsData = tournamentsResponse.data;
        } catch (tournamentsErr) {
          console.error('Error fetching tournaments:', tournamentsErr);
          setDebugInfo(prev => ({
            ...prev,
            tournamentsError: tournamentsErr.response?.data?.message || tournamentsErr.message,
            tournamentsStatus: tournamentsErr.response?.status
          }));
        }
        
        // Get products with error handling
        let productsData = [];
        try {
          console.log('Fetching products data...');
          const productsResponse = await getAllProducts();
          console.log('Products response:', productsResponse.data);
          productsData = productsResponse.data?.products || productsResponse.data || [];
        } catch (productsErr) {
          console.error('Error fetching products:', productsErr);
          setDebugInfo(prev => ({
            ...prev,
            productsError: productsErr.response?.data?.message || productsErr.message,
            productsStatus: productsErr.response?.status
          }));
        }
        
        // Set stats with any data we were able to get
        setStats({
          totalUsers: usersData.length || 0,
          totalTournaments: tournamentsData.length || 0,
          totalProducts: productsData.length || 0,
          recentRegistrations: 15, // Placeholder
          revenue: 12840, // Placeholder
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error in Analytics component:', err);
        setError(err.message || 'Failed to load analytics data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
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
                  <FaChartPie className="text-yellow-500 text-2xl mr-3" />
                  <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Analytics Dashboard
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold">{error}</p>
              <p className="mt-1">Please make sure you are logged in with admin privileges.</p>
            </div>
          </div>
          
          {debugInfo && (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl mt-4">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                <FaChartBar className="text-yellow-500 mr-2" />
                Debugging Information
              </h3>
              <pre className="text-xs bg-gray-800/80 p-4 rounded-lg overflow-auto border border-gray-700">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                <FaChartPie className="text-yellow-500 text-2xl mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Analytics Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Users</h2>
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                <FaUsers className="text-blue-400 text-2xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-gray-400 mt-2">Total registered users</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Tournaments</h2>
              <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                <FaTrophy className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalTournaments}</p>
            <p className="text-gray-400 mt-2">Total tournaments</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Products</h2>
              <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
                <FaShoppingCart className="text-green-500 text-2xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalProducts}</p>
            <p className="text-gray-400 mt-2">Store items</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Revenue</h2>
              <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                <FaChartBar className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-500">${stats.revenue}</p>
            <p className="text-gray-400 mt-2">Monthly revenue</p>
          </div>
        </div>
        
        {/* Additional Analytics Charts would go here */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <FaChartBar className="text-yellow-500 mr-2" />
            Recent Activity
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">User Registrations</h3>
              <div className="h-40 flex items-end justify-between gap-1">
                {[35, 45, 25, 60, 75, 45, 65].map((height, index) => (
                  <div key={index} className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-sm" style={{ height: `${height}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">Revenue Distribution</h3>
              <div className="flex items-center justify-center h-40">
                <div className="w-full flex gap-2">
                  <div className="w-1/3 bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-black">45%</div>
                      <div className="text-xs text-black">Store</div>
                    </div>
                  </div>
                  <div className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-600 h-3/4 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">35%</div>
                      <div className="text-xs text-white">Tournaments</div>
                    </div>
                  </div>
                  <div className="w-1/3 bg-gradient-to-r from-green-500 to-green-600 h-1/2 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">20%</div>
                      <div className="text-xs text-white">Other</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-6">
            Analytics functionality is currently being developed. More detailed charts and metrics will be available soon.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <FaChartPie className="text-yellow-500 mr-2" />
            Development Notes
          </h2>
          <div className="text-gray-300">
            <p>This is a placeholder analytics dashboard. To implement full analytics:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li className="hover:text-yellow-500 transition-colors">Create backend analytics endpoints</li>
              <li className="hover:text-yellow-500 transition-colors">Implement data collection for user activities</li>
              <li className="hover:text-yellow-500 transition-colors">Add charting libraries for visual representation</li>
              <li className="hover:text-yellow-500 transition-colors">Set up real-time data updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 