import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("PlayerOne");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 هنا تقدر تبعت البيانات لسيرفر أو Odoo أو Firebase حسب النظام عندك
    console.log("Updated Profile:", {
      name,
      password,
      profileImage,
    });

    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-[#563A9C] rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#FFF7D1] mb-6 text-center">Edit Profile</h2>

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
            <label className="text-[#FFF7D1] cursor-pointer">
              Change Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#FFF7D1] mb-1">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#FFF7D1] mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#FFF7D1] text-[#563A9C] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#8B5DFF] text-white py-3 rounded-full hover:bg-[#6A42C2] transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
