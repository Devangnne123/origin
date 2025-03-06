import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CiCircleMore } from "react-icons/ci";
import "../css/UserS.css";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credits, setCredits] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();

  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);
  // Check roleId on page load
  useEffect(() => {
    const roleId = sessionStorage.getItem("roleId");
    if (roleId !== "1") {
      // If the user is not an admin (roleId is not 1), redirect them
      navigate("/profile-lookup"); // Redirect to profile page for non-admin users
    }
  }, [navigate]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("All email and password are required.");
      return;
    }
  
    setIsSubmitting(true);
  
    const createdBy = JSON.parse(sessionStorage.getItem("user"))?.email || "";
  
    const userData = {
      userEmail: email,
      userPassword: password,
      roleId: 2,
      createdBy,
      credits: 0, // Assign default credits
    };
  
    try {
      const response = await fetch("http://localhost:3000/users/newuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        navigate("/user-list");
      } else {
        setErrorMessage(data.message || "Error adding user.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the user.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="main1">
    <div className="main-con1">
      {showSidebar && <Sidebar userEmail={userEmail} />}
      <div className="main-content1">
        <div className="right-side1">
          <div className="right-p1">
            <nav className="main-head1">
              <li>
                <CiCircleMore
                  className="back1 scroll-button"
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              </li>
              <div className="main-title1">
                <li className="profile">
                  <p className="title1">User Statistics</p>
                </li>
                <li>
                  <p className="title-des1">
                    Enrich your data in bulk with our lookup tool
                  </p>
                </li>
              </div>
            </nav>
            <section>
              <div className="main-body110">
                
                <div className="main-body-u">
                  
                <div className={`left1 ${!showSidebar ? "expanded" : ""}`}>
                
                    <div className="statistics-page">
                    
                       
                         <div className="add-user-form-container">
            <form onSubmit={handleAddUser}>
              <div>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter user password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <div>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  placeholder="Default Credits"
                />
              </div> */}

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div>
                <button  className="adduser" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
                         
                        
                     
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};


export default AddUser;
