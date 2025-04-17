import React from "react";
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar /> 
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
      </Router>
    </CartProvider>
  );
};

export default App;
