import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaUserAlt, FaUserShield, FaLock, FaChevronLeft, FaChevronRight, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllUsers, updateUserRole as apiUpdateUserRole, deleteUser as apiDeleteUser } from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      
      // Check if token exists for debugging
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found when fetching users');
        setDebugInfo({
          error: 'No authentication token found',
          tokenExists: false
        });
      } else {
        setDebugInfo({
          tokenExists: true,
          tokenFirstChars: token.substring(0, 10) + '...'
        });
      }
      
      // Use the centralized API utility
      const response = await getAllUsers();
      console.log('Users API response:', response.data);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      
      // Enhance error information for debugging
      setDebugInfo(prev => ({
        ...prev,
        errorStatus: err.response?.status,
        errorMessage: err.response?.data?.message || err.message,
        errorDetail: err.stack
      }));
      
      setError('Failed to fetch users. Make sure you are logged in with admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      await apiDeleteUser(userToDelete._id);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(`Failed to delete user: ${err.response?.data?.message || err.message}`);
    }
  };

  const openRoleModal = (user) => {
    setUserToUpdate(user);
    setShowRoleModal(true);
  };

  const updateUserRole = async (role) => {
    if (!userToUpdate) return;

    try {
      const response = await apiUpdateUserRole(userToUpdate._id, role);
      setUsers(users.map(u => u._id === userToUpdate._id ? response.data : u));
      setShowRoleModal(false);
      setUserToUpdate(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update user role: ${err.response?.data?.message || err.message}`);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
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
                <FaUsers className="text-yellow-500 text-2xl mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  User Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-xl mb-6 flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <FaUsers className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-xl text-white mb-2">No users found</p>
            <p className="text-gray-400">
              There are no users registered in the system yet.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="p-4 text-left text-gray-300 font-medium">Username</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Email</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Role</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Joined</th>
                    <th className="p-4 text-center text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <FaUserAlt className={`${user.role === 'admin' ? 'text-yellow-500' : 'text-gray-400'}`} />
                          </div>
                          <span className="font-medium text-white">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700' 
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openRoleModal(user)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400 rounded-lg transition-colors"
                            title="Change Role"
                          >
                            <FaUserShield />
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(user)}
                            disabled={user.role === 'admin'}
                            className={user.role === 'admin' 
                              ? 'p-2 bg-gray-800 text-gray-500 cursor-not-allowed rounded-lg' 
                              : 'p-2 bg-gray-800 hover:bg-gray-700 text-red-500 hover:text-red-400 rounded-lg transition-colors'}
                            title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete User'}
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
            
            {/* Pagination Controls */}
            {users.length > usersPerPage && (
              <div className="px-4 py-5 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400'
                    }`}
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 rounded-md ${
                          currentPage === number
                            ? 'bg-yellow-600 text-black font-bold'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400'
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete user <span className="font-bold text-white">{userToDelete.username}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && userToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">Change User Role</h2>
            <p className="mb-6 text-gray-300">
              Change role for <span className="font-bold text-white">{userToUpdate.username}</span>
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => updateUserRole('user')}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  userToUpdate.role === 'user' 
                    ? 'bg-gray-800 border-2 border-gray-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <FaUserAlt className={userToUpdate.role === 'user' ? 'text-gray-300' : ''} /> User
              </button>
              <button
                onClick={() => updateUserRole('admin')}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  userToUpdate.role === 'admin' 
                    ? 'bg-yellow-600 border-2 border-yellow-500 text-black' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <FaUserShield className={userToUpdate.role === 'admin' ? 'text-black' : ''} /> Admin
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
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

export default UserManagement; 