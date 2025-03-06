import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { CiCircleMore } from "react-icons/ci";

import "../css/UserS.css";

const UserCreditReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
  const userEmail =
    JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    fetchCreditTransactions();
  }, []);

  const fetchCreditTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/transactions/credit-transactions/${userEmail}`
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const { data } = await response.json();
      console.log("Fetched Transactions:", data); // Debugging
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
                    
                  <div className={`left11 ${!showSidebar ? "expanded" : ""}`}>
                  
                      <div className="statistics-page">
                      <input
                              type="text"
                              placeholder="Search by Email or Phone..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="search-input1"
                            />
                     
                      
                          <div className="table-container">
                           
                            <table className="statistics-table">
                              <thead>
                              <tr>
              <th>Date</th>
              <th>Sender Email</th> {/* New Column */}
              <th>Transaction</th>
              <th>Amount</th>
              <th>Remaining Credits</th>
            </tr>
                              </thead>
                              <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </td>
                  <td>
                    <td>
                      {transaction.senderEmail === userEmail
                        ? transaction.userEmail
                        : transaction.senderEmail}
                    </td>
                  </td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.remainingCredits}</td>
                </tr>
              ))
            )}
          </tbody>
                            </table>
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
export default UserCreditReport;
