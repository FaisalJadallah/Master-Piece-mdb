import React from "react";
import videoFile from "../../assets/Home/next-level.mp4"; 
import VoltageButton from "../common/VoltageButton";

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Fixed position live stream in bottom left */}
      <div className="fixed bottom-4 left-4 z-50 w-64 h-40 md:w-[350px] md:h-[180px] lg:w-[360px] lg:h-[250px] shadow-2xl rounded-lg overflow-hidden">
        <iframe 
          src="https://kick.com/baianotv" 
          frameBorder="0" 
          allowFullScreen={true}
          allow="autoplay"
          muted
          className="w-full h-full"
          style={{ 
            position: 'absolute', 
            top: '-6px', 
            left: '-100px', 
            width: 'calc(100% + 200px)', 
            height: 'calc(100% + 150px)',
            transform: 'scale(1.05)'
          }}
          title="Kick Live Stream"
        ></iframe>
      </div>
      
      <section className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover z-0"
        >
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for opacity */}
        <div className="absolute inset-0 bg-black opacity-65 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-[#FFFFFF]">Welcome to GamingHive</h1>
            <p className="mt-6 text-xl text-[#FFF]">
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
                desc: "d money to your PlayStation account. You can use it to buy games, add-ons, movies, and more from the PlayStation Store. It's a quick and easy gift for any gamer!",
                img: "/src/assets/Home/playstation-store-logo-1200x900.jpg",
              },
              {
                title: "Xbox",
                desc: "gives you credit to spend on your Xbox account. You can use it to get games, DLCs, movies, apps, and more from the Xbox Store. It's a fun and simple gift for any Xbox fan!",
                img: "/src/assets/Home/xbox.jpg",
              },
              {
                title: "Steam",
                desc: "Steam Gift Cards let you top up your Steam account and buy games, add-ons, and more. Great for gamers who love PC gaming!",
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

          {/* Centered Explore Button */}
          <div className="flex justify-center mt-16">
            <VoltageButton to="/store">
              Explore All Products
            </VoltageButton>
          </div>
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
          
          {/* Centered Tournaments Button */}
          <div className="flex justify-center mt-16">
            <VoltageButton to="/tournaments">
              Explore All Tournaments
            </VoltageButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
