import React from "react";
import {
  User,
  Users,
  Building2,
  FileText,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = ({ activeTab, onTabChange, user }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "contact", icon: Users, label: "Contact Info" },
    { id: "business", icon: Building2, label: "Business Details" },
    // { id: "documents", icon: FileText, label: "Documents" },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate("/vendor/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Company Info */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 text-center pt-5">
          {user?.company?.name || user?.companyName || "Company Name"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {user?.name || "User Name"}
        </p>
        <span className="mt-2 px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
          Vendor
        </span>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
