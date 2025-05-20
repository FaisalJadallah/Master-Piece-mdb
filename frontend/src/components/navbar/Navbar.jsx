import React, { useEffect, useState, useRef } from 'react';
import { Gamepad2, Menu, X, User, ArrowUp, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// Cart indicator component to show number of items in cart
const CartIndicator = () => {
  const { getCartItemsCount } = useCart();
  const count = getCartItemsCount();
  
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-2 -right-2 bg-amber-400 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
};

// Wishlist indicator component to show number of items in wishlist
const WishlistIndicator = () => {
  const { getWishlistItemsCount } = useWishlist();
  const count = getWishlistItemsCount();
  
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-2 -right-2 bg-amber-400 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mobileMenuRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const NavLink = ({ to, children, isMobile = false }) => (
    <button
      onClick={() => {
        navigate(to);
        if (isMobile) setMenuOpen(false);
      }}
      className={`px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-purple-700 hover:scale-105 ${
        location.pathname === to ? "bg-purple-700 font-semibold" : ""
      } ${isMobile ? "w-full flex items-center justify-center text-lg" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-amber-50 shadow-lg px-4 sm:px-6 py-2 sm:py-3 sticky top-0 z-50">
        <div className="container mx-auto relative flex items-center justify-between w-full">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 sm:space-x-3 group z-20"
          >
            {/* Logo/Icon Part */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
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
                width="20" 
                height="20" 
                className="relative z-10 text-amber-100 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-200"
                fill="currentColor"
              >
                <path d="M6 9h2v2h2v2H8v2H6v-2H4v-2h2V9zm11-3a7 7 0 0 1 0 14c-1.75 0-3.27-.73-4.83-1.65-.16-.1-.74-.5-.97-.62-.25-.13-.53-.2-.7-.2s-.45.07-.7.2c-.23.12-.81.51-.97.62C7.27 19.27 5.75 20 4 20a7 7 0 0 1 0-14c1.75 0 3.27.73 4.83 1.65.16.1.74.5.97.62.25.13.53.2.7.2s.45-.07.7-.2c.23-.12.81-.51.97-.62C13.73 6.73 15.25 6 17 6zm0 2c-1.18 0-2.32.54-3.6 1.3-.24.15-.86.55-1.23.75-.59.32-1.06.45-1.67.45-.61 0-1.08-.13-1.67-.45-.37-.2-.99-.6-1.23-.75C6.32 8.54 5.18 8 4 8a5 5 0 0 0 0 10c1.18 0 2.32-.54 3.6-1.3.24-.15.86-.55 1.23-.75.59-.32 1.06-.45 1.67-.45.61 0 1.08.13 1.67.45.37.2.99.6 1.23.75 1.28.76 2.42 1.3 3.6 1.3a5 5 0 0 0 0-10z" />
              </svg>
            </div>
            
            {/* Text Part */}
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-200 transition-all duration-300 group-hover:from-amber-200 group-hover:to-amber-300">
              GamingHive
            </span>
          </button>

          {/* Navigation Links - Center (Desktop only) */}
          <ul className="hidden lg:flex gap-3 xl:gap-6 font-medium items-center absolute left-1/2 transform -translate-x-1/2">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/tournaments">Tournaments</NavLink></li>
            <li><NavLink to="/store">Store</NavLink></li>
            <li><NavLink to="/news">News</NavLink></li>
            <li><NavLink to="/aboutus">About Us</NavLink></li>
          </ul>

          {/* Right Side - Icons and Auth */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 z-20">
            {/* Only show these on medium screens and up */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-2 md:gap-4">
              <Link
                to="/wishlist"
                className="bg-purple-700 hover:bg-purple-600 text-white p-1.5 sm:p-2 rounded-full transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={18} className="sm:w-5 sm:h-5" />
                <WishlistIndicator />
              </Link>
              
              <Link
                to="/cart"
                className="bg-purple-700 hover:bg-purple-600 text-white p-1.5 sm:p-2 rounded-full transition-colors relative"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart size={18} className="sm:w-5 sm:h-5" />
                <CartIndicator />
              </Link>
              
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="bg-purple-700 hover:bg-purple-600 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                    aria-label="Profile"
                  >
                    <User size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors"
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
                    className="bg-amber-400 hover:bg-amber-500 text-purple-900 font-semibold text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors flex items-center"
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
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="lg:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors z-20"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X size={22} className="text-amber-200" />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Menu Sidebar */}
        <div 
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-[85%] max-w-xs bg-gradient-to-b from-purple-900 to-purple-950 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`}
        >
          <div className="p-4 sm:p-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-800">
              <div className="flex items-center">
                <Gamepad2 size={22} className="text-amber-400 mr-2" />
                <span className="text-lg font-bold text-amber-200">Menu</span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-1.5 hover:bg-purple-800 rounded-full transition-colors"
              >
                <X size={18} className="text-amber-200" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <NavLink to="/" isMobile>Home</NavLink>
              <NavLink to="/tournaments" isMobile>Tournaments</NavLink>
              <NavLink to="/store" isMobile>Store</NavLink>
              <NavLink to="/news" isMobile>News</NavLink>
              <NavLink to="/aboutus" isMobile>About Us</NavLink>
              
              {/* Mobile-only quick links */}
              <div className="pt-3 mt-3 border-t border-purple-800">
                <h3 className="text-amber-400 text-sm font-semibold mb-3">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/wishlist"
                    className="flex flex-col items-center justify-center bg-purple-800 hover:bg-purple-700 p-3 rounded-lg transition-colors"
                  >
                    <Heart size={18} className="mb-1.5 text-amber-300" />
                    <span className="text-xs sm:text-sm">Wishlist</span>
                    {/* Mobile Wishlist indicator */}
                    {useWishlist().getWishlistItemsCount() > 0 && (
                      <span className="mt-1 bg-amber-400 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {useWishlist().getWishlistItemsCount()}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to="/cart"
                    className="flex flex-col items-center justify-center bg-purple-800 hover:bg-purple-700 p-3 rounded-lg transition-colors"
                  >
                    <FaShoppingCart size={18} className="mb-1.5 text-amber-300" />
                    <span className="text-xs sm:text-sm">Cart</span>
                    {/* Mobile Cart indicator */}
                    {useCart().getCartItemsCount() > 0 && (
                      <span className="mt-1 bg-amber-400 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {useCart().getCartItemsCount()}
                      </span>
                    )}
                  </Link>
                  
                  {isLoggedIn && (
                    <Link
                      to="/profile"
                      className="flex flex-col items-center justify-center bg-purple-800 hover:bg-purple-700 p-3 rounded-lg transition-colors"
                    >
                      <User size={18} className="mb-1.5 text-amber-300" />
                      <span className="text-xs sm:text-sm">Profile</span>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Auth buttons for mobile */}
              <div className="pt-3 mt-3 border-t border-purple-800">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors font-semibold text-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="bg-amber-400 hover:bg-amber-500 text-purple-900 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMenuOpen(false);
                      }}
                      className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Back to Top Button */}
      <div 
        className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-800 to-purple-900 text-amber-50 p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group"
          aria-label="Back to top"
        >
          <ArrowUp size={16} className="mb-1 text-amber-100" />
          <div className="bg-amber-100 text-purple-900 p-1 sm:p-1.5 rounded-full transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Gamepad2 size={16} className="text-purple-800" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Navbar;
