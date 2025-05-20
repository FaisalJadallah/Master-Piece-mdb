import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaUserAlt, FaUserShield, FaLock, FaChevronLeft, FaChevronRight, FaUsers, FaEllipsisV } from 'react-icons/fa';
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
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeActionMenu) {
        setActiveActionMenu(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeActionMenu]);

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

  const toggleActionMenu = (e, id) => {
    e.stopPropagation();
    setActiveActionMenu(activeActionMenu === id ? null : id);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-6 sm:py-8 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/admin" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <FaArrowLeft />
              </Link>
              <div className="flex items-center">
                <FaUsers className="text-yellow-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  User Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-2 sm:mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 sm:p-12 text-center shadow-xl">
            <div className="bg-gray-800/50 w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <FaUsers className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-lg sm:text-xl text-white mb-2">No users found</p>
            <p className="text-gray-400 text-sm sm:text-base">
              There are no users registered in the system yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden sm:block bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
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
                          {formatDate(user.createdAt)}
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
              
              {/* Pagination Controls - Desktop */}
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

            {/* Mobile card view */}
            <div className="sm:hidden space-y-4">
              {currentUsers.map((user) => (
                <div key={user._id} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <FaUserAlt className={`${user.role === 'admin' ? 'text-yellow-500' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{user.username}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700' 
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleActionMenu(e, user._id)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaEllipsisV className="text-gray-400" />
                      </button>
                      
                      {activeActionMenu === user._id && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-36 overflow-hidden animate-fadeIn">
                          <button
                            onClick={() => {
                              openRoleModal(user);
                              setActiveActionMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 text-left text-sm"
                          >
                            <FaUserShield className="text-yellow-500" /> Change Role
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => {
                                confirmDeleteUser(user);
                                setActiveActionMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 text-left text-sm"
                            >
                              <FaTrash className="text-red-500" /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Email:</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Joined:</p>
                      <p className="text-white">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls - Mobile */}
              {users.length > usersPerPage && (
                <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-400">
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
                      <FaChevronLeft size={12} />
                    </button>
                    
                    <span className="text-sm text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 hover:bg-gray-700 text-yellow-500 hover:text-yellow-400'
                      }`}
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 sm:mb-4">Confirm Deletion</h2>
            <p className="mb-4 sm:mb-6 text-gray-300 text-sm sm:text-base">
              Are you sure you want to delete user <span className="font-bold text-white">{userToDelete.username}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && userToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 sm:mb-4">Change User Role</h2>
            <p className="mb-4 sm:mb-6 text-gray-300 text-sm sm:text-base">
              Change role for <span className="font-bold text-white">{userToUpdate.username}</span>
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => updateUserRole('user')}
                className={`p-3 sm:p-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                  userToUpdate.role === 'user' 
                    ? 'bg-gray-800 border-2 border-gray-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <FaUserAlt className={userToUpdate.role === 'user' ? 'text-gray-300' : ''} /> User
              </button>
              <button
                onClick={() => updateUserRole('admin')}
                className={`p-3 sm:p-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
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