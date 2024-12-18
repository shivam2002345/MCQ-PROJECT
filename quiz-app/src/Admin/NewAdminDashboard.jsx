import React from "react";
import { Route, Routes } from "react-router-dom";
import NewAdminNavbar from "./NewAdminNavbar";
import StableAdminSidebar from "./NewAdminSidebar";
import "./NewAdminDashboard.css";
import OldUsers from "./OldUsers";
import HostExamForm from "./NewUserExam";
import CreateCustomExam from "./CreateCustomExam";
import ExamList from "./FetchHostedExam";
import AdminDashboard from './Dashboard';
import NewAdminRequest from "./NewAdminRequest";
import AdminRequestDetailsPage from "./AdminRequestDetailsPage";

const NewAdminDashboard = () => {
  return (
    <div className="admin-layout">
      <NewAdminNavbar />
      <div className="admin-content">
        <StableAdminSidebar className="admin-sidebar" />
        <div className="newadmin-page">
          <Routes>
          <Route path="newAdmindashboard" element={<AdminDashboard />} />
            <Route path="oldusers" element={<OldUsers />} />
            <Route path="hostexamfornewuser" element={<HostExamForm />} />
            <Route
              path="oldusers/customize/:user_id"
              element={<CreateCustomExam />}
            />
            <Route path="requests" element={<NewAdminRequest/>} />
            <Route path="examlist" element={<ExamList />} />
            <Route path="requests/admin/request/:request_id" element={<AdminRequestDetailsPage />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NewAdminDashboard;
