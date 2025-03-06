import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../css/UserS.css"; // Import external styles
import { CiCircleMore } from "react-icons/ci";

const AdminCreditReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/super-admin/get-credit-transactions");
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
      } else {
        setError("Failed to fetch transactions.");
      }
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
                  <button  className="refresh"onClick={fetchTransactions} style={{ marginBottom: "10px" }}>🔄 Refresh</button>
                </li>
              </div>
            </nav>
            <section>
              <div className="main-body110">
                
                <div className="main-body-u">
                  
                <div className={`left1111 ${!showSidebar ? "expanded" : ""}`}>
                
                    <div className="statistics-page">
                    

        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          
          <div className="table-container">
           
            <table className="statistics-table">
            <thead>
              <tr>
                <th>Sr .No</th>
                <th>Date</th>
                <th>Sender Email</th>
                <th>Recipient Email</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Remaining Credits</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{new Date(txn.date).toLocaleString()}</td>
                    <td>{txn.senderEmail || "N/A"}</td>
                    <td>{txn.recipientEmail || "N/A"}</td>
                    <td>{txn.transactionType || "Credit Assigned"}</td>
                    <td>{txn.amount || "0"}</td>
                    <td>{txn.remainingCredits || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
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


export default AdminCreditReport;
