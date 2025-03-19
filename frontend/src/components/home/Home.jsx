import React, { useState } from "react";

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: "Epic Gaming Experience",
      subtitle: "Join the adventure today!",
      buttonText: "Play Now"
      
    },
    {
      title: "New Updates",
      subtitle: "Check out the latest features!",
      buttonText: "Learn More"
    },
    {
      title: "Exclusive Events",
      subtitle: "Don't miss out on special tournaments!",
      buttonText: "Join Events"
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section with Improved Slider */}
      <section className="relative w-full h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              activeSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ backgroundImage: `url(/api/placeholder/${1200}/${800})` }}
          >
            <div className="absolute inset-0 bg-[#563A9C] bg-opacity-70"></div>
            <div className="flex items-center justify-center h-full text-center">
              <div className="max-w-lg px-4">
                <h1 className="text-5xl font-bold text-[#FFF7D1] tracking-tight">{slide.title}</h1>
                <p className="text-xl mt-6 text-[#FFF7D1]">{slide.subtitle}</p>
                <button className="mt-8 px-8 py-4 bg-[#8B5DFF] text-white rounded-full hover:bg-[#6A42C2] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Navigation */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
    <a href="#slide1" className="text-[#8B5DFF] text-lg"></a>
    <a href="#slide2" className="text-[#8B5DFF] text-lg"></a>
    <a href="#slide3" className="text-[#8B5DFF] text-lg"></a>
  </div>

        {/* Slider Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 md:px-8">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-[#563A9C] bg-opacity-50 text-[#FFF7D1] hover:bg-opacity-70 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-[#563A9C] bg-opacity-50 text-[#FFF7D1] hover:bg-opacity-70 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Improved Slider Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === index 
                  ? "bg-[#FFF7D1] w-6" 
                  : "bg-[#8B5DFF] opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Store Section with Enhanced Cards */}
      <section className="py-24 bg-gradient-to-b from-[#563A9C] to-[#6A42C2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#FFF7D1]">Gaming Store</h2>
          <p className="mt-6 text-xl text-[#FFF7D1] max-w-2xl mx-auto">
            Browse our collection of exclusive gaming items and premium merchandise
          </p>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Card 1 - Enhanced hover effect */}
            <div className="group relative bg-[#6A42C2] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-[#8B5DFF] transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0"></div>
              <div className="relative z-10 p-6">
                <div className="overflow-hidden rounded-xl mb-6 group-hover:shadow-lg transition-all duration-500">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Gaming T-Shirt" 
                    className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#FFF7D1] mt-4 group-hover:translate-y-1 transition-all duration-300">
                  Exclusive T-Shirt
                </h3>
                <p className="text-[#FFF7D1] mt-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  High-quality gaming t-shirt for the ultimate fan!
                </p>
               
              </div>
            </div>

            {/* Store Card 2 */}
            <div className="group relative bg-[#6A42C2] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-[#8B5DFF] transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0"></div>
              <div className="relative z-10 p-6">
                <div className="overflow-hidden rounded-xl mb-6 group-hover:shadow-lg transition-all duration-500">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Gaming Headset" 
                    className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#FFF7D1] mt-4 group-hover:translate-y-1 transition-all duration-300">
                  Gaming Headset
                </h3>
                <p className="text-[#FFF7D1] mt-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  Top-notch audio quality for immersive gaming.
                </p>
               
                </div>
            </div>

            {/* Store Card 3 */}
            <div className="group relative bg-[#6A42C2] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-[#8B5DFF] transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0"></div>
              <div className="relative z-10 p-6">
                <div className="overflow-hidden rounded-xl mb-6 group-hover:shadow-lg transition-all duration-500">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Gaming Mouse" 
                    className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#FFF7D1] mt-4 group-hover:translate-y-1 transition-all duration-300">
                  Gaming Mouse
                </h3>
                <p className="text-[#FFF7D1] mt-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  Precision gaming mouse for the ultimate performance.
                </p>
                
                </div>
            </div>
          </div>

          {/* Explore Button with enhanced hover effect */}
          <button className="mt-16 px-10 py-4 bg-[#8B5DFF] text-white rounded-full hover:bg-[#6A42C2] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            Explore All Products
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#FFF7D1]">Why Play With Us?</h2>
            <p className="mt-6 text-xl text-[#FFF7D1] max-w-2xl mx-auto">
              Discover unique gaming experiences, connect with friends, and explore new worlds!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-[#563A9C] to-[#6A42C2] p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-[#8B5DFF] rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFF7D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFF7D1]">Multiplayer Fun</h3>
              <p className="mt-4 text-[#FFF7D1] opacity-90">Team up with friends or challenge players worldwide in our immersive multiplayer environments.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-[#563A9C] to-[#6A42C2] p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-[#8B5DFF] rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFF7D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFF7D1]">Exciting Rewards</h3>
              <p className="mt-4 text-[#FFF7D1] opacity-90">Earn exclusive prizes and unlock new challenges as you progress through our gaming universe.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-[#563A9C] to-[#6A42C2] p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-[#8B5DFF] rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFF7D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#FFF7D1]">24/7 Support</h3>
              <p className="mt-4 text-[#FFF7D1] opacity-90">Get help anytime with our dedicated support team committed to enhancing your gaming experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#563A9C] to-[#6A42C2] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#FFF7D1]">Join Our Tournaments</h2>
          <p className="mt-6 text-xl text-[#FFF7D1] max-w-2xl mx-auto">
            Get ready for exciting tournaments with amazing prizes! Compete with players from all around the world.
          </p>
          <button className="mt-12 px-10 py-5 bg-[#8B5DFF] text-[#FFF7D1] font-medium rounded-full hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
            View Upcoming Tournaments
          </button>
        </div>
      </section>

     
    </div>
  );
};

export default HomePage;