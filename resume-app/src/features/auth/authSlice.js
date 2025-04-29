import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        // other user data if needed
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);

            // Store other user data if available
            // state.userId = action.payload.userId;
            // localStorage.setItem('userId', action.payload.userId);
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

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

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;