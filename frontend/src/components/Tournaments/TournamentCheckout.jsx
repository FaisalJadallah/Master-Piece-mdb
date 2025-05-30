import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCreditCard, FaPaypal, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000';

const TournamentCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    teamName: '',
    // Payment fields
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    teamName: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  // Regex patterns for validation
  const validationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    cardNumber: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
    expiryDate: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
    cvv: /^[0-9]{3,4}$/,
  };

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tournaments/${id}`);
        setTournament(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tournament details:", err);
        setError("Failed to load tournament details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    if (!value) return "This field is required";
    
    if (validationPatterns[name]) {
      if (!validationPatterns[name].test(value)) {
        switch (name) {
          case 'email':
            return "Please enter a valid email address";
          case 'cardNumber':
            return "Please enter a valid credit card number";
          case 'expiryDate':
            return "Use format MM/YY (e.g. 12/25)";
          case 'cvv':
            return "CVV must be 3 or 4 digits";
          default:
            return "Invalid format";
        }
      }
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate basic fields
    ['fullName', 'email', 'teamName'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate payment fields if card method is selected
    if (paymentMethod === 'card') {
      ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show validation error toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Form Validation Error',
        text: 'Please check the form for errors',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#ff9800',
        color: 'white',
        iconColor: 'white'
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Get the user ID from localStorage
      const userId = localStorage.getItem('userId');
      console.log('User ID from localStorage:', userId);
      
      // Register the participant with the tournament
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        teamName: formData.teamName,
        // Make sure userId is properly passed
        userId: userId
      };
      
      console.log('Sending registration data:', userData);
      
      // Call the registration API
      const response = await axios.post(`${API_URL}/tournaments/${id}/register`, userData);
      console.log('Registration response:', response.data);
      
      // Show success message with Swal toast and redirect to tournament page
      setTimeout(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Tournament Registration Successful!',
          text: `You're all set for ${tournament.gameName}`,
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
        navigate(`/tournaments/${id}`);
      }, 1000);
    } catch (error) {
      setProcessingPayment(false);
      
      // Show error message with Swal toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || "Please try again later",
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
      
      console.error("Registration error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-600 text-white p-4 rounded-lg text-center">
            {error || "Tournament not found"}
          </div>
          <div className="mt-4 text-center">
            <Link to="/tournaments" className="text-purple-400 hover:underline">
              Back to tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate registration fee - you can adjust this logic based on your needs
  const registrationFee = tournament.registrationFee || 10;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`/tournaments/${id}`} className="flex items-center text-yellow-500 hover:text-yellow-400">
            <FaArrowLeft className="mr-2" />
            Back to Tournament
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-yellow-500 mb-6">Tournament Registration</h1>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                      required
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Team/Gamer Name</label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.teamName ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                      required
                    />
                    {formErrors.teamName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.teamName}</p>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
                    <div className="space-y-3">
                      <div className={`flex items-center p-3 rounded-lg border ${paymentMethod === 'card' ? 'border-yellow-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}>
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mr-3 accent-yellow-500"
                        />
                        <label htmlFor="card" className="flex items-center w-full cursor-pointer">
                          <FaCreditCard className={`mr-2 ${paymentMethod === 'card' ? 'text-yellow-500' : 'text-gray-400'}`} /> Credit/Debit Card
                        </label>
                      </div>
                      
                      <div className={`flex items-center p-3 rounded-lg border ${paymentMethod === 'paypal' ? 'border-yellow-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}>
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mr-3 accent-yellow-500"
                        />
                        <label htmlFor="paypal" className="flex items-center w-full cursor-pointer">
                          <FaPaypal className={`mr-2 ${paymentMethod === 'paypal' ? 'text-yellow-500' : 'text-blue-400'}`} /> PayPal
                        </label>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                      <div>
                        <label className="block text-gray-300 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                        />
                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardHolder"
                          placeholder="John Doe"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.cardHolder ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                        />
                        {formErrors.cardHolder && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardHolder}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                          />
                          {formErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-gray-800 border ${formErrors.cvv ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
                          />
                          {formErrors.cvv && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className={`w-full py-3 text-black font-bold rounded-lg transition-colors duration-200 
                      ${processingPayment 
                        ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                        : 'bg-yellow-500 hover:bg-yellow-400'}`
                    }
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-800 border-t-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Column */}
          <div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 shadow-lg sticky top-6">
              <div className="flex items-center mb-4">
                <FaTrophy className="text-yellow-500 mr-2 text-xl" />
                <h2 className="text-xl font-bold text-white">Registration Summary</h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tournament:</span>
                  <span className="font-medium text-white">{tournament.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium text-white">
                    {new Date(tournament.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Pool:</span>
                  <span className="font-medium text-yellow-500">{tournament.prize}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Registration Fee:</span>
                  <span className="text-yellow-500">{registrationFee.toFixed(2)} JOD</span>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                By registering, you agree to abide by the tournament rules and 
                code of conduct. Registration fees are non-refundable.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCheckout; 