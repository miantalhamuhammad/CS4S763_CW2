import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

// export const signup = async (userData) => {
//     const response = await axios.post(`${API_URL}/signup`, userData);
//     return response.data;
// };
export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};
export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};


export const logout = () => {
    localStorage.removeItem('user');
};

// Remove the default export