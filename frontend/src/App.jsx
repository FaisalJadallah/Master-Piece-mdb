import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Register from "./components/register/Register";
import Store from "./components/store/Store";
import PlatformCards from "./components/store/PlatformCards";
import CardDetails from "./components/store/CardDetails";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/:platformId" element={<PlatformCards />} />
          <Route path="/store/:platformId/card/:cardId" element={<CardDetails />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
