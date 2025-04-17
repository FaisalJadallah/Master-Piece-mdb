import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../admin/AdminDashboard';
import TournamentManagement from '../admin/TournamentManagement';
import TournamentParticipants from '../admin/TournamentParticipants';
import UserManagement from '../admin/UserManagement';
import StoreManagement from '../admin/StoreManagement';
import FileUploader from '../admin/FileUploader';
import Analytics from '../admin/Analytics';
import { verifyAdmin } from '../../utils/api';

const AdminRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found in localStorage');
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        console.log('Verifying admin status with token');
        const response = await verifyAdmin();
        console.log('Admin verification response:', response.data);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Failed to verify admin status:', error.response?.data || error.message);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Verifying admin access...</div>
      </div>;
    }
    
    if (!isAdmin) {
      console.log('User is not an admin, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournaments"
        element={
          <ProtectedRoute>
            <TournamentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournaments/:id/participants"
        element={
          <ProtectedRoute>
            <TournamentParticipants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/store"
        element={
          <ProtectedRoute>
            <StoreManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <FileUploader />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes; 