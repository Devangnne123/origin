import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import "../css/UserStatistic.css"; // Import external styles

const UserStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve the logged-in user's email
  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!userEmail || userEmail === "Guest") return;

      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3000/bulkUpload/userStatistics?email=${userEmail}`
        );

        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();

        setStatistics(data.length > 0 ? data : []);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [userEmail]);

  // Function to format date to dd-mm-yy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="dashboard">
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <h1 className="profile-lookup">Statistics</h1>
        </div>

        <div className="statistics-page">
          {loading ? (
            <p>Loading statistics...</p>
          ) : (
            <div className="table-container">
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Task</th>
                    <th>Date</th>
                    <th>File Name / LinkedIn Link</th>
                    <th>Link Upload</th>
                    <th>Duplicate Count</th>
                    <th>Net New Count</th>
                    <th>New Enriched Count</th>
                    <th>Credits Used</th>
                    <th>Remaining Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.length > 0 ? (
                    statistics.map((stat, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{stat.task}</td>
                        <td>{formatDate(stat.date)}</td>
                        <td>{stat.filename}</td>
                        <td>{stat.linkUpload}</td>
                        <td>{stat.duplicateCount}</td>
                        <td>{stat.netNewCount}</td>
                        <td>{stat.newEnrichedCount}</td>
                        <td>{stat.creditUsed}</td>
                        <td>{stat.remainingCredits}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="no-data">
                        No statistics available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
