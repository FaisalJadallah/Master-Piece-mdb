import React, { useState, useEffect } from "react";
import { getCurrentUserProfile, updateUserProfile } from "../../utils/api";
import Swal from 'sweetalert2';

const Profile = () => {
  const [username, setUsername] = useState("");
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
      
      // Show success toast
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
        iconColor: 'white'
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
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#4caf50',
          color: 'white',
          iconColor: 'white'
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
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="bg-[#563A9C] rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-[#FFF7D1] text-xl mb-4">Error</div>
          <div className="text-white mb-6">{error}</div>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-[#8B5DFF] hover:bg-[#6A42C2] text-white py-2 px-4 rounded-full transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-[#563A9C] rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#FFF7D1] mb-6 text-center">Edit Profile</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="mb-4">
              <img
                src={previewImage || "/images/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-[#FFF7D1]"
              />
            </div>
            <label className="text-[#FFF7D1] cursor-pointer hover:underline">
              Change Picture
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
            <label className="block text-[#FFF7D1] mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
              required
              disabled={submitting}
            />
          </div>

          {/* Password Mode Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordToggle"
              checked={passwordMode}
              onChange={() => setPasswordMode(!passwordMode)}
              className="mr-2 h-5 w-5"
              disabled={submitting}
            />
            <label htmlFor="passwordToggle" className="text-[#FFF7D1] cursor-pointer">
              Change Password
            </label>
          </div>

          {/* Password Fields - Only shown when in password mode */}
          {passwordMode && (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-[#FFF7D1] mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                  disabled={submitting}
                />
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-[#FFF7D1] mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                  disabled={submitting}
                />
              </div>
              
              {/* Confirm New Password */}
              <div>
                <label className="block text-[#FFF7D1] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none focus:ring-2 focus:ring-[#8B5DFF] ${
                    newPassword && confirmPassword && newPassword !== confirmPassword
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                  disabled={submitting}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-300 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${
              submitting
                ? "bg-[#6A42C2] cursor-not-allowed"
                : "bg-[#8B5DFF] hover:bg-[#6A42C2]"
            } text-white py-3 rounded-full transition duration-300 flex justify-center items-center`}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
};

export default Profile;
