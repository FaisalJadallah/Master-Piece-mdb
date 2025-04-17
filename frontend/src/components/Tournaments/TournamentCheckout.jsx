import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCreditCard, FaPaypal } from 'react-icons/fa';

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
  });
  const [processingPayment, setProcessingPayment] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    try {
      // Register the participant with the tournament
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        teamName: formData.teamName,
        // Add user ID if user is logged in
        userId: localStorage.getItem('userId') || null
      };
      
      // Call the registration API
      await axios.post(`${API_URL}/tournaments/${id}/register`, userData);
      
      // Show success message and redirect to tournament page
      setTimeout(() => {
        alert("Registration successful! You have been registered for the tournament.");
        navigate(`/tournaments/${id}`);
      }, 1000);
    } catch (error) {
      setProcessingPayment(false);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`/tournaments/${id}`} className="flex items-center text-purple-400 hover:text-purple-300">
            <FaArrowLeft className="mr-2" />
            Back to Tournament
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-[#FFF7D1] mb-6">Registration</h1>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">Team/Gamer Name</label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5DFF]"
                      required
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-[#FFF7D1]">Payment Method</h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mr-2"
                        />
                        <label htmlFor="card" className="flex items-center">
                          <FaCreditCard className="mr-2 text-gray-400" /> Credit/Debit Card
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mr-2"
                        />
                        <label htmlFor="paypal" className="flex items-center">
                          <FaPaypal className="mr-2 text-blue-400" /> PayPal
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className={`w-full py-3 text-white font-bold rounded-lg transition-colors duration-200 
                      ${processingPayment 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-[#8B5DFF] hover:bg-[#6A42C2]'}`
                    }
                  >
                    {processingPayment ? 'Processing...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Column */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-bold text-[#FFF7D1] mb-4">Registration Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tournament:</span>
                  <span className="font-medium">{tournament.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium">
                    {new Date(tournament.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prize Pool:</span>
                  <span className="font-medium">{tournament.prize}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Registration Fee:</span>
                  <span>${registrationFee.toFixed(2)}</span>
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