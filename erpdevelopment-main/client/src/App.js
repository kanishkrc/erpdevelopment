import React from "react";
import MainPage from "./components/MainPage";
import AdminPage from "./components/adminpage";
import TechnicianPage from "./components/technicianpage";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/AdminLogin";
import TechnicianLogin from "./components/TechnicianLogin";
import SignupPage from "./components/SignupPage";
import ErrorDetectorForm from "./components/ErrorDetectorForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/technician" element={<TechnicianPage />} />
        <Route path="/form" element={<ErrorDetectorForm />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/technician-login" element={<TechnicianLogin />} />
      
      </Routes>
    </Router>
  );
}

export default App;
