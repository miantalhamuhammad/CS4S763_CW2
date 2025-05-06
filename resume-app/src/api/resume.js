import axios from 'axios';

const API_URL = 'http://localhost:3001/api/resumes';

// Get all resumes
// In your api/resume.js
export const getResumes = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.resumes || response.data; // Handle both cases
};

// Get single resume
export const getResumeById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Create new resume
export const createResume = async (resumeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, resumeData, config);
    return response.data;
};

// Update resume
export const updateResume = async (id, resumeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, resumeData, config);
    return response.data;
};

// Delete resume
export const deleteResume = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
};