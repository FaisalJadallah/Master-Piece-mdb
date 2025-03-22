import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      setMessage(response.data.message);
      if (response.data.message === "Logged in successfully") {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.message
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#1e1e2f] rounded-2xl shadow-2xl overflow-hidden relative border border-purple-700">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-purple-800 to-purple-600 flex flex-col justify-center text-white relative">
          <h2 className="text-4xl font-extrabold mb-6 drop-shadow-[0_0_10px_#ffffff66]">Welcome Back</h2>
          <p className="text-purple-100 text-lg mb-8">
            Ready to continue your journey? Log in and get back in the game.
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
            <h2 className="text-3xl font-bold text-purple-400">Login to Your Account</h2>
            <p className="text-gray-400 mt-2">Access your gaming world</p>
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
              <label className="block mb-1 text-purple-300">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#2c2c3e] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-purple-300">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#2c2c3e] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5 border-purple-500 focus:ring-purple-500 bg-[#2c2c3e]"
              />
              <label className="text-sm text-gray-400">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition duration-300 shadow-[0_0_10px_#8B5DFF]"
            >
              Log In
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don’t have an account?{" "}
              <a href="/register" className="text-purple-300 hover:underline">
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
