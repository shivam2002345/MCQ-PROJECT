import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import TestSetupPage from "./components/TestSetupPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ProfilePage from "./components/ProfilePage";
import TestInstructions from "./components/TestInstructions";
import RequestForm from "./components/CreateRequest";
import AdminLayout from "./Admin/AdminDashboard";
import Notifications from "./components/UserNotifications";
import AdminLogin from "./Admin/AdminLogin";
import BecomeAdmin from "./components/BecomeAdmin";
import NewAdminLogin from "./components/NewAdminLogin";
import NewAdminDashboard from "./Admin/NewAdminDashboard";
import Login from "./CustomExam/Login";
import Result from "./CustomExam/Result";
import Exam from "./CustomExam/Exam";
import OldUserExam from "./CustomExam/OldUserExam";
import ExamResults from "./Components/Customresult";
import { isAuthenticated } from "./utils/userAuth";
import { isAdminAuthenticated } from "./utils/adminAuth";
// import RequestForm from "./components/CreateRequest";

// Protected Route Components //
const UserProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" />;
};

const AdminProtectedRoute = ({ children }) => {
  return isAdminAuthenticated() ? children : <Navigate to="/admin/login" />;
};

const NewAdminProtectedRoute = ({ children }) => {
  const adminId = localStorage.getItem("newAdminId");
  return adminId ? children : <Navigate to="/new-admin-login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    isAdminAuthenticated()
  );

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
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/new-admin-login" element={<NewAdminLogin />} />
        <Route path="/become-an-admin" element={<BecomeAdmin />} />
        <Route path="/newuser/:user_id" element={<Login />} />
        <Route path="/exam/:examId" element={<Exam />} />
        <Route path="/exam" element={<OldUserExam />} />
        <Route path="/resultof-customexam" element={<ExamResults />} />
        {/* User Protected Routes */}
        <Route
          path="/test-setup"
          element={
            <UserProtectedRoute>
              <TestSetupPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/quiz/:exam_id"
          element={
            <UserProtectedRoute>
              <QuizPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/request"
          element={
            <UserProtectedRoute>
              <RequestForm/>
            </UserProtectedRoute>
          }
        />
        <Route
          path="/test-instructions"
          element={
            <UserProtectedRoute>
              <TestInstructions />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/results/:exam_id/:user_id"
          element={
            <UserProtectedRoute>
              <ResultPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <ProfilePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <UserProtectedRoute>
              <Notifications />
            </UserProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />

        {/* New Admin Protected Routes */}
        <Route
          path="/newadmin/*"
          element={
            // <NewAdminProtectedRoute>
              <NewAdminDashboard />
            // </NewAdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
