import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#563A9C] text-[#FFF7D1] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Logo & Name */}
        <div className="text-2xl font-bold">GamingHive</div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-4 text-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/store" className="hover:underline">Store</Link>
          <Link to="/tournaments" className="hover:underline">Tournaments</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-[#FFF7D1]">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaInstagram size={20} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <FaDiscord size={20} />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-8 text-sm opacity-80">
        © {new Date().getFullYear()} GamingHive. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
