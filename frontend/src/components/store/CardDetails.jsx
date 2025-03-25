import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const CardDetails = () => {
  const { platformId, cardId } = useParams();

  // Sample gift card data (in a real app, this would come from an API)
  const cardDetails = {
    platform: platformId,
    value: parseInt(cardId.split('-')[1]),
    priceJOD: parseInt(cardId.split('-')[1]) * 0.75,
    description: `This is a digital gift card for ${platformId.charAt(0).toUpperCase() + platformId.slice(1).replace('-', ' ')}. The card value is $${parseInt(cardId.split('-')[1])} and can be used to purchase games, add-ons, and in-game items.`,
    features: [
      'Digital delivery - instant email delivery after purchase',
      'Valid worldwide',
      'No expiration date',
      'Can be used for games, DLC, and in-game purchases',
      '24/7 Customer support'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to={`/store/${platformId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to {platformId.charAt(0).toUpperCase() + platformId.slice(1).replace('-', ' ')} Cards
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Card Info */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  ${cardDetails.value} Gift Card
                </h1>
                <div className="text-2xl text-gray-600 mb-6">
                  {cardDetails.priceJOD.toFixed(2)} JOD
                </div>
                <p className="text-gray-600 mb-6">
                  {cardDetails.description}
                </p>
                <div className="space-y-4 mb-6">
                  {cardDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Purchase Box */}
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Purchase Details
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <FaCreditCard className="mr-2" />
                      Secure Payment
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaInfoCircle className="mr-2" />
                      Instant Digital Delivery
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200">
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails; 