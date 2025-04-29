import axios from 'axios';

const API_URL = 'http://localhost:3001/api/resumes';

export const getResumes = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getResumeById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

export const createResume = async (resumeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, resumeData, config);
    return response.data;
};

export const updateResume = async (id, resumeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, resumeData, config);
    return response.data;
};

export const deleteResume = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

// export default {
//     getResumes,
//     getResumeById,
//     createResume,
//     updateResume,
//     deleteResume,
// };