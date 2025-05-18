import React from 'react';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import PaymentGateway from './PaymentGateway';

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    hasPhysicalItems,
  } = useCart();

  const [showPayment, setShowPayment] = React.useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] text-[#FFF7D1] shadow-2xl rounded-l-2xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-[#FFF7D1]">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-[#8B5DFF] hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-400">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
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
                      {item.isPhysical && (
                        <span className="text-xs bg-purple-900 text-purple-200 px-1 py-0.5 rounded">Physical</span>
                      )}
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
                      <span className="w-6 text-center">{item.quantity}</span>
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
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-purple-700 px-6 py-4">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              {hasPhysicalItems() && (
                <div className="mb-4 p-3 bg-[#2f2b44] rounded-lg border border-purple-700">
                  <p className="text-sm text-purple-200">
                    <span className="font-semibold">Note:</span> Your cart contains physical items that require shipping.
                  </p>
                </div>
              )}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#8B5DFF] hover:bg-[#6A42C2] text-white py-3 rounded-xl shadow-md transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
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

export default Cart;
