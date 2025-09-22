import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  User, 
  Folder,
  HeadphonesIcon,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import Sidebar from '../../components/shared/Sidebar';
import VendorDashboardHome from './pages/VendorDashboardHome';
import TenderListings from './pages/TenderListings';
import BidManagement from './pages/BidManagement';
import ProfileManagement from './pages/ProfileManagement';
import DocumentRepository from './pages/DocumentRepository';
import ClarificationQA from './pages/ClarificationQA';
import SupportHelpdesk from './pages/SupportHelpdesk';

const VendorDashboard = () => {
  const userInfo = {
    name: 'TechCorp Ltd.',
    role: 'Verified Vendor'
  };

  const sidebarItems = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Tender Listings', 
      path: '/tender-listings',
      badge: '24'
    },
    { 
      icon: <ClipboardList className="w-5 h-5" />, 
      label: 'Bid Management', 
      path: '/bid-management',
      badge: '5'
    },
    { 
      icon: <User className="w-5 h-5" />, 
      label: 'Profile Management', 
      path: '/profile-management'
    },
    { 
      icon: <Folder className="w-5 h-5" />, 
      label: 'Document Repository', 
      path: '/document-repository'
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      label: 'Clarifications & Q&A', 
      path: '/clarifications',
      badge: '2'
    },
    { 
      icon: <HeadphonesIcon className="w-5 h-5" />, 
      label: 'Support & Helpdesk', 
      path: '/support'
    }
  ];

  return (
    <DashboardLayout 
      title="eTender Portal" 
      subtitle="Secure Procurement Platform"
      userInfo={userInfo}
      userType="vendor"
    >
      <Sidebar items={sidebarItems} basePath="/vendor" />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="/dashboard" element={<VendorDashboardHome />} />
          <Route path="/tender-listings" element={<TenderListings />} />
          <Route path="/bid-management" element={<BidManagement />} />
          <Route path="/profile-management" element={<ProfileManagement />} />
          <Route path="/document-repository" element={<DocumentRepository />} />
          <Route path="/clarifications" element={<ClarificationQA />} />
          <Route path="/support" element={<SupportHelpdesk />} />
        </Routes>
      </main>
    </DashboardLayout>
  );
};

export default VendorDashboard;