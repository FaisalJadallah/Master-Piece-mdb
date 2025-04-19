import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Register from "./components/register/Register";
import Store from "./components/store/Store";
import PlatformCards from "./components/store/PlatformCards";
import CardDetails from "./components/store/CardDetails";
import Tournaments from "./components/tournaments/Tournaments";
import TournamentDetails from "./components/tournaments/TournamentDetails";
import TournamentCheckout from "./components/tournaments/TournamentCheckout";
import { CartProvider } from "./context/CartContext";
import AdminRoutes from "./components/routes/AdminRoutes";

// ⬇️ Nested app to access location
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:platformId" element={<PlatformCards />} />
        <Route path="/store/:platformId/card/:cardId" element={<CardDetails />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
        <Route path="/tournaments/:id/checkout" element={<TournamentCheckout />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
