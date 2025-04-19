import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // إذا فيه token = تسجيل دخول
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#563A9C] text-[#FFF7D1] shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          GamingHive
        </Link>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`flex-col md:flex-row gap-4 md:gap-6 font-medium items-start md:items-center md:flex ${
            menuOpen ? 'flex absolute top-[70px] left-0 w-full bg-[#563A9C] px-6 pb-4' : 'hidden'
          } md:static`}
        >
          <li>
            <Link
              to="/"
              className={`hover:underline ${isActive("/") ? "underline" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/store"
              className={`hover:underline ${isActive("/store") ? "underline" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Store
            </Link>
          </li>
          <li>
            <Link
              to="/tournaments"
              className={`hover:underline ${isActive("/tournaments") ? "underline" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Tournaments
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`hover:underline ${isActive("/profile") ? "underline" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          </li>

          {/* Login / Logout Button */}
          <li className="relative">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hover:underline focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <>
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
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-[#eee]"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
