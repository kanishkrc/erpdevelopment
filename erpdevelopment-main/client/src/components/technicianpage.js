import React from "react";
import { useNavigate } from "react-router-dom";

const TechnicianPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout/technician", { method: "GET" });
      const data = await response.json();
      if (data.redirectUrl) {
        navigate(data.redirectUrl);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <h1>Hi, I am a Technician</h1>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default TechnicianPage;
