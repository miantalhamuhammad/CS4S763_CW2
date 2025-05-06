import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ResumeList from './features/resume/ResumeList';
import ResumeForm from './features/resume/ResumeForm';
import ResumeDetail from './features/resume/ResumeDetail';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './features/auth/authSlice'; // Import the action


 const  App = ()=> {
     const dispatch = useDispatch();

     useEffect(() => {
         dispatch(loadUserFromStorage());  // Dispatch to load user data from localStorage when app starts
     }, [dispatch]);

     return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/resumes" replace />} />
                        <Route path="resumes" element={<ResumeList />} />
                        <Route path="/resumes/new" element={<ResumeForm mode="create" />} />
                        <Route path="resumes/:id" element={<ResumeDetail />} />
                        <Route path="resumes/:id/edit" element={<ResumeForm mode="edit" />} />
                    </Route>
                </Route>

                {/* Catch-all redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;  // Add this at the bottom
