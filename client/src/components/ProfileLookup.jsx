import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/ProfileLookup.css";

const ProfileLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [linkedinLink, setLinkedinLink] = useState("");
  const [resultData, setResultData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lookupCount, setLookupCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email || "Guest";

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    } else {
      fetchUserCredits(); // Fetch user credits on component mount
      fetchUserStatistics(); // Fetch user statistics
    }
  }, []);

  // Fetch user credits from the database
  const fetchUserCredits = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch lookup credits");

      const data = await response.json();
      const currentUser = data.data.find((u) => u.userEmail === userEmail);

      if (currentUser) {
        setLookupCount(currentUser.credits); // Set the lookup credits from the response
      }
    } catch (error) {
      console.error("Error fetching lookup credits:", error);
    }
  };

  // Fetch user statistics from localStorage
  const fetchUserStatistics = () => {
    let userStats = JSON.parse(localStorage.getItem("statisticsData")) || {};
    const userStat = userStats[userEmail] || {};
    setLookupCount(userStat.remainingCredits || lookupCount);
  };

  // Function to update user credits in the database
  const updateUserCredits = async (newCredits) => {
    try {
      await fetch(`http://localhost:3000/users/update-credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userEmail, credits: newCredits }),
      });
    } catch (error) {
      console.error("Error updating user credits:", error);
    }
  };

  // Handle LinkedIn Profile Lookup
  const handleSearch = async () => {
    if (!linkedinLink.match(/([a-z]{2,3}\.)?linkedin\.com\/.+$/)) {
      alert("Invalid LinkedIn link. Please try again.");
      return;
    }

    if (lookupCount <= 0) {
      alert("You have no remaining lookups.");
      return;
    }

    try {
      setIsLoading(true);

      const apiUrl = `http://localhost:3000/mobileEnrichments/mobileEnrichment/single/${encodeURIComponent(linkedinLink)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      if (data.data) {
        setResultData(data.data);
        setShowModal(true);

        // Fetch existing user statistics from localStorage
        let userStats = JSON.parse(localStorage.getItem("statisticsData")) || {};
        let userPreviousSearches = userStats[userEmail]?.uploadedLinks || [];

        const isDuplicate = userPreviousSearches.includes(linkedinLink);
        const duplicateCount = (userStats[userEmail]?.duplicateCount || 0) + (isDuplicate ? 1 : 0);
        const netNewCount = (userStats[userEmail]?.netNewCount || 0) + (isDuplicate ? 0 : 1);
        const newEnrichedCount = (userStats[userEmail]?.newEnrichedCount || 0) + 1;
        const creditUsed = (userStats[userEmail]?.creditUsed || 0) + 20;
        const remainingCredits = Math.max(0, lookupCount - 20);

        // Update statistics
        const updatedStatistics = {
          email: userEmail,
          filename: linkedinLink,
          duplicateCount,
          netNewCount,
          newEnrichedCount,
          creditUsed,
          remainingCredits,
          uploadedLinks: [...userPreviousSearches, linkedinLink], // Store searched links
        };

        // Save updated statistics locally
        userStats[userEmail] = updatedStatistics;
        localStorage.setItem("statisticsData", JSON.stringify(userStats));

        // Save updated statistics to backend
        await fetch(`http://localhost:3000/bulkUpload/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedStatistics),
        });

        // Update backend and localStorage with remaining credits
        await updateUserCredits(remainingCredits);

        // Update UI count
        setLookupCount(remainingCredits);
      } else {
        alert("No data found for the provided LinkedIn URL.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar userEmail={userEmail} />
      <div className="main-content">
        <div className="header">
          <h1 className="profile-lookup">Profile Lookup</h1>
          <p>Your Remaining Lookups: {lookupCount}</p>
        </div>
        <div className="explore-section">
          <div className="search-box">
            <input
              type="url"
              placeholder="Enter a LinkedIn profile link"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
            />
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={lookupCount <= 0}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {showModal && resultData && (
            <div className="modal-overlay-1">
              <div className="modal-container-1">
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <div className="modal-header-1">
                  <h2>LinkedIn Profile Data</h2>
                </div>
                <div className="modal-body-1">
                  <div className="info-row-1">
                    <strong>LinkedIn Link:</strong>{" "}
                    <a
                      href={resultData.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {resultData.linkedin_url || "Not Available"}
                    </a>
                  </div>
                  <div className="info-row-1">
                    <strong>Full Name:</strong>{" "}
                    <span>{resultData.full_name || "N/A"}</span>
                  </div>
                  <div className="info-row-1">
                    <strong>Lead Location:</strong>{" "}
                    <span>
                      {Array.isArray(resultData.lead_location)
                        ? resultData.lead_location.join(", ")
                        : "Not Available"}
                    </span>
                  </div>
                  <div className="info-row-1">
                    <strong>Mobile 1:</strong>{" "}
                    <span>{resultData.mobile_1 || "Not Available"}</span>
                  </div>
                  <div className="info-row-1">
                    <strong>Mobile 2:</strong>{" "}
                    <span>{resultData.mobile_2 || "Not Available"}</span>
                  </div>
                </div>
                <div className="modal-footer-1">
                  <button
                    className="action-button-1"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLookup;
