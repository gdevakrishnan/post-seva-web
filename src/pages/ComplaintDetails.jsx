import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../static/complaints.css";
import { createFeedback, fetchComplaintById, trackingComplaint } from "../services/serviceWorker";
import appContext from "../context/appContext";
import { IoSend } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi2";

function ComplaintDetails() {
    const { id } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { sidebarIsCollapse, userDetails } = useContext(appContext);
    const { userId } = userDetails;

    // Feedback
    const feedbackInitialState = {
        userId,
        complaintId: id,
        feedback: ""
    }
    const [feedback, setFeedback] = useState(feedbackInitialState);

    const handleFeedbackSubmit = (e) => {
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

        console.log(forwardData);


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

    const loadComplaint = async () => {
        try {
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
            style={{
                width: sidebarIsCollapse
                    ? "100vw"
                    : `calc(100vw - 250px + 80px)`,
                float: "right",
            }}
        >
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
                            <td>{complaint.status}</td>
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
        </section>
    );
}

export default ComplaintDetails;
