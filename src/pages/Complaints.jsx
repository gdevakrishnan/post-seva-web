import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../static/complaints.css";
import { fetchAllComplaints } from "../services/serviceWorker";
import appContext from "../context/appContext";
import '../static/complaintDetails.css';

const ComplaintList = () => {
  const { sidebarIsCollapse, State } = useContext(appContext);
  const { WalletAddress } = State;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await fetchAllComplaints();
        setComplaints(response.slice().reverse());
      } catch (err) {
        setError("Failed to fetch complaints");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, [complaints, setComplaints]); // Empty dependency array, this only runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="page dashboard_page">
      <div className="blockchain_account">
        <p className="address"><span>Address:</span> {`${WalletAddress.slice(0, 7)}...${WalletAddress.slice(-5)}`}</p>
      </div>
      <div className="complaint-cards">
        {complaints.map((complaint) => (
          <div className="complaint-card" key={complaint._id}>
            <p className="status" style={{ color: (complaint.status == "accepted" || complaint.status == "closed") ? "#00b400" : "#b40000" }}>[{(complaint.status == "closed") ? "solved" : complaint.status}]</p>
            <h3>{complaint.category}</h3>
            <p><strong>Type:</strong> {complaint.type}</p>
            <p><strong>Description:</strong> {complaint.description}</p>
            <Link to={`/complaints/${complaint._id}`} className="view-button">
              View
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

function Complaints() {
  const { State, getStateParameters, sidebarIsCollapse } = useContext(appContext);
  const { WalletAddress } = State;

  // Fetching state parameters when component mounts, only once
  useEffect(() => {
    if (!WalletAddress) {
      getStateParameters();
    }
  }, []); // Only run if WalletAddress is missing

  const ConnectWallet = () => {
    return (
      <section className="page connect-wallet-page">
        <button onClick={() => getStateParameters()} className="connect-wallet-button">
          Connect Wallet
        </button>
      </section >
    );
  };

  return (
    <section>
      {WalletAddress ? <ComplaintList /> : <ConnectWallet />}
    </section>
  );
}

export default Complaints;
