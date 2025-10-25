import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardCheck,
  BarChart3,
  History,
  Activity,
} from "lucide-react";
import DashboardLayout from "../../components/shared/DashboardLayout";
import Sidebar from "../../components/shared/Sidebar";
import ClientDashboardHome from "./pages/ClientDashboardHome";
import TenderManagement from "./pages/TenderManagement";
import BidEvaluation from "./pages/BidEvaluation";
import VendorManagement from "./pages/VendorManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProfilePage from "./pages/ProfilePage";
import TenderDashboard from "./pages/TenderDashboard";
import NotificationsPage from "./pages/NotificationsPage";

const ClientDashboard = () => {
  const location = useLocation();

  // Prefer stored user info from localStorage (set during login). Fallback to demo user.
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Expecting at least an object with name and role
      if (parsed && typeof parsed === "object") return parsed;
      return null;
    } catch (e) {
      // invalid JSON or access denied
      return null;
    }
  };

  const storedUser = getStoredUser();
  const userInfo = storedUser || {
    name: "Dr. Rajesh Kumar",
    role: "Karnataka Public Works Department",
  };

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Tender Management",
      path: "/tender-management",
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      label: "Bid Evaluation",
      path: "/bid-evaluation",
      // badge: "8",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Vendor Management",
      path: "/vendor-management",
      // badge: "248",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Reports & Analytics",
      path: "/reports-analytics",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Activities",
      path: "/activities",
    },
  ];

  // ✅ Check if we’re on the profile page
  const isProfilePage = location.pathname === "/client/profile";

  return (
    <DashboardLayout
      title="Client Portal"
      subtitle="Tender Management & Procurement System"
      userInfo={userInfo}
      userType="client"
      sidebarItems={sidebarItems}
      showSidebar={!isProfilePage}
    >
      <main className="flex-1 p-6">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/client/dashboard" replace />}
          />
          <Route path="/dashboard" element={<ClientDashboardHome />} />
          <Route path="/tender-management" element={<TenderManagement />} />
          <Route path="/bid-evaluation" element={<BidEvaluation />} />
          <Route path="/vendor-management" element={<VendorManagement />} />
          <Route path="/reports-analytics" element={<ReportsAnalytics />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route
            path="/profile"
            element={<ProfilePage userInfo={userInfo} />}
          />
          <Route path="/tender" element={<TenderDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </main>
    </DashboardLayout>
  );
};

export default ClientDashboard;
