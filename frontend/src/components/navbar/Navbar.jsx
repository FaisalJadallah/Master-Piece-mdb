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
      className="flex items-center space-x-3 group"
    >
      {/* Logo/Icon Part */}
      <div className="relative w-14 h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
        {/* Hexagonal Background */}
        <svg viewBox="0 0 100 100" className="absolute w-full h-full transition-transform duration-500 group-hover:rotate-12">
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A1D96" />
              <stop offset="100%" stopColor="#18013E" />
            </linearGradient>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEFCE8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Glow effect on hover */}
          <polygon 
            points="50,10 90,30 90,70 50,90 10,70 10,30" 
            fill="none" 
            stroke="url(#glowGradient)" 
            strokeWidth="4"
            opacity="0"
            className="transition-opacity duration-300 group-hover:opacity-100"
            filter="url(#glow)"
          />
          
          {/* Main Hexagon */}
          <polygon 
            points="50,10 90,30 90,70 50,90 10,70 10,30" 
            fill="url(#hexGradient)" 
            stroke="#8B5CF6" 
            strokeWidth="2"
            className="transition-all duration-300 group-hover:stroke-amber-200"
          />
          
          {/* Honeycomb Pattern */}
          <g opacity="0.15" className="transition-opacity duration-300 group-hover:opacity-25">
            <path d="M30,30 L40,35 L40,45 L30,50 L20,45 L20,35 Z" fill="#FEFCE8" />
            <path d="M50,30 L60,35 L60,45 L50,50 L40,45 L40,35 Z" fill="#FEFCE8" />
            <path d="M70,30 L80,35 L80,45 L70,50 L60,45 L60,35 Z" fill="#FEFCE8" />
            <path d="M40,50 L50,55 L50,65 L40,70 L30,65 L30,55 Z" fill="#FEFCE8" />
            <path d="M60,50 L70,55 L70,65 L60,70 L50,65 L50,55 Z" fill="#FEFCE8" />
          </g>
        </svg>
        
        {/* Gamepad Icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          className="relative z-10 text-amber-100 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-200"
          fill="currentColor"
        >
          <path d="M6 9h2v2h2v2H8v2H6v-2H4v-2h2V9zm11-3a7 7 0 0 1 0 14c-1.75 0-3.27-.73-4.83-1.65-.16-.1-.74-.5-.97-.62-.25-.13-.53-.2-.7-.2s-.45.07-.7.2c-.23.12-.81.51-.97.62C7.27 19.27 5.75 20 4 20a7 7 0 0 1 0-14c1.75 0 3.27.73 4.83 1.65.16.1.74.5.97.62.25.13.53.2.7.2s.45-.07.7-.2c.23-.12.81-.51.97-.62C13.73 6.73 15.25 6 17 6zm0 2c-1.18 0-2.32.54-3.6 1.3-.24.15-.86.55-1.23.75-.59.32-1.06.45-1.67.45-.61 0-1.08-.13-1.67-.45-.37-.2-.99-.6-1.23-.75C6.32 8.54 5.18 8 4 8a5 5 0 0 0 0 10c1.18 0 2.32-.54 3.6-1.3.24-.15.86-.55 1.23-.75.59-.32 1.06-.45 1.67-.45.61 0 1.08.13 1.67.45.37.2.99.6 1.23.75 1.28.76 2.42 1.3 3.6 1.3a5 5 0 0 0 0-10z" />
        </svg>
      </div>
      
      {/* Text Part */}
      <span className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-200 transition-all duration-300 group-hover:from-amber-200 group-hover:to-amber-300">
        GamingHive
      </span>
    </button>

          {/* Navigation Links - Center */}
          <ul className="hidden md:flex gap-6 font-medium items-center absolute left-1/2 transform -translate-x-1/2">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/tournaments">Tournaments</NavLink></li>
            <li><NavLink to="/store">Store</NavLink></li>
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
