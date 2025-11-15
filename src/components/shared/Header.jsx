import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Globe,
  HelpCircle,
  Bell,
  ChevronRight,
  User,
  LogOut,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import notificationsService from "../../services/notificationsService";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationsService.getNotifications(1, 4);
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const response = await notificationsService.getUnreadCount();
        setUnreadCount(response.unreadCount || 0);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
        setUnreadCount(0);
      }
    };

    fetchRecentNotifications();
    fetchUnreadCount();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications(1, 4);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount();
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      notificationsService.markAsRead(notification._id).catch(console.error);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Close dropdown first
    setIsDropdownOpen(false);

    // Navigate based on notification type and user role, not specific IDs
    const userType = getUserType();
    const targetUrl = getSimpleRouteForNotification(notification, userType);
    navigate(targetUrl);
  };

  // Helper function to determine user type
  const getUserType = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role === "vendor" ? "vendor" : "client";
    } catch {
      // Default to client if we can't determine
      return "client";
    }
  };

  // Helper function to get simple route based on notification type (no IDs)
  const getSimpleRouteForNotification = (notification, userType) => {
    switch (notification.type) {
      case "bid_status":
        // For bid-related notifications
        if (userType === "client") {
          return "/client/bid-evaluation"; // Client sees bid evaluations
        } else {
          return "/vendor/bid-management"; // Vendor manages their bids
        }

      case "tender_update":
      case "contract_award":
        // For tender-related notifications
        if (userType === "client") {
          return "/client/tender-management"; // Client manages tenders
        } else {
          return "/vendor/tender-listings"; // Vendor sees available tenders
        }

      case "payment":
        // For payment-related notifications
        return `/${userType}/reports-analytics`;

      case "deadline_reminder":
        // For deadline reminders
        if (userType === "vendor") {
          return "/vendor/tender-listings"; // Vendor checks tender deadlines
        }
        return "/client/tender-management"; // Client manages tender deadlines

      case "system":
        // For system notifications
        return `/${userType}/dashboard`;

      default:
        // Default fallback
        return `/${userType}/dashboard`;
    }
  };

  const handleViewAllClick = () => {
    setIsDropdownOpen(false);
    const userType = getUserType();
    navigate(`/${userType}/notifications`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      fetchRecentNotifications(); // Refresh when opening
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsUserDropdownOpen(false);
    const userType = getUserType();
    navigate(`/${userType}/profile`);
  };

  const handleChangePasswordClick = () => {
    setIsUserDropdownOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="">
              {/* <Building2 className="w-6 h-6 text-white" /> */}
              <img src="/images/logo2.png" alt="Logo" className="w-20 h-10" />
            </div>
            {/* <div>
              <h1 className="text-xl font-bold text-gray-900">eTender Portal</h1>
              <p className="text-sm text-gray-600">Secure Procurement Platform</p>
            </div> */}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm">Loading...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                !notification.isRead
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <p
                                className="text-sm text-gray-600 mt-1"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {notificationsService.formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </span>
                                {notification.priority === "high" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                    High
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>

                  {/* View All Button */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <button
                        onClick={handleViewAllClick}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View All Notifications
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleChangePasswordClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Key className="w-4 h-4 text-gray-500" />
                      <span>Change Password</span>
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </header>
  );
};

export default Header;
