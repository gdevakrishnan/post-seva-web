import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../static/complaints.css";
import { createFeedback, fetchComplaintById, trackingComplaint, updateStatus } from "../services/serviceWorker";
import appContext from "../context/appContext";
import { IoSend } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi2";
import { IoCaretBackOutline } from "react-icons/io5";

function ComplaintDetails() {
    const web3InitialState = {
        "userID": "",
        "postalCode": "",
        "description": "",
        "feedback": "",
        "feedbackAuthor": "",
        "status": 0,
        "staff": ""
    }
    const [web3Data, setWeb3Data] = useState(web3InitialState);
    const { id } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const { sidebarIsCollapse, userDetails, State } = useContext(appContext);
    const { userId } = userDetails;
    const { WriteContract, ReadContract } = State;

    const getComplaintWeb3 = async () => {
        // Status update to rejected
        console.log("Please wait to Rejected the complaint...");
        const tx = await ReadContract.getComplaint(id);
        const { userId, postOfficeCode, description, feedback, feedbackAuthor, status, staff } = tx;

        setWeb3Data({
            userID: userId,
            postalCode: postOfficeCode,
            description,
            feedback,
            feedbackAuthor,
            status,
            staff
        })
    }

    useEffect(() => {
        getComplaintWeb3();
    }, [complaint]);

    // Feedback
    const feedbackInitialState = {
        userId,
        complaintId: id,
        feedback: ""
    }
    const [feedback, setFeedback] = useState(feedbackInitialState);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (feedback.complaintId.trim() === "") {
            alert("Complaint not found");
            return;
        }
        if (feedback.feedback.trim() === "") {
            alert("Enter the feedback")
            return;
        }
        if (feedback.userId.trim() === "") {
            alert("User ID not found");
            return;
        }

        console.log("Please wait to submit your feedback...");
        const tx = await WriteContract.addFeedback(feedback.complaintId, feedback.userId, feedback.feedback);
        await tx.wait();

        createFeedback(feedback)
            .then((response) => {
                if (response.status == 200) {
                    alert(response.data.message);
                    loadComplaint();
                    setFeedback(feedbackInitialState);
                }
            })
            .catch((e) => console.log(e.message));
    }

    // Forward check box
    const [isChecked, setIsChecked] = useState(false);
    const forwardInitalState = {
        complaintId: id,
        staff: ""
    }
    const [forwardData, setForwardData] = useState(forwardInitalState)

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    // handle forward data
    const handleForwardSubmit = async (e) => {
        e.preventDefault();
        if (forwardData.complaintId.trim() === "") {
            alert("Complaint not found");
            return;
        }
        if (forwardData.staff.trim() === "") {
            alert("Enter the staff name")
            return;
        }

        // Assign staff
        console.log("Please wait to assign a staff...");
        const tx = await WriteContract.assignStaff(forwardData.complaintId, forwardData.staff);
        await tx.wait();

        await trackingComplaint(forwardData)
            .then((response) => {
                if (response.status == 200) {
                    alert("Staff assigned successfully");
                    loadComplaint();
                    setForwardData(forwardInitalState);
                }
            })
            .catch((e) => console.log(e.message));
    }

    // Actions
    const handleAccept = async (e) => {
        e.preventDefault();

        // Accept the complaint
        console.log("Please wait...");

        var tx = await WriteContract.fileComplaint(
            id,
            userId,
            complaint.description,
            complaint.complaintOffice
        )
        await tx.wait();
        console.log("Inserted successfully");

        // Status update to accept
        console.log("Please wait to accept the complaint...");
        tx = await WriteContract.updateComplaintStatus(id, 1);
        await tx.wait();

        console.log("Accepted successfully");

        const statusData = {
            "complaintId": id,
            "status": "accepted"
        }
        await updateStatus(statusData)
            .then((response) => {
                if (response.status == 200) {
                    alert(response.data.message);
                    loadComplaint();
                }
            })
            .catch((e) => console.log(e.message));
    }

    const handleDecline = async (e) => {
        e.preventDefault();
        const statusData = {
            "complaintId": id,
            "status": "rejected"
        }

        // Status update to rejected
        console.log("Please wait to Rejected the complaint...");
        const tx = await WriteContract.updateComplaintStatus(id, 5);
        await tx.wait();

        await updateStatus(statusData)
            .then((response) => {
                if (response.status == 200) {
                    alert(response.data.message);
                    loadComplaint();
                }
            })
            .catch((e) => console.log(e.message));
    }

    const handleSolved = async (e) => {
        e.preventDefault();
        const statusData = {
            "complaintId": id,
            "status": "closed"
        }

        // Status update to closed
        console.log("Please wait to Closed the complaint...");
        const tx = await WriteContract.updateComplaintStatus(id, 4);
        await tx.wait();

        await updateStatus(statusData)
            .then((response) => {
                if (response.status == 200) {
                    alert(response.data.message);
                    loadComplaint();
                }
            })
            .catch((e) => console.log(e.message));
    }

    // Load Complaint
    const loadComplaint = async () => {
        try {
            // Web2
            await fetchComplaintById({ complaintId: id })
                .then((response) => {
                    setComplaint(response);
                })
                .catch((e) => console.log(e.message)
                );
        } catch (err) {
            setError("Failed to fetch complaint details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaint();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!complaint) return <div>No data available</div>;

    return (
        <section
            className="page complaint_page"
        >
            <div className="buttons">
                <div className="actions">
                    <button className="btn back" onClick={(e) => {
                        e.preventDefault();
                        nav('/complaints');
                    }}>
                        <IoCaretBackOutline /> Back
                    </button>
                </div>

                <div className="actions">
                    {
                        (complaint.status == "accepted" || complaint.status == "closed") ? (
                            <button className="btn solved accept"
                                onClick={(e) => handleSolved(e)}
                            >Resolved</button>
                        ) : (
                            <button className="btn accept"
                                onClick={(e) => handleAccept(e)}
                            >Accept</button>
                        )
                    }
                    <button className="btn decline"
                        onClick={(e) => handleDecline(e)}
                    >Decline</button>
                </div>
            </div>
            <div className="complaint-details">
                <h1>Complaint Details</h1>

                <table className="complaint-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>{complaint.category}</td>
                        </tr>
                        <tr>
                            <th>Service</th>
                            <td>{complaint.service}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{complaint.type}</td>
                        </tr>
                        <tr>
                            <th>Complaint Number</th>
                            <td>{complaint.complaintNumber}</td>
                        </tr>
                        <tr>
                            <th>Complaint Date</th>
                            <td>{new Date(complaint.complaintDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th>Complaint Office</th>
                            <td>{complaint.complaintOffice}</td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>{complaint.description}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td className="status" style={{ color: (complaint.status == "accepted" || complaint.status == "closed") ? "#00b400" : "#b40000" }}>[{(complaint.status == "closed") ? "solved" : complaint.status}]</td>
                        </tr>
                        <tr>
                            <th>Created At</th>
                            <td>{new Date(complaint.createdAt).toLocaleString()}</td>
                        </tr>

                        {/* Conditionally render staff if it exists */}
                        {complaint.staff && (
                            <tr>
                                <th>Current Staff</th>
                                <td>{complaint.staff}</td>
                            </tr>
                        )}

                        {/* Conditionally render tracking history if it exists */}
                        {complaint.tracking && complaint.tracking.length > 0 && (
                            <tr>
                                <th>Tracking History</th>
                                <td>
                                    <table className="tracking-history-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Staff Name</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaint.tracking.map((entry, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{entry.name}</td>
                                                    <td>{new Date(entry.date).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* {complaint.supportingDocuments.length > 0 && (
                    <div className="supporting-documents">
                        <strong>Supporting Documents:</strong>
                        <ul>
                            {complaint.supportingDocuments.map((doc, index) => (
                                <li key={index}>{doc}</li>
                            ))}
                        </ul>
                    </div>
                )} */}

                {/* Forward */}
                <form className="forward_form">
                    <div className="formgroup">
                        <input
                            type="checkbox"
                            name="forward"
                            id="forward"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="forward">Do you want to forward?</label>
                    </div>
                    {isChecked && (
                        <div className="formgroup forward_user">
                            <input
                                type="text"
                                name="forwardUserId"
                                id="forwardUserId"
                                placeholder="Forwarded To.."
                                onChange={(e) => setForwardData({ ...forwardData, staff: e.target.value })}
                                value={forwardData.staff}
                            />
                            <button className="submit_btn btn" onClick={(e) => handleForwardSubmit(e)}>
                                <IoSend />
                            </button>
                        </div>
                    )}
                </form>

                <div className="feedbacks">
                    <h1></h1>
                    <strong>Feedback:</strong>
                    <form className="feedback_form form">
                        <div className="formgroup">
                            <input type="text" name="feedback" id="feedback"
                                placeholder="Give your Feedback"
                                onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })}
                                value={feedback.feedback}
                            />
                            <button className="submit_btn btn" onClick={(e) => handleFeedbackSubmit(e)}>
                                <IoSend />
                            </button>
                        </div>
                    </form>
                    {complaint.feedbacks && complaint.feedbacks.length > 0 && (
                        <ul>
                            {complaint.feedbacks.map((feedback, index) => (
                                <li key={index}>
                                    <p className="user"><span><HiUserCircle /></span>{feedback.userId}</p>
                                    <p className="feedback">{feedback.feedback}</p>
                                    <p className="date">{new Date(feedback.createdAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {
                web3Data.postalCode.trim() !== "" && postalCode.trim() !== "" && web3Data.description.trim() !== "" && web3Data.feedback.trim() !== "" && web3Data.feedbackAuthor.trim() !== "" && web3Data.status != 0 && web3Data.staff.trim() !== "" && 
                <div className="web3-table complaint-details">
                    <h1>Verify Data</h1>
                    <table className="complaint-table">
                        <tbody>
                            <tr>
                                <th>Complaint Office</th>
                                <td>{web3Data.postalCode}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{web3Data.description}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                { (web3Data.status == 1) ? (<td style={{color: "#00b400"}}>Accepted</td>) : null }
                                { (web3Data.status == 4) ? (<td style={{color: "#00b400"}}>Closed</td>) : null }
                                { (web3Data.status == 5) ? (<td style={{color: "#b40000"}}>Rejected</td>) : null }
                            </tr>
                            {/* Conditionally render staff if it exists */}
                            {web3Data.staff && (
                                <tr>
                                    <th>Current Staff</th>
                                    <td>{web3Data.staff}</td>
                                </tr>
                            )}
                            {
                                web3Data.feedback && web3Data.feedbackAuthor && (
                                    <Fragment>
                                        <tr>
                                            <th>Feedback</th>
                                            <td>{web3Data.feedback}</td>
                                        </tr>
                                        <tr>
                                            <th>Feedback AUthor</th>
                                            <td>{web3Data.feedbackAuthor}</td>
                                        </tr>
                                    </Fragment>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            }
        </section >
    );
}

export default ComplaintDetails;
