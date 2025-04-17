import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TournamentCheckout.css';

const TournamentCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gamerTag: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    billingAddress: '',
    acceptTerms: false
  });

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get(`http://localhost:5000/tournaments/${id}`);
        
        // Check if tournament is full
        if (response.data.currentParticipants >= response.data.maxParticipants) {
          setError('This tournament is already full');
          setLoading(false);
          return;
        }
        
        setTournament(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tournament details. Please try again later.');
        setLoading(false);
        console.error('Error fetching tournament details:', err);
      }
    };

    fetchTournament();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('You must accept the terms and conditions to proceed');
      return;
    }
    
    try {
      setLoading(true);
      
      // Replace with your actual API endpoint
      await axios.post(`http://localhost:5000/tournaments/${id}/register`, {
        fullName: formData.fullName,
        email: formData.email,
        gamerTag: formData.gamerTag,
        // Add other necessary details
      });
      
      // Redirect to confirmation page
      navigate(`/tournaments/${id}/confirmation`);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      console.error('Error during registration:', err);
    }
  };

  if (loading) {
    return <div className="checkout-container loading">Loading checkout...</div>;
  }

  if (error) {
    return <div className="checkout-container error">
      <p>{error}</p>
      <button onClick={() => navigate('/tournaments')}>Back to Tournaments</button>
    </div>;
  }

  if (!tournament) {
    return <div className="checkout-container not-found">Tournament not found</div>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Registration Checkout</h1>
        <h2>{tournament.name}</h2>
      </div>

      <div className="checkout-summary">
        <div className="tournament-summary">
          <h3>Tournament Details</h3>
          <p><span>Date:</span> {new Date(tournament.date).toLocaleDateString()}</p>
          <p><span>Location:</span> {tournament.location}</p>
          <p><span>Game:</span> {tournament.gameTitle}</p>
        </div>
        <div className="price-summary">
          <h3>Price Summary</h3>
          <div className="price-row">
            <span>Registration Fee</span>
            <span>${tournament.registrationFee}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>${tournament.registrationFee}</span>
          </div>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Player Information</h3>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gamerTag">Gamer Tag</label>
            <input
              type="text"
              id="gamerTag"
              name="gamerTag"
              value={formData.gamerTag}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                checked={formData.paymentMethod === 'creditCard'}
                onChange={handleChange}
              />
              <label htmlFor="creditCard">Credit Card</label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
              />
              <label htmlFor="paypal">PayPal</label>
            </div>
          </div>

          {formData.paymentMethod === 'creditCard' && (
            <div className="credit-card-details">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expirationDate">Expiration Date</label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="billingAddress">Billing Address</label>
                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {formData.paymentMethod === 'paypal' && (
            <div className="paypal-info">
              <p>You will be redirected to PayPal to complete your payment after clicking "Complete Registration".</p>
            </div>
          )}
        </div>

        <div className="form-section terms">
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms">
              I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>
            </label>
          </div>
        </div>

        <div className="checkout-actions">
          <button type="button" className="back-button" onClick={() => navigate(`/tournaments/${id}`)}>
            Back to Tournament
          </button>
          <button type="submit" className="payment-button">
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default TournamentCheckout; 