import React, { useState, useEffect } from "react";
import { getCurrentUserProfile, updateUserProfile, getMyOrders, getUserTournamentHistory } from "../../utils/api";
import Swal from 'sweetalert2';
import { FaUser, FaKey, FaHistory, FaShoppingBag, FaGamepad, FaTrophy, FaBoxOpen, FaCalendarAlt, FaEnvelope, FaCog, FaClipboardList } from 'react-icons/fa';

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Purchase history state
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  
  // Tournament history state
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [tournamentError, setTournamentError] = useState(null);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found in localStorage");
          setError("You are not logged in. Please log in to view your profile.");
          setLoading(false);
          return;
        }
        
        console.log("Attempting to fetch user profile with token:", token.substring(0, 10) + "...");
        
        const response = await getCurrentUserProfile();
        console.log("Profile API response:", response);
        
        const userData = response.data;
        
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        
        // Set profile picture if available
        if (userData.profilePicture) {
          setPreviewImage(`http://localhost:5000${userData.profilePicture}`);
        }
        
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        // More detailed error logging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          
          if (error.response.status === 401) {
            setError("Authentication error. Please log in again.");
          } else {
            setError(`Server error: ${error.response.data.message || error.response.status}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          setError("No response from server. Please check your connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
          setError(`Error: ${error.message}`);
        }
        
        // Show error toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to load profile',
          text: error.response?.data?.message || 'Please try again later',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f44336',
          color: 'white',
          iconColor: 'white'
        });
        
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Fetch purchase history when the purchases tab is active
  useEffect(() => {
    if (activeTab === "purchases") {
      fetchPurchaseHistory();
    }
  }, [activeTab]);

  // Fetch tournament history when the tournaments tab is active
  useEffect(() => {
    if (activeTab === "tournaments") {
      fetchTournamentHistory();
    }
  }, [activeTab]);

  // Function to fetch purchase history
  const fetchPurchaseHistory = async () => {
    try {
      setLoadingOrders(true);
      setOrderError(null);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setOrderError("You are not logged in. Please log in to view your purchase history.");
        setLoadingOrders(false);
        return;
      }
      
      console.log("Fetching purchase history...");
      const response = await getMyOrders();
      console.log("Orders API response:", response);
      
      // Format the order data for display
      const formattedOrders = response.data.map(order => ({
        id: order._id,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        total: order.totalPrice,
        status: order.status,
        items: order.orderItems.map(item => ({
          name: item.name,
          price: item.price,
          type: item.type,
          platform: item.platform
        }))
      }));
      
      setPurchaseHistory(formattedOrders);
      setLoadingOrders(false);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      
      // Set error message
      setOrderError("Failed to load purchase history. Please try again later.");
      
      // Show error toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to load purchase history',
        text: error.response?.data?.message || 'Please try again later',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#f44336',
        color: 'white',
        iconColor: 'white'
      });
      
      setLoadingOrders(false);
    }
  };

  // Function to fetch tournament history
  const fetchTournamentHistory = async () => {
    try {
      setLoadingTournaments(true);
      setTournamentError(null);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setTournamentError("You are not logged in. Please log in to view your tournament history.");
        setLoadingTournaments(false);
        return;
      }
      
      console.log("Fetching tournament history...");
      const response = await getUserTournamentHistory();
      console.log("Tournament API response:", response);
      
      setTournamentHistory(response.data);
      setLoadingTournaments(false);
    } catch (error) {
      console.error("Error fetching tournament history:", error);
      
      // Set error message
      setTournamentError("Failed to load tournament history. Please try again later.");
      
      // Show error toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to load tournament history',
        text: error.response?.data?.message || 'Please try again later',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#f44336',
        color: 'white',
        iconColor: 'white'
      });
      
      setLoadingTournaments(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      
      // Show image selected toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'New profile image selected',
        text: 'Save changes to update your profile picture',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#2196f3',
        color: 'white',
        iconColor: 'white'
      });
    }
  };

  const validateForm = () => {
    if (passwordMode) {
      // If changing password
      if (!currentPassword) {
        // Show error toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Current password is required',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f44336',
          color: 'white',
          iconColor: 'white'
        });
        return false;
      }
      
      if (newPassword !== confirmPassword) {
        // Show error toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'New passwords do not match',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f44336',
          color: 'white',
          iconColor: 'white'
        });
        return false;
      }
      
      if (newPassword.length < 6) {
        // Show error toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'New password must be at least 6 characters',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f44336',
          color: 'white',
          iconColor: 'white'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append("username", username);
      
      // Track what changes are being made for toast notifications
      const changes = [];
      
      if (username) {
        changes.push('username');
      }
      
      if (passwordMode && currentPassword && newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
        changes.push('password');
      }
      
      if (profileImage) {
        formData.append("profilePicture", profileImage);
        changes.push('profile picture');
      }
      
      const response = await updateUserProfile(formData);
      
      // Build success message based on what was updated
      let successMessage = 'Profile updated successfully!';
      if (changes.length > 0) {
        successMessage = `Updated: ${changes.join(', ')}`;
      }
      
      // Show success toast with custom styling
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: successMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#4caf50',
        color: 'white',
        iconColor: 'white',
        customClass: {
          popup: 'animated fadeInRight'
        }
      });
      
      // Reset password fields after successful update
      if (passwordMode) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMode(false);
        
        // Show specific password updated toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Password updated successfully',
          text: 'Your password has been changed',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#4caf50',
          color: 'white',
          iconColor: 'white',
          customClass: {
            popup: 'animated fadeInRight'
          }
        });
      }
      
      // Reset profile image state
      setProfileImage(null);
      
      setSubmitting(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Show error toast with specific message
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('password')) {
          errorMessage = 'Current password is incorrect';
        } else {
          errorMessage = error.response.data.message;
        }
      }
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: errorMessage,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#f44336',
        color: 'white',
        iconColor: 'white'
      });
      
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-yellow-500 text-xl mb-4">Error</div>
          <div className="text-white mb-6">{error}</div>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with enhanced design */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="mb-6">
            <div className="relative inline-block group">
              <img
                src={previewImage || "/images/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto border-2 border-yellow-500 shadow-lg shadow-yellow-500/20"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-300">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
                <FaCog className="text-yellow-500 text-xl" />
              </label>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{username}</span>
          </h1>
          <div className="text-gray-400 flex items-center justify-center text-sm md:text-base mb-4 bg-gray-900/30 rounded-full py-2 px-4 inline-flex">
            <FaEnvelope className="mr-2 text-yellow-500" />
            {email}
          </div>
        </div>
      </div>

      {/* Tab Navigation - with improved design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-wrap text-sm sm:text-base font-medium">
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`flex items-center py-4 px-4 sm:px-8 transition-all duration-300 ${
                activeTab === "profile" 
                  ? "bg-yellow-500 text-black font-bold" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <FaUser className="mr-2 text-lg" />
              Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab("purchases")} 
              className={`flex items-center py-4 px-4 sm:px-8 transition-all duration-300 ${
                activeTab === "purchases" 
                  ? "bg-yellow-500 text-black font-bold" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <FaClipboardList className="mr-2 text-lg" />
              Purchase History
            </button>
            <button 
              onClick={() => setActiveTab("tournaments")} 
              className={`flex items-center py-4 px-4 sm:px-8 transition-all duration-300 ${
                activeTab === "tournaments" 
                  ? "bg-yellow-500 text-black font-bold" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <FaTrophy className="mr-2 text-lg" />
              Tournament History
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - with improved spacing and styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-xl p-6 sm:p-8 md:p-10 mt-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center border-b border-gray-800 pb-4">
                <FaUser className="mr-3 text-yellow-500" />
                Edit Profile
              </h2>
        
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === "success" ? "bg-green-600/30 text-green-200 border border-green-500/50" : "bg-red-600/30 text-red-200 border border-red-500/50"
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture */}
                <div className="text-center bg-gray-900/30 p-6 rounded-xl border border-gray-800">
                  <div className="mb-4">
                    <img
                      src={previewImage || "/images/default-avatar.png"}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto border-2 border-yellow-500"
                    />
                  </div>
                  <label className="text-yellow-500 cursor-pointer hover:text-yellow-400 inline-block bg-gray-800 px-6 py-3 rounded-lg transition-colors duration-300 font-medium">
                    Change Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={submitting}
                    />
                  </label>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className="block text-gray-300 mb-1 flex items-center">
                    <FaEnvelope className="mr-2 text-yellow-500" />
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 flex items-center overflow-x-auto text-sm sm:text-base">
                    {email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Contact support to change your email address</p>
                </div>

                {/* Password Mode Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordToggle"
                    checked={passwordMode}
                    onChange={() => setPasswordMode(!passwordMode)}
                    className="mr-2 h-5 w-5 accent-yellow-500"
                    disabled={submitting}
                  />
                  <label htmlFor="passwordToggle" className="text-gray-300 cursor-pointer">
                    Change Password
                  </label>
                </div>

                {/* Password Fields - Only shown when in password mode */}
                {passwordMode && (
                  <div className="space-y-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <FaKey className="mr-2 text-yellow-500" />
                      Password Change
                    </h3>
                    
                    {/* Current Password */}
                    <div>
                      <label className="block text-gray-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={submitting}
                      />
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label className="block text-gray-300 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={submitting}
                      />
                    </div>
                    
                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-gray-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                          newPassword && confirmPassword && newPassword !== confirmPassword
                            ? "border-2 border-red-500"
                            : ""
                        }`}
                        disabled={submitting}
                      />
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full ${
                    submitting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500"
                  } text-black font-bold py-3 rounded-lg transition duration-300 flex justify-center items-center`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "purchases" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center border-b border-gray-800 pb-4">
                <FaShoppingBag className="mr-3 text-yellow-500" />
                Purchase History
              </h2>
              
              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : orderError ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
                  <FaHistory className="mx-auto text-4xl text-gray-600 mb-3" />
                  <p className="text-xl text-gray-400">{orderError}</p>
                </div>
              ) : purchaseHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
                  <FaShoppingBag className="mx-auto text-4xl text-gray-600 mb-3" />
                  <p className="text-xl text-gray-400">You haven't made any purchases yet</p>
                  <p className="text-gray-500 mt-2">Your purchase history will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                      <div className="bg-gray-900 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Order ID</p>
                          <p className="text-white font-medium text-sm sm:text-base">{purchase.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Date</p>
                          <p className="text-white font-medium text-sm sm:text-base">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Status</p>
                          <p className="text-green-500 font-medium text-sm sm:text-base">{purchase.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Total</p>
                          <p className="text-yellow-500 font-bold text-sm sm:text-base">{purchase.total.toFixed(2)} JOD</p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Items</h4>
                        <div className="space-y-3">
                          {purchase.items.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-2 border-b border-gray-800 last:border-0">
                              <div className="flex items-center">
                                {item.type === 'digital' ? (
                                  <FaGamepad className="text-yellow-500 mr-3" />
                                ) : (
                                  <FaBoxOpen className="text-yellow-500 mr-3" />
                                )}
                                <div>
                                  <p className="text-white text-sm sm:text-base">{item.name}</p>
                                  {item.platform && (
                                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                                      {item.platform}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-yellow-500 font-medium text-sm sm:text-base">{item.price.toFixed(2)} JOD</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tournaments" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center border-b border-gray-800 pb-4">
                <FaTrophy className="mr-3 text-yellow-500" />
                Tournament History
              </h2>
              
              {loadingTournaments ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : tournamentError ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
                  <FaTrophy className="mx-auto text-4xl text-gray-600 mb-3" />
                  <p className="text-xl text-gray-400">{tournamentError}</p>
                </div>
              ) : tournamentHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
                  <FaTrophy className="mx-auto text-4xl text-gray-600 mb-3" />
                  <p className="text-xl text-gray-400">You haven't participated in any tournaments yet</p>
                  <p className="text-gray-500 mt-2">Join a tournament to see your history here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tournamentHistory.map((tournament) => (
                    <div key={tournament.id} className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <FaGamepad className="text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm sm:text-base">{tournament.name}</h4>
                          <div className="flex items-center mt-1">
                            <FaCalendarAlt className="text-gray-500 mr-1" />
                            <span className="text-gray-400 text-xs sm:text-sm">{new Date(tournament.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-300 text-xs sm:text-sm mt-1">{tournament.game}</p>
                        </div>
                      </div>
                      <div className="md:text-right">
                        <p className="text-white font-medium text-sm sm:text-base">{tournament.position}</p>
                        {tournament.prize && (
                          <p className="text-yellow-500 text-sm sm:text-base">{tournament.prize}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
