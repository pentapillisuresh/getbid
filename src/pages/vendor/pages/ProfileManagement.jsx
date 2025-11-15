import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import api from "../../../services/apiService";
import ProfileSidebar from "./profile/ProfileSidebar";
import ContactInfoTab from "./profile/ContactInfoTab";
import BusinessDetailsTab from "./profile/BusinessDetailsTab";
import DocumentsTab from "./profile/DocumentsTab";

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;
    const safeParseUser = () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem("user");
          if (!raw) return null;
          return JSON.parse(raw) || null;
        }
      } catch (e) {
        // ignore
      }
      return null;
    };

    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const resp = await api.get("/v1/users/me");
        const data = resp && resp.data ? resp.data : resp;
        if (mounted) {
          setUser(data || safeParseUser());
          // persist to localStorage for other parts of the app
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              window.localStorage.setItem(
                "user",
                JSON.stringify(data || safeParseUser() || {})
              );
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        if (mounted) setUser(safeParseUser());
      } finally {
        if (mounted) setLoadingUser(false);
      }
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "contact":
        return (
          <ContactInfoTab
            user={user}
            setUser={setUser}
            loadingUser={loadingUser}
          />
        );
      case "business":
        return (
          <BusinessDetailsTab
            user={user}
            setUser={setUser}
            loadingUser={loadingUser}
          />
        );
      case "documents":
        return <DocumentsTab />;
      default:
        return (
          <ContactInfoTab
            user={user}
            setUser={setUser}
            loadingUser={loadingUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage your vendor account information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-screen-2xl mx-auto">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
        />

        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfileManagement;
