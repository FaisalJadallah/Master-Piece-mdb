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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={`${item.value}$ Gift Card`}
                        className="h-16 w-16 rounded object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/64?text=$${item.value}`;
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">${item.value} Gift Card</h3>
                        <p className="text-gray-600">{item.priceJOD.toFixed(2)} JOD</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                        >
                          <FaMinus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                        >
                          <FaPlus className="h-4 w-4" />
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
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{getCartTotal().toFixed(2)} JOD</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-md bg-blue-600 py-3 text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

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