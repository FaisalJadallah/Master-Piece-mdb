import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-[#563A9C] text-[#FFF7D1] shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          GamingHive
        </Link>

        <ul className="flex gap-6 font-medium items-center">
          <li>
            <Link
              to="/"
              className={`hover:underline ${isActive("/") ? "underline" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/store"
              className={`hover:underline ${isActive("/store") ? "underline" : ""}`}
            >
              Store
            </Link>
          </li>
          <li>
            <Link
              to="/Tournaments"
              className={`hover:underline ${isActive("/Tournaments") ? "underline" : ""}`}
            >
              Tournaments
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`hover:underline ${isActive("/profile") ? "underline" : ""}`}
            >
              Profile
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:underline focus:outline-none"
            >
              Login
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-[#563A9C] rounded shadow-md w-32 z-10">
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-[#eee]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-[#eee]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
