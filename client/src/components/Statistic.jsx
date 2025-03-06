import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/UserS.css"; // Import external styles
import { CiCircleMore } from "react-icons/ci";

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
       const [searchTerm, setSearchTerm] = useState("");

  const loggedInUserEmail =
    JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/user");
        if (!response.ok) throw new Error("Failed to fetch users");

        const { data } = await response.json();
        const filteredUsers = data.filter(
          (user) => user.createdBy === loggedInUserEmail
        );
        const emails = filteredUsers.map((user) => user.userEmail); // Extract emails

        setUserEmails(emails);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserList();
  }, [loggedInUserEmail]);

  useEffect(() => {
    if (userEmails.length === 0) return;

    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/bulkUpload/allstatistics"
        );
        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();
        const filteredStatistics = data.filter((stat) =>
          userEmails.includes(stat.email)
        );

        setStatistics(filteredStatistics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userEmails]);

  return (
    <div className="main1">
      <div className="main-con1">
        {showSidebar && <Sidebar userEmail={loggedInUserEmail} />}
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
                    <div
                      className={`left110 ${!showSidebar ? "expanded" : ""}`}
                    >
                      <div className="statistics-page">
                        {loading ? (
                          <p>Loading statistics...</p>
                        ) : error ? (
                          <p style={{ color: "red" }}>{error}</p>
                        ) : statistics.length > 0 ? (
                          <div className="table-container">
                            <table className="statistics-table">
                              <thead>
                                <tr>
                                  <th>Sr No.</th>
                                  <th>Task</th>
                                  <th>Email</th>
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
                                {statistics.map((stat, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{stat.task}</td>
                                    <td>{stat.email}</td>
                                    <td>{stat.filename}</td>
                                    <td>{stat.linkUpload}</td>
                                    <td>{stat.duplicateCount}</td>
                                    <td>{stat.netNewCount}</td>
                                    <td>{stat.newEnrichedCount}</td>
                                    <td>{stat.creditUsed}</td>
                                    <td>{stat.remainingCredits}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p>No statistics available.</p>
                        )}
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

export default Statistics;
