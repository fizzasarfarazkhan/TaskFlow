// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the logged-in user's session
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.info("You have been logged out.");

    // "/" is the Login page in App.jsx
    navigate("/", { replace: true });
  };

  return (
    <button type="button" className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;