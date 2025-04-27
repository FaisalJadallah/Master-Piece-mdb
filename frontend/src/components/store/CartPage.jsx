import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import PaymentGateway from './PaymentGateway';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/store" className="flex items-center text-[#FFF7D1] hover:text-white transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Store
          </Link>
        </div>

        <div className="bg-[#2a293a] rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-700">
            <h1 className="text-3xl font-bold text-[#FFF7D1]">Your Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xl text-gray-400 mb-6">Your cart is empty</p>
              <Link 
                to="/store" 
                className="inline-block px-6 py-3 bg-[#6A42C2] hover:bg-[#8B5DFF] rounded-lg transition-colors text-white"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#2f2b44] rounded-xl p-4 flex justify-between items-center shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg object-cover border border-purple-700 bg-gray-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2232%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-[#FFF7D1]">{item.title}</h3>
                        <p className="text-sm text-purple-300">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-purple-700 hover:bg-purple-600 text-white p-1 rounded-full"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-6 text-center text-[#FFF7D1]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-purple-700 hover:bg-purple-600 text-white p-1 rounded-full"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-700 px-6 py-4">
                <div className="flex justify-between text-lg font-semibold mb-4 text-[#FFF7D1]">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/store"
                    className="flex-1 py-3 text-center border border-purple-700 text-white rounded-xl hover:bg-purple-900 transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 bg-[#8B5DFF] hover:bg-[#6A42C2] text-white py-3 rounded-xl shadow-md transition-all duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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