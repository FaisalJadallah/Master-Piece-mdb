import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart, FaBoxOpen, FaTags, FaShippingFast } from 'react-icons/fa';
import PaymentGateway from './PaymentGateway';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    hasPhysicalItems,
  } = useCart();

  const [showPayment, setShowPayment] = React.useState(false);

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-yellow-900/10 to-black py-16">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link 
            to="/store" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Store
          </Link>
          
          <div className="flex items-center">
            <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
              <FaShoppingCart className="text-2xl md:text-3xl text-yellow-500" />
        </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Shopping Cart</span>
            </h1>
          </div>
        </div>
          </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-8">
          {cartItems.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl p-12 text-center">
            <div className="w-28 h-28 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-5xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Browse our store to find amazing games and accessories.</p>
              <Link 
                to="/store" 
              className="inline-block px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors transform hover:scale-105 duration-200 shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
                <div className="border-b border-gray-800 p-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                      <FaShoppingCart className="text-yellow-500" />
                    </span>
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                      className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-xl transition-all duration-300"
                  >
                      <div className="h-20 w-20 overflow-hidden rounded-lg border border-gray-700 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                          className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2232%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                      />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h3 className="font-bold text-white text-lg">{item.title}</h3>
                            <div className="flex items-center mt-1">
                              {item.isPhysical && (
                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full flex items-center w-fit mr-3">
                                  <FaBoxOpen className="mr-1" />
                                  Physical
                                </span>
                              )}
                              {item.platform && (
                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full w-fit">
                                  {item.platform}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xl font-bold text-yellow-500 mt-2 sm:mt-0">
                            {(item.price * item.quantity).toFixed(2)} JOD
                      </div>
                    </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                          <div className="flex items-center bg-gray-800/80 rounded-lg p-1 mb-3 sm:mb-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`${
                                item.quantity <= 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'
                              } p-2 rounded-md transition-colors`}
                        >
                          <FaMinus size={12} />
                        </button>
                            <span className="w-10 text-center text-white font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                          
                      <button
                        onClick={() => removeFromCart(item.id)}
                            className="group flex items-center space-x-2 p-2 bg-red-900/10 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-md transition-colors"
                            aria-label="Remove item"
                      >
                            <FaTrash className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Remove</span>
                      </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>

                <div className="border-t border-gray-800 p-6 flex justify-between items-center">
                  <Link
                    to="/store"
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                  </Link>
                  
                  <button
                    onClick={() => clearCart()}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl sticky top-8">
                <div className="border-b border-gray-800 p-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                      <FaTags className="text-yellow-500" />
                    </span>
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                      <span className="text-white">{getCartTotal().toFixed(2)} JOD</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">{hasPhysicalItems() ? 'Calculated at checkout' : 'Free'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">Calculated at checkout</span>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-yellow-500">{getCartTotal().toFixed(2)} JOD</span>
                      </div>
                    </div>
                  </div>
                  
                  {hasPhysicalItems() && (
                    <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="flex items-start">
                        <div className="bg-yellow-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                          <FaShippingFast className="text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Physical Items</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Your cart contains physical items that require shipping. You'll need to provide a shipping address during checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentGateway
          amount={getCartTotal()}
          cardDetails={{ items: cartItems }}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default CartPage; 