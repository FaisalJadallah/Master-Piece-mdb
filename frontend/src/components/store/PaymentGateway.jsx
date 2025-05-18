import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaPaypal, FaShoppingCart, FaMapMarkerAlt, FaArrowRight, FaPhone } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const PaymentGateway = ({ amount, cardDetails, onClose }) => {
  const navigate = useNavigate();
  const { hasPhysicalItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
    // Address fields
    fullName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  // Change step to be 'summary', 'address', or 'payment'
  const [step, setStep] = useState('summary');
  
  // Check if there are any physical items (Gaming Accessories) in the cart
  const needsShipping = hasPhysicalItems();

  // Log for debugging
  useEffect(() => {
    console.log("Cart items:", cardDetails.items);
    console.log("Needs shipping:", needsShipping);
    console.log("Current step:", step);
  }, [cardDetails.items, needsShipping, step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    console.log("Continue clicked, needs shipping:", needsShipping);
    // If there are physical items, go to address step first, otherwise go to payment
    if (needsShipping) {
      console.log("Setting step to address");
      setStep('address');
    } else {
      console.log("Setting step to payment");
      setStep('payment');
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    // Validate address fields
    if (!formData.fullName || !formData.address || !formData.city || !formData.country || !formData.postalCode || !formData.phoneNumber) {
      alert('Please fill in all required address fields.');
      return;
    }
    
    // Proceed to payment step
    console.log("Address submitted, proceeding to payment");
    setStep('payment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would normally send the payment and shipping details to your backend
      console.log("Processing payment with data:", {
        payment: {
          method: paymentMethod,
          cardDetails: paymentMethod === 'card' ? {
            cardNumber: formData.cardNumber,
            cardHolder: formData.cardHolder,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          } : {
            email: formData.email
          }
        },
        shipping: needsShipping ? {
          fullName: formData.fullName,
          address: formData.address,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          phoneNumber: formData.phoneNumber
        } : null,
        order: {
          items: cardDetails.items,
          total: amount + (needsShipping ? 5 : 0)
        }
      });
      
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

  // Get the current step title
  const getStepTitle = () => {
    switch(step) {
      case 'summary': return 'Order Summary';
      case 'address': return 'Shipping Address';
      case 'payment': return 'Secure Checkout';
      default: return 'Checkout';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-[#FFF7D1]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {getStepTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8B5DFF] hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center mb-6">
          <div className={`h-2 flex-1 rounded-l-full ${step === 'summary' ? 'bg-[#8B5DFF]' : 'bg-[#8B5DFF]'}`}></div>
          <div className={`h-2 flex-1 ${step === 'address' || step === 'payment' ? 'bg-[#8B5DFF]' : 'bg-gray-700'}`}></div>
          <div className={`h-2 flex-1 rounded-r-full ${step === 'payment' ? 'bg-[#8B5DFF]' : 'bg-gray-700'}`}></div>
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
                        {item.isPhysical && (
                          <span className="text-xs bg-purple-900 text-purple-200 px-1 py-0.5 rounded">Physical</span>
                        )}
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
                  <span>{needsShipping ? '$5.00' : '$0.00'}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total:</span>
                  <span>${(amount + (needsShipping ? 5 : 0)).toFixed(2)}</span>
                </div>
              </div>
              
              {needsShipping && (
                <div className="mt-4 p-3 bg-[#2c2c3e] rounded-lg border border-purple-700">
                  <div className="flex items-center text-purple-300 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-semibold">Shipping Required</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Your order contains physical items that require shipping.
                    You'll need to provide a delivery address in the next step.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-[#8B5DFF] hover:bg-[#6A42C2] text-white font-semibold transition-all duration-300 flex items-center justify-center"
            >
              Continue to {needsShipping ? 'Shipping' : 'Payment'} 
              <FaArrowRight className="ml-2" />
            </button>
          </>
        ) : step === 'address' ? (
          <>
            {/* Address Form */}
            <form onSubmit={handleAddressSubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-sm mb-1">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Phone Number*</label>
                <div className="flex items-center">
                  <span className="bg-[#3c3c4e] p-2 rounded-l-lg border-l border-y border-purple-700">
                    <FaPhone className="text-purple-400" />
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border-r border-y border-purple-700 rounded-r-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Address Line 1*</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St"
                  className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address2"
                  placeholder="Apt 4B, Floor 2, etc."
                  className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Country*</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Postal Code*</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="12345"
                    className="w-full px-4 py-2 bg-[#2c2c3e] border border-purple-700 rounded-lg focus:ring-2 focus:ring-[#8B5DFF] text-white"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep('summary')}
                  className="flex-1 py-3 rounded-lg border border-purple-700 text-white font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#8B5DFF] hover:bg-[#6A42C2] text-white font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  Continue to Payment
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Payment form */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">Total: ${(amount + (needsShipping ? 5 : 0)).toFixed(2)}</p>
                <div className="flex items-center text-green-400 text-sm">
                  <FaLock className="mr-1" />
                  Secure Payment
                </div>
              </div>

              {needsShipping && (
                <div className="p-3 bg-[#2c2c3e] rounded-lg border border-purple-700 mb-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Shipping to:</span><br />
                    {formData.fullName}<br />
                    {formData.address}{formData.address2 ? `, ${formData.address2}` : ''}<br />
                    {formData.city}, {formData.state} {formData.postalCode}<br />
                    {formData.country}<br />
                    {formData.phoneNumber}
                  </p>
                </div>
              )}

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
                  onClick={() => setStep(needsShipping ? 'address' : 'summary')}
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

