import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/MainPage.css";

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/isloggedin")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.isLoggedIn))
      .catch((err) => console.error("Error checking login status:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.redirectUrl) {
        setIsLoggedIn(true); 
        navigate(data.redirectUrl); 
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/logout", { method: "GET" });
      setIsLoggedIn(false); // Update login state
      setFormData({ username: "", email: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="main-page">
      <Navbar />
      <div className="main-content">
        {isLoggedIn ? (
          // Display only the description and logout button after login
          <div className="description-content">
            <h2>Welcome to ErrorDetector</h2>
            <p>
              ErrorDetector is your go-to platform for managing and detecting errors in your systems. 
              You are now logged in and can access your dashboard to manage your requests efficiently.
            </p>
            <button className="logout-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          // Display the login form and description before login
          <div className="content-container">
            <div className="login-card">
            <h1 style={{ color: 'white' }}>User Login</h1>
              <form className="login-form" onSubmit={handleSubmit}>
                <label>
                  Username:
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Password:
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
              <div className="signup-option">
                <p>Don't have an account?</p>
                <Link to="/signup" className="signup-link">
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="description-content">
              <h2>Welcome to ErrorDetector</h2>
              <p>
                ErrorDetector is your go-to platform for managing and detecting errors in your systems. 
                Log in to access your dashboard and start managing your requests efficiently.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;