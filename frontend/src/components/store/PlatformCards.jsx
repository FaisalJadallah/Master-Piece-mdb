import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import PaymentGateway from './PaymentGateway';
import Cart from './Cart';
import { useCart } from '../../context/CartContext';

const PlatformCards = () => {
  const { platformId } = useParams();
  const [showPayment, setShowPayment] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { addToCart, getCartItemsCount } = useCart();

  // Sample gift card data with images
  const giftCards = {
    playstation: [
      { id: 'ps-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/ps-10.jpg' },
      { id: 'ps-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/ps-20.jpg' },
      { id: 'ps-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/ps-50.jpg' },
      { id: 'ps-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/ps-100.jpg' }
    ],
    steam: [
      { id: 'steam-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/steam-10.jpg' },
      { id: 'steam-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/steam-20.jpg' },
      { id: 'steam-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/steam-50.jpg' },
      { id: 'steam-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/steam-100.jpg' }
    ],
    xbox: [
      { id: 'xbox-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/xbox-10.jpg' },
      { id: 'xbox-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/xbox-20.jpg' },
      { id: 'xbox-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/xbox-50.jpg' },
      { id: 'xbox-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/xbox-100.jpg' }
    ],
    'epic-games': [
      { id: 'epic-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/epic-10.jpg' },
      { id: 'epic-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/epic-20.jpg' },
      { id: 'epic-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/epic-50.jpg' },
      { id: 'epic-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/epic-100.jpg' }
    ],
    nintendo: [
      { id: 'nintendo-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/nintendo-10.jpg' },
      { id: 'nintendo-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/nintendo-20.jpg' },
      { id: 'nintendo-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/nintendo-50.jpg' },
      { id: 'nintendo-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/nintendo-100.jpg' }
    ],
    'google-play': [
      { id: 'gplay-10', value: 10, priceJOD: 7.50, image: '/images/gift-cards/gplay-10.jpg' },
      { id: 'gplay-20', value: 20, priceJOD: 15.00, image: '/images/gift-cards/gplay-20.jpg' },
      { id: 'gplay-50', value: 50, priceJOD: 37.50, image: '/images/gift-cards/gplay-50.jpg' },
      { id: 'gplay-100', value: 100, priceJOD: 75.00, image: '/images/gift-cards/gplay-100.jpg' }
    ]
  };

  const platformNames = {
    playstation: 'PlayStation',
    steam: 'Steam',
    xbox: 'Xbox',
    'epic-games': 'Epic Games',
    nintendo: 'Nintendo',
    'google-play': 'Google Play'
  };

  const handleBuyNow = (card) => {
    setSelectedCard(card);
    setShowPayment(true);
  };

  const handleAddToCart = (card) => {
    addToCart(card);
  };

  const cards = giftCards[platformId] || [];

  return (
    <div className="min-h-screen bg-[#FFF7D1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#563A9C] tracking-tight">
            {platformNames[platformId]} Gift Cards
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center space-x-2 bg-[#6A42C2] text-white px-4 py-2 rounded-lg hover:bg-[#8B5DFF] transition-colors duration-300 group"
            >
              <FaShoppingCart className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{getCartItemsCount()}</span>
            </button>
            <Link 
              to="/store" 
              className="text-[#6A42C2] hover:text-[#8B5DFF] transition-colors duration-300 font-semibold"
            >
              Back to Platforms
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:-translate-y-4 hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={card.image}
                  alt={`${platformNames[platformId]} ${card.value}$ Gift Card`}
                  className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x300?text=${platformNames[platformId]}+$${card.value}`;
                  }}
                />
                <div className="absolute top-0 right-0 bg-[#6A42C2] text-white px-3 py-1 m-2 rounded-full text-sm">
                  ${card.value}
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-[#563A9C] mb-2">
                    {platformNames[platformId]} Gift Card
                  </h2>
                  <p className="text-2xl text-[#8B5DFF] font-semibold">
                    {card.priceJOD.toFixed(2)} JOD
                  </p>
                </div>
                <div className="space-y-4">
                  <Link
                    to={`/store/${platformId}/card/${card.id}`}
                    className="block w-full text-center bg-[#6A42C2] text-white py-3 rounded-lg hover:bg-[#8B5DFF] transition-colors duration-300"
                  >
                    View Details
                  </Link>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAddToCart(card)}
                      className="flex items-center justify-center bg-[#8B5DFF] text-white py-3 rounded-lg hover:bg-[#6A42C2] transition-colors duration-300 group"
                    >
                      <FaShoppingCart className="mr-2 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(card)}
                      className="bg-[#563A9C] text-white py-3 rounded-lg hover:bg-[#6A42C2] transition-colors duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Payment Gateway and Cart components */}
      {showPayment && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
            <p>Amount: {selectedCard.priceJOD.toFixed(2)} JOD</p>
            <div className="flex space-x-4 mt-4">
              <button 
                onClick={() => {
                  setShowPayment(false);
                  setSelectedCard(null);
                }}
                className="bg-[#6A42C2] text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for Cart */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-96">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            <button 
              onClick={() => setShowCart(false)}
              className="bg-[#6A42C2] text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformCards; 