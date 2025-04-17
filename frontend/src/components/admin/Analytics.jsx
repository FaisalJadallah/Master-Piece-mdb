import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTrophy, FaShoppingCart } from 'react-icons/fa';
import { verifyAdmin, getAllUsers, getAllTournaments, getAllProducts } from '../../utils/api';

const Analytics = () => {
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
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <div className="text-xl">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#FFF7D1] mb-8">Analytics Dashboard</h1>
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-600 mb-4">
            <p className="text-xl">{error}</p>
            <p className="mt-2">Please make sure you are logged in with admin privileges.</p>
          </div>
          
          {debugInfo && (
            <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <h3 className="text-xl font-semibold mb-2">Debugging Information</h3>
              <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FFF7D1] mb-8">Analytics Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Users</h2>
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
            <p className="text-gray-400 mt-2">Total registered users</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tournaments</h2>
              <FaTrophy className="text-[#8B5DFF] text-2xl" />
            </div>
            <p className="text-4xl font-bold">{stats.totalTournaments}</p>
            <p className="text-gray-400 mt-2">Total tournaments</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Products</h2>
              <FaShoppingCart className="text-green-500 text-2xl" />
            </div>
            <p className="text-4xl font-bold">{stats.totalProducts}</p>
            <p className="text-gray-400 mt-2">Store items</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Revenue</h2>
              <FaChartBar className="text-yellow-500 text-2xl" />
            </div>
            <p className="text-4xl font-bold">${stats.revenue}</p>
            <p className="text-gray-400 mt-2">Monthly revenue</p>
          </div>
        </div>
        
        {/* Debug Info in Production */}
        {debugInfo && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Debug Info</h3>
              <button 
                onClick={() => setDebugInfo(null)} 
                className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                Hide
              </button>
            </div>
            <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto mt-2">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Additional Analytics Charts would go here */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-400">
            Analytics functionality is currently being developed. More detailed charts and metrics will be available soon.
          </p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Development Notes</h2>
          <div className="text-gray-400">
            <p>This is a placeholder analytics dashboard. To implement full analytics:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Create backend analytics endpoints</li>
              <li>Implement data collection for user activities</li>
              <li>Add charting libraries for visual representation</li>
              <li>Set up real-time data updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 