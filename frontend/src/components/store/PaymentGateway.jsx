import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaPaypal, FaShoppingCart, FaMapMarkerAlt, FaArrowRight, FaPhone, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import Swal from 'sweetalert2';

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
      // Replace alert with Swal toast for validation error
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required address fields',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#ff9800',
        color: 'white',
        iconColor: 'white'
      });
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
      
      // Replace alert with Swal toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Payment Successful!',
        text: `Your order #${Math.floor(100000 + Math.random() * 900000)} has been processed`,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#4caf50',
        color: 'white',
        iconColor: 'white',
        customClass: {
          popup: 'animated fadeInRight'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      
      onClose();
      navigate('/profile');
    } catch (error) {
      // Replace error alert with Swal toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Payment Failed',
        text: 'Please check your payment details and try again',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#f44336',
        color: 'white',
        iconColor: 'white',
        customClass: {
          popup: 'animated fadeInRight'
        }
      });
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-auto text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {getStepTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center mb-6">
          <div className={`h-2 flex-1 rounded-l-full ${step === 'summary' ? 'bg-yellow-500' : 'bg-yellow-500'}`}></div>
          <div className={`h-2 flex-1 ${step === 'address' || step === 'payment' ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
          <div className={`h-2 flex-1 rounded-r-full ${step === 'payment' ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
        </div>

        {step === 'summary' ? (
          <>
            {/* Order summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold text-white">Order Details</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <FaShoppingCart className="mr-1" />
                  {cardDetails.items.length} items
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {cardDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-800">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden border border-gray-700">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2240%22%20height%3D%2240%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2220%22%20font-size%3D%228%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23fff%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-yellow-500">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-white">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Shipping:</span>
                  <span className="text-white">{needsShipping ? '$5.00' : '$0.00'}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Tax:</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4 pt-3 border-t border-gray-800">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-500">${(amount + (needsShipping ? 5 : 0)).toFixed(2)}</span>
                </div>
              </div>
              
              {needsShipping && (
                <div className="mt-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800">
                  <div className="flex items-center text-yellow-500 mb-2">
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
              className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-all duration-300 flex items-center justify-center"
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
                <label className="block text-sm mb-1 text-gray-300">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Phone Number*</label>
                <div className="flex items-center">
                  <span className="bg-gray-800 p-2 rounded-l-lg border-l border-y border-gray-700">
                    <FaPhone className="text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="123-456-7890"
                    className="flex-1 px-4 py-2 bg-gray-800 border-r border-y border-gray-700 rounded-r-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Address Line 1*</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address2"
                  placeholder="Apt, Suite, etc."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">City*</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">State/Province*</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Country*</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Postal Code*</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('summary')}
                  className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Payment Form */}
            <div className="mb-6">
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                  } transition-colors`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard className="mr-2" />
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                    paymentMethod === 'paypal'
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                  } transition-colors`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <FaPaypal className="mr-2" />
                  PayPal
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {paymentMethod === 'card' ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-300">Card Number*</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-300">Cardholder Name*</label>
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                        required
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm mb-1 text-gray-300">Expiry Date*</label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                          required
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-300">CVV*</label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                          required
                          value={formData.cvv}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm mb-1 text-gray-300">PayPal Email*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="flex items-center mb-6 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <FaLock className="text-yellow-500 mr-2" />
                  <p className="text-sm text-gray-300">
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(needsShipping ? 'address' : 'summary')}
                    className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 rounded-lg transition-colors ${
                      loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-800 border-t-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Complete Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;

