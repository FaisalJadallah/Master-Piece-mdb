import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaUserAlt, FaUserShield, FaLock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFF7D1]">User Management</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Joined</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="p-3 flex items-center gap-2">
                        <FaUserAlt className="text-gray-400" />
                        {user.username}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openRoleModal(user)}
                            className="p-2 text-blue-400 hover:text-blue-300"
                            title="Change Role"
                          >
                            <FaUserShield />
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(user)}
                            disabled={user.role === 'admin'}
                            className={user.role === 'admin' ? 'p-2 text-gray-500 cursor-not-allowed' : 'p-2 text-red-400 hover:text-red-300'}
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
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-700 hover:bg-purple-600 text-white'
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
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
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
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-700 hover:bg-purple-600 text-white'
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#FFF7D1] mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete user <span className="font-bold">{userToDelete.username}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && userToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#FFF7D1] mb-4">Change User Role</h2>
            <p className="mb-4">
              Change role for <span className="font-bold">{userToUpdate.username}</span>
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => updateUserRole('user')}
                className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                  userToUpdate.role === 'user' ? 'bg-blue-700 border-2 border-blue-500' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FaUserAlt /> User
              </button>
              <button
                onClick={() => updateUserRole('admin')}
                className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                  userToUpdate.role === 'admin' ? 'bg-red-700 border-2 border-red-500' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <FaUserShield /> Admin
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
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