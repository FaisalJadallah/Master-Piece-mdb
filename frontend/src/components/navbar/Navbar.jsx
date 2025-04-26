import React, { useEffect, useState } from 'react';
import { Gamepad2, Menu, X, User, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Add scroll event listener to show/hide the back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const NavLink = ({ to, children }) => (
    <button
      onClick={() => {
        navigate(to);
        setMenuOpen(false);
      }}
      className={`px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-purple-700 hover:scale-105 ${
        location.pathname === to ? "bg-purple-700 font-semibold" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-amber-50 shadow-lg px-6 py-3 sticky top-0 z-50">
        <div className="container mx-auto relative flex items-center justify-between w-full">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 group"
          >
            <div className="bg-amber-100 text-purple-900 p-2 rounded-full transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Gamepad2 size={24} className="text-purple-800" />
            </div>
            <span className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-200">
              GamingHive
            </span>
          </button>

          {/* Navigation Links - Center */}
          <ul className="hidden md:flex gap-6 font-medium items-center absolute left-1/2 transform -translate-x-1/2">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/tournaments">Tournaments</NavLink></li>
            <li><NavLink to="/store">Store</NavLink></li>
            <li><NavLink to="/news">News</NavLink></li>
            <li><NavLink to="/aboutus">About Us</NavLink></li>
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-full transition-colors"
                  aria-label="Profile"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="bg-amber-400 hover:bg-amber-500 text-purple-900 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  Login
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-purple-900 rounded-lg shadow-xl w-40 overflow-hidden border border-purple-100 z-10 transition-all duration-300 ease-in-out animate-fade-in-down">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-purple-100 transition-colors border-b border-purple-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-purple-100 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger for mobile */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="focus:outline-none hover:bg-purple-700 p-2 rounded-lg transition-colors"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="flex flex-col md:hidden gap-4 px-6 py-4 bg-purple-900 animate-slide-down duration-300 ease-out">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/aboutus">About Us</NavLink></li>
            <li><NavLink to="/tournaments">Tournaments</NavLink></li>
            <li><NavLink to="/store">Store</NavLink></li>
            <li><NavLink to="/news">News</NavLink></li>
            {!isLoggedIn && (
              <>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* Back to Top Button */}
      <div 
        className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-800 to-purple-900 text-amber-50 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group"
          aria-label="Back to top"
        >
          <ArrowUp size={18} className="mb-1 text-amber-100" />
          <div className="bg-amber-100 text-purple-900 p-1.5 rounded-full transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Gamepad2 size={18} className="text-purple-800" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Navbar;
