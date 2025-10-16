import "../styles/Navbar.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

 function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     fetch("/isloggedin")
//       .then((res) => res.json())
//       .then((data) => setIsLoggedIn(data.isLoggedIn))
//       .catch((err) => console.error("Error checking login status:", err));
//   }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">ErrorDetector</span>
      </div>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/category">Category</Link>
        <Link to="/events">Events</Link>
        <Link to="/directory">Directory</Link>

        {/* Show Form link only if the user is logged in */}
        {1 && <Link to="/form">Form</Link>}

        <input type="text" placeholder="Search" className="navbar-search" />
        <div className="dropdown">
          <button className="dropdown-button">Login</button>
          <div className="dropdown-content">
            <Link to="/admin-login">Admin Login</Link>
            <Link to="/technician-login">Technician Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
