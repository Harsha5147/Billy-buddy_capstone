import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import QASection from '../components/QASection';
import ExperienceSharing from '../components/ExperienceSharing';
import UserDashboard from '../components/dashboard/UserDashboard';
import Auth from '../components/Auth';
import PrivateRoute from './PrivateRoute';
import AIChatSupport from '../components/chat/AIChatSupport';
import CybercrimePortal from '../components/cybercrime/CybercrimePortal';
import AdminReportViewer from '../components/AdminReportViewer';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute element={<UserDashboard />} />} />
      <Route path="/qa" element={<QASection />} />
      <Route path="/experiences" element={<ExperienceSharing />} />
      <Route path="/ai-chat" element={<AIChatSupport />} />
      
      {/* Cybercrime Routes */}
      <Route path="/cybercrime" element={<PrivateRoute element={<CybercrimePortal />} requireCybercrime />} />
      <Route path="/cybercrime/reports" element={<PrivateRoute element={<AdminReportViewer />} requireCybercrime />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;