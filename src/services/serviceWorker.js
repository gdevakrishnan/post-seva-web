import Axios from 'axios';

const BASE_URL = "https://post-seva-server.onrender.com/api";

// REGISTER
export const createUserDetails = async (userDetails) => {
    const task = await Axios.post(`${BASE_URL}/staff/register`, userDetails);
    const response = task.data;
    return response;
}

// LOGIN
export const loginUserDetails = async (userDetails) => {
    const task = await Axios.post(`${BASE_URL}/staff/login`, userDetails);
    const response = task.data;
    return response;
}

// User Verify
export const userVerify = async (userDetails) => {
    const task = await Axios.post(`${BASE_URL}/staff/staff-verify-token`, userDetails);
    const response = task.data;
    return response;
}

// Token Availability
export const verifyId = async (userDetails) => {
    const task = await Axios.post(`${BASE_URL}/staff/check-user-id`, userDetails);
    const response = task.data;
    return response;
}

// Complaints

// get all the complaints
export const fetchAllComplaints = async () => {
    try {
        const response = await Axios.get(`${BASE_URL}/user/get-all-complaints`);

        return response.data.complaints;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    }
};

// Fetch complaint by ID
export const fetchComplaintById = async (id) => {    
    try {
        const response = await Axios.post(`${BASE_URL}/user/get-complaint-by-id`, id);
        return response.data.complaint;
    } catch (error) {
        console.error("Error fetching complaint by ID:", error);
        throw error;
    }
};

// Create feedback
export const createFeedback = async (feedback) => {    
    try {
        const response = await Axios.post(`${BASE_URL}/user/create-feedback`, feedback);
        return response;
    } catch (error) {
        console.error("Error fetching complaint by ID:", error);
        throw error;
    }
};

// Tracking Complaint
export const trackingComplaint = async (forwardData) => {    
    try {
        console.log(forwardData);
        
        const response = await Axios.post(`${BASE_URL}/user/complaint-tracking`, forwardData);
        console.log(response);
        
        return response;
    } catch (error) {
        console.error("Error fetching complaint by ID:", error);
        throw error;
    }
};