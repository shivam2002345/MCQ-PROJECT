import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CsvUploader from './CSVUpload';
import RequestManagement from './RequestManagement';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';
import FilterQuestions from './FilterQuestions';
import UserList from './UserList';
import UserProfile from './UserProfile';
import AdminDashboard from './Dashboard';
import TechnologyManagement from './TechnologyManagement ';
import AdminRequestManagement from './AdminRequestManagement';
import AdminList from './AdminList';
import AdminDetail from './AdminDetail';
import AdminSubtopicsPage from './AdminSubtopicsPage';
import ChatBox from './ChatBox';
import RequestDetailsPage from './RequestDetailsPage';
import SuperAdminDashboard from './SuperAdminDashboard';
import logAction from '../utils/logAction'; // Import logging utility

const AdminLayout = () => {
    const location = useLocation();

    useEffect(() => {
        logAction('NAVIGATION', `User navigated to ${location.pathname}`);
    }, [location]);

    return (
        <div className="admin-layout">
            <AdminNavbar />
            <div className="admin-content">
                <AdminSidebar />
                <div className="admin-page">
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="csv-upload" element={<CsvUploader />} />
                        <Route path="request-management" element={<RequestManagement />} />
                        <Route path="questions" element={<FilterQuestions />} />
                        <Route path="users" element={<UserList />} />
                        <Route path="users/:user_id" element={<UserProfile />} />
                        <Route path="technology-management" element={<TechnologyManagement/>} />
                        <Route path="admin-requests" element={<AdminRequestManagement />} />
                        <Route path="adminlist" element={<AdminList />} />
                        <Route path="/:adminId" element={<AdminDetail />} />
                        <Route path="subtopics" element={<AdminSubtopicsPage />} />
                        <Route path="chat" element={<ChatBox />} />
                        <Route path="adminrequest" element={<SuperAdminDashboard />} />
                        <Route path="adminrequest" element={<SuperAdminDashboard />} />
                        <Route path="adminrequest/admin/request/:request_id" element={<RequestDetailsPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
