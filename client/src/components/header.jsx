import React from "react";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom"; 
import Login from "./Login";
import SignUp from "./SignUp";
import "../css/Index.css";// Import the useNavigate hook


function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle login button click
  const handleLoginClick = () => {
     // Navigate to the login page
  };

  const handleSignUpClick = () => {
     // Navigate to the login page
  };

  return (
    <div className="MAIN">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
          <Link to="/">
            <img src="new.png" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            
            <li>
              <a href="#">API Reference</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            
          </ul>
          <div className="login-signup">
            <li>
              <button className="login-btn" onClick={()=>setShowModal("login")}>Login</button>
            </li>
            <li>
              <button className="signup-btn" onClick={()=>setShowModal("signup")}>Signup</button>
            </li>
          </div>

          {/* Mobile Menu Button */}
          <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
          </div>
        </div>
      </nav>
        {showModal && (
        <div className="overlay">
          <div className="modal">
            {showModal === "login" ? (
              <Login closeModal={() => setShowModal(null)} setShowModal={setShowModal} />
            ) : (
              <SignUp closeModal={() => setShowModal(null)}  setShowModal={setShowModal}/>
            )}
          </div>
        </div>
      )}
      </div>
   
  );
}

export default Header;
