// src/pages/AdminTournaments.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullAdminTournaments from "../../components/admin/AdminTournaments"; // الكود القديم الكامل

const AdminProtectedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/login"); // أو "/"
    }
  }, [navigate]);

  return <FullAdminTournaments />;
};

export default AdminProtectedPage;
