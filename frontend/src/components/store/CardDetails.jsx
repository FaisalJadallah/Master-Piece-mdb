import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaShoppingCart,
  FaCreditCard,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';

const CardDetails = () => {
  const { platformId, cardId } = useParams();

  const value = parseInt(cardId.split('-')[1]);
  const priceJOD = value * 0.75;
  const platformName = platformId.charAt(0).toUpperCase() + platformId.slice(1).replace('-', ' ');

  const cardDetails = {
    platform: platformName,
    value,
    priceJOD,
    description: `This is a digital gift card for ${platformName}. The card value is $${value} and can be used to purchase games, add-ons, and in-game items.`,
    features: [
      'Digital delivery - instant email delivery after purchase',
      'Valid worldwide',
      'No expiration date',
      'Can be used for games, DLC, and in-game purchases',
      '24/7 Customer support',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4">
      <div className="max-w-6xl mx-auto text-[#FFF7D1]">
        <div className="mb-6">
          <Link
            to={`/store/${platformId}`}
            className="text-[#8B5DFF] hover:underline"
          >
            ← Back to {platformName} Cards
          </Link>
        </div>

        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl font-bold text-[#FFF7D1] mb-4">
                ${cardDetails.value} Gift Card
              </h1>
              <p className="text-2xl text-[#8B5DFF] mb-6">
                {cardDetails.priceJOD.toFixed(2)} JOD
              </p>
              <p className="text-[#d1cce7] mb-6">{cardDetails.description}</p>

              <div className="space-y-4">
                {cardDetails.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-[#b5b5d5]">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Purchase */}
            <div className="bg-[#2c2c3e] p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold text-[#FFF7D1] mb-4">
                Purchase Details
              </h2>

              <div className="space-y-4 mb-6 text-[#c8c2eb]">
                <div className="flex items-center">
                  <FaCreditCard className="mr-2 text-[#8B5DFF]" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <FaInfoCircle className="mr-2 text-[#8B5DFF]" />
                  Instant Digital Delivery
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow transition duration-300">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button className="w-full bg-[#8B5DFF] hover:bg-[#6a42c2] text-white py-3 rounded-lg shadow transition duration-300">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
