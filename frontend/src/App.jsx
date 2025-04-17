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
import AdminProtectedPage from "./components/admin/AdminTournaments";
import { CartProvider } from "./context/CartContext";
import AdminDashboard from "./components/admin/AdminDashboard";

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
          <Route path="/admin/tournaments" element={<AdminProtectedPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
