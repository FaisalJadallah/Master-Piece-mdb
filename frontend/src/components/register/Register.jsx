import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { registerUser, loginUser } from "../../utils/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First, register the user
      const registerResponse = await registerUser({
        username,
        email,
        password,
        role: "user"
      });
      
      setMessage(registerResponse.data.message);
      
      if (registerResponse.data.message === "User registered successfully") {
        // Then automatically log in the user
        try {
          const loginResponse = await loginUser({ email, password });
          
          // Store token and user data in localStorage
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("userId", loginResponse.data.user.id);
          localStorage.setItem("userRole", loginResponse.data.user.role);
          
          setMessage("Account created and logged in successfully!");
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate("/");
          }, 1000);
          
        } catch (loginError) {
          console.error('Auto-login error:', loginError);
          setMessage("Account created! Please log in manually.");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(
        error.response
          ? error.response.data.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 relative">
      {/* Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-full p-3 transition-all duration-300 shadow-lg z-10"
        aria-label="Return to home"
      >
        <Home size={24} />
      </button>
      
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#1e1e2f] rounded-2xl shadow-2xl overflow-hidden relative border border-purple-700">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-purple-800 to-purple-600 flex flex-col justify-center text-white relative">
          <h2 className="text-4xl font-extrabold mb-6 drop-shadow-[0_0_10px_#ffffff66]">Welcome, Gamer!</h2>
          <p className="text-purple-100 text-lg mb-8">
            Level up your experience. Create your player account now and join the game.
          </p>
          <div className="flex space-x-3">
            <div className="h-2 w-16 bg-white rounded-full opacity-50"></div>
            <div className="h-2 w-8 bg-white rounded-full opacity-30"></div>
            <div className="h-2 w-4 bg-white rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#1e1e2f] text-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-purple-400">Create Your Account</h2>
            <p className="text-gray-400 mt-2">Start your journey</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm ${
                message.includes("successfully")
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-purple-300">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#2c2c3e] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-1 text-purple-300">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#2c2c3e] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-1 text-purple-300">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#2c2c3e] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5 border-purple-500 focus:ring-purple-500 bg-[#2c2c3e]"
                required
                disabled={isLoading}
              />
              <label className="text-sm text-gray-400">
                I agree to the{" "}
                <span className="text-purple-300 underline">Terms</span> &{" "}
                <span className="text-purple-300 underline">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 ${
                isLoading 
                  ? "bg-purple-600 cursor-not-allowed" 
                  : "bg-purple-700 hover:bg-purple-800"
              } text-white font-bold rounded-lg transition duration-300 shadow-[0_0_10px_#8B5DFF] flex justify-center items-center`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Join Now"
              )}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-purple-300 hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
