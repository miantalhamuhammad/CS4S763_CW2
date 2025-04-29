import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') || null,
    user: null,  // Store user data if available
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload;
            state.token = token;
            state.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));  // Store user data in localStorage
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');  // Clear user data from localStorage
        },
        loadUserFromStorage: (state) => {
            const userData = localStorage.getItem('user');
            try {
                state.user = userData ? JSON.parse(userData) : null; // Try to parse user data, fallback to null
            } catch (error) {
                console.error("Failed to parse user data:", error);
                state.user = null;
            }
        },
    },
});

export const { setCredentials, logout,loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         setCredentials: (state, action) => {
//             const { user, token } = action.payload;
//             state.user = user;
//             state.token = token;
//             localStorage.setItem('user', JSON.stringify(user));
//             localStorage.setItem('token', token);
//         },
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             localStorage.removeItem('user');
//             localStorage.removeItem('token');
//         },
//     },
// });
