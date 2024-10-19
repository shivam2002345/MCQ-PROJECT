import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import TestSetupPage from './components/TestSetupPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProfilePage from './components/ProfilePage'; 
import { isAuthenticated } from './utils/userAuth';
import { isAdminAuthenticated } from './utils/adminAuth';
import TestInstructions from './components/TestInstructions';
import RequestForm from './components/CreateRequest';
import AdminLayout from './Admin/AdminDashboard';
import Notifications from './components/UserNotifications';
import AdminLogin from './Admin/AdminLogin';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isAdminAuthenticated());

    useEffect(() => {
        const userStatus = isAuthenticated();
        const adminStatus = isAdminAuthenticated();
  
        if (userStatus !== isLoggedIn) {
            setIsLoggedIn(userStatus); // Update user login status
        }
  
        if (adminStatus !== isAdminLoggedIn) {
            setIsAdminLoggedIn(adminStatus); // Update admin login status
        }
    }, []); // Empty dependency array to run once on mount

    return (
        <Router>
            <Routes>
                {/* User routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/test-setup" element={<TestSetupPage />} />
                <Route path="/quiz/:exam_id" element={<QuizPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/test-instructions" element={<TestInstructions />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/results/:exam_id/:user_id" element={<ResultPage />} />
                <Route path="/request" element={<RequestForm />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/dashboard" element={
                   <ProfilePage />  
                } />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                     <AdminLayout />   } />
            </Routes>
        </Router>
    );
};

export default App;
