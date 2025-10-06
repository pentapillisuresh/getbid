import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ClipboardCheck,
  BarChart3,
  History
} from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import Sidebar from '../../components/shared/Sidebar';
import ClientDashboardHome from './pages/ClientDashboardHome';
import TenderManagement from './pages/TenderManagement';
import BidEvaluation from './pages/BidEvaluation';
import VendorManagement from './pages/VendorManagement';
import ReportsAnalytics from './pages/ReportsAnalytics';
import AuditTrail from './pages/AuditTrail';
import ProfilePage from "./pages/ProfilePage";

const ClientDashboard = () => {
  const location = useLocation();

  const userInfo = {
    name: 'Dr. Rajesh Kumar',
    role: 'Karnataka Public Works Department'
  };

  const sidebarItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText className="w-5 h-5" />, label: 'Tender Management', path: '/tender-management' },
    { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Bid Evaluation', path: '/bid-evaluation', badge: '8' },
    { icon: <Users className="w-5 h-5" />, label: 'Vendor Management', path: '/vendor-management', badge: '248' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Reports & Analytics', path: '/reports-analytics' },
    { icon: <History className="w-5 h-5" />, label: 'Audit Trail', path: '/audit-trail' }
  ];

  // ✅ Check if we’re on the profile page
  const isProfilePage = location.pathname === '/client/profile';

  return (
    <DashboardLayout 
      title="Client Portal" 
      subtitle="Tender Management & Procurement System"
      userInfo={userInfo}
      userType="client"
    >
      <div className="flex w-full">
        {/* ✅ Only show sidebar if NOT on profile page */}
        {!isProfilePage && <Sidebar items={sidebarItems} basePath="/client" />}
        
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="/dashboard" element={<ClientDashboardHome />} />
            <Route path="/tender-management" element={<TenderManagement />} />
            <Route path="/bid-evaluation" element={<BidEvaluation />} />
            <Route path="/vendor-management" element={<VendorManagement />} />
            <Route path="/reports-analytics" element={<ReportsAnalytics />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/profile" element={<ProfilePage userInfo={userInfo} />} />
          </Routes>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
