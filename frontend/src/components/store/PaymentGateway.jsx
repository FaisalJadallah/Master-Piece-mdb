import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaPaypal, FaShoppingCart } from 'react-icons/fa';

const PaymentGateway = ({ amount, cardDetails, onClose }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('summary'); // 'summary', 'payment'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    setStep('payment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Payment successful! Your order has been processed.');
      onClose();
      navigate('/profile');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-[#FFF7D1]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {step === 'summary' ? 'Order Summary' : 'Secure Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8B5DFF] hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        {step === 'summary' ? (
          <>
            {/* Order summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">Order Details</p>
                <div className="flex items-center text-purple-400 text-sm">
                  <FaShoppingCart className="mr-1" />
                  {cardDetails.items.length} items
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto mb-4 pr-2">
                {cardDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover mr-3 bg-gray-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2240%22%20height%3D%2240%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2220%22%20font-size%3D%228%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-[#8B5DFF] hover:bg-[#6A42C2] text-white font-semibold transition-all duration-300"
            >
              Continue to Payment
            </button>
          </>
        ) : (
          <>
            {/* Payment form */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">Total: ${amount.toFixed(2)}</p>
                <div className="flex items-center text-green-400 text-sm">
                  <FaLock className="mr-1" />
                  Secure Payment
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'border-[#8B5DFF] bg-[#2c2c3e]'
                      : 'border-gray-600 hover:border-[#8B5DFF]'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard className="mx-auto mb-2 text-[#8B5DFF]" />
                  <span className="block text-sm">Card</span>
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                    paymentMethod === 'paypal'
                      ? 'border-[#8B5DFF] bg-[#2c2c3e]'
                      : 'border-gray-600 hover:border-[#8B5DFF]'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <FaPaypal className="mx-auto mb-2 text-[#8B5DFF]" />
                  <span className="block text-sm">PayPal</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {paymentMethod === 'card' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                      required
                      maxLength="19"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm mb-1">Card Holder</label>
                    <input
                      type="text"
                      name="cardHolder"
                      placeholder="John Doe"
                      className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                      required
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                        required
                        maxLength="5"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                        required
                        maxLength="3"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm mb-1">PayPal Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('summary')}
                  className="flex-1 py-3 rounded-lg border border-purple-700 text-white font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-lg text-white font-semibold shadow-md ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#8B5DFF] hover:bg-[#6A42C2] transition-all duration-300'
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-400">
          Your payment is encrypted & secure.
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
