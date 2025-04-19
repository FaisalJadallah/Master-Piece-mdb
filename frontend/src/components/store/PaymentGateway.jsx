import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaPaypal } from 'react-icons/fa';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Payment successful! Your gift card code will be sent to your email.');
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
          <h2 className="text-2xl font-bold">Secure Checkout</h2>
          <button
            onClick={onClose}
            className="text-[#8B5DFF] hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Amount + Method */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold">Total: {amount.toFixed(2)} JOD</p>
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

        {/* Form */}
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

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold mt-2 shadow-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#8B5DFF] hover:bg-[#6A42C2] transition-all duration-300'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${amount.toFixed(2)} JOD`}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          Your payment is encrypted & secure.
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
