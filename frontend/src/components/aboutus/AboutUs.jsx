import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gray-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#FFF7D1] mb-4">About GamingHive</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            GamingHive is more than just a platform – it's a digital ecosystem designed to bring gamers together. We provide everything from secure digital shopping, competitive tournaments, to the latest news and trends in the gaming world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">🎮 Our Game Store</h2>
            <p className="text-gray-300 mb-4">
              Our store offers a wide range of digital gift cards for top platforms like PlayStation, Xbox, and Steam. With instant delivery and secure payments, we make it easy for you to top up your account or gift a friend.
            </p>
            <ul className="list-disc list-inside text-gray-400">
              <li>Multiple platform options</li>
              <li>Fast digital delivery</li>
              <li>Safe & secure checkout</li>
              <li>Frequent discounts and offers</li>
            </ul>
          </div>
          <div className="bg-[#563A9C] rounded-xl p-6 shadow-lg">
            <img src="\src\assets\About\pexels-johnpet-2115256.jpg" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-[#563A9C] rounded-xl p-6 shadow-lg order-2 md:order-1">
            <img src="/src/assets/About/pexels-rdne-7915216.jpg" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-semibold text-white mb-4">🏆 Tournaments</h2>
            <p className="text-gray-300 mb-4">
              Join our weekly and monthly tournaments in top competitive games. Climb leaderboards, win rewards, and compete against the best players in the region.
            </p>
            <ul className="list-disc list-inside text-gray-400">
              <li>Fair matchmaking and rules</li>
              <li>Live brackets and updates</li>
              <li>Exclusive in-game rewards</li>
              <li>Community voting and rankings</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">📰 Gaming News Hub</h2>
            <p className="text-gray-300 mb-4">
              Stay up to date with gaming industry news, updates, developer announcements, esports coverage, and game reviews. Our editorial team is always on the lookout for what's trending.
            </p>
            <ul className="list-disc list-inside text-gray-400">
              <li>Latest news and game updates</li>
              <li>Upcoming releases and reviews</li>
              <li>Esports and community events</li>
              <li>Game tips, blogs, and guides</li>
            </ul>
          </div>
          <div className="bg-[#563A9C] rounded-xl p-6 shadow-lg">
            <img src="\src\assets\About\pexels-a-darmel-7862609.jpg" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">🚀 Our Mission</h3>
          <p className="text-gray-400 max-w-3xl mx-auto">
            At GamingHive, we aim to build a united space for all gamers – from casual players to esports champions. We're driven by passion and powered by innovation, constantly evolving to match the needs of the global gaming community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
