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
      // Here you would integrate with your actual payment processor
      // For demo purposes, we'll simulate a payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      alert('Payment successful! Your gift card code will be sent to your email.');
      onClose();
      navigate('/profile'); // Redirect to profile or order confirmation
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-gray-900">
              Total Amount: {amount.toFixed(2)} JOD
            </p>
            <div className="flex items-center text-green-600">
              <FaLock className="mr-1" />
              <span className="text-sm">Secure Payment</span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 py-3 px-4 rounded-lg border ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard className="mx-auto mb-2" />
              <span className="block text-sm">Credit Card</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg border ${
                paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <FaPaypal className="mx-auto mb-2" />
              <span className="block text-sm">PayPal</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {paymentMethod === 'card' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength="19"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="5"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PayPal Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${amount.toFixed(2)} JOD`}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Your payment is secured by industry-standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway; 