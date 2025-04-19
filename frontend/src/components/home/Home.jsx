import React from "react";
import { Link } from "react-router-dom";
import videoFile from "../../assets/Home/next-level.mp4"; 

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white">
     <section className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover z-0"
      >
        <source src={videoFile}type="video/mp4" />
        Your browser does not support the video tag.
      </video>



      <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-[#FFFFFF]">Welcome to GamingHive</h1>
          <p className="mt-6 text-xl text-[#FFF">
            Dive into the ultimate gaming experience.
          </p>
        </div>
      </div>
    </section>

      {/* Store Section */}
      <section className="py-24 bg-gradient-to-b from-[#563A9C] to-[#6A42C2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#FFF7D1]">Gaming Store</h2>
          <p className="mt-6 text-xl text-[#FFF7D1] max-w-2xl mx-auto">
            Browse our collection of exclusive gaming items and premium merchandise
          </p>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Store Cards */}
            {[
              {
                title: "playStation",
                desc: "High-quality gaming t-shirt for the ultimate fan!",
                img: "/src/assets/Home/playstation-store-logo-1200x900.jpg",
              },
              {
                title: "Xbox",
                desc: "Top-notch audio quality for immersive gaming.",
                img: "/src/assets/Home/xbox.jpg",
              },
              {
                title: "Steam",
                desc: "Precision gaming mouse for the ultimate performance.",
                img: "/src/assets/Home/steam_logo_art_2000.webp",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-[#6A42C2] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-[#8B5DFF] transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0"></div>
                <div className="relative z-10 p-6">
                  <div className="overflow-hidden rounded-xl mb-6 group-hover:shadow-lg transition-all duration-500">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#FFF7D1] mt-4 group-hover:translate-y-1 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[#FFF7D1] mt-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/store"
            className="mt-16 inline-block px-10 py-4 bg-[#8B5DFF] text-white rounded-full hover:bg-[#6A42C2] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Explore All Products
          </Link>
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
            {[
              {
                title: "Multiplayer Fun",
                desc: "Team up with friends or challenge players worldwide.",
                iconPath:
                  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Exciting Rewards",
                desc: "Earn exclusive prizes and unlock new challenges.",
                iconPath:
                  "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
              },
              {
                title: "24/7 Support",
                desc: "Get help anytime with our dedicated support team.",
                iconPath:
                  "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-[#563A9C] to-[#6A42C2] p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-[#8B5DFF] rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#FFF7D1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-[#FFF7D1]">{feature.title}</h3>
                <p className="mt-4 text-[#FFF7D1] opacity-90">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#563A9C] to-[#6A42C2] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#FFF7D1]">Join Our Tournaments</h2>
          <p className="mt-6 text-xl text-[#FFF7D1] max-w-2xl mx-auto">
            Get ready for exciting tournaments with amazing prizes!
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
