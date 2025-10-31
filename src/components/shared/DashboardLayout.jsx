import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Bell,
  User,
  LogOut,
  Menu,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import notificationsService from "../../services/notificationsService";

const DashboardLayout = ({
  children,
  title,
  subtitle,
  userInfo,
  userType,
  sidebarItems,
  showSidebar = true,
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationDropdownRef = useRef(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setNotificationLoading(true);
        const response = await notificationsService.getNotifications(1, 4);
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      } finally {
        setNotificationLoading(false);
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

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRecentNotifications = async () => {
    try {
      setNotificationLoading(true);
      const response = await notificationsService.getNotifications(1, 4);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setNotificationLoading(false);
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
    setIsNotificationDropdownOpen(false);

    // Navigate based on notification type and user role, not specific IDs
    const targetUrl = getSimpleRouteForNotification(notification, userType);
    navigate(targetUrl);
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

  const handleViewAllNotifications = () => {
    setIsNotificationDropdownOpen(false);
    navigate(`/${userType}/notifications`);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    if (!isNotificationDropdownOpen) {
      fetchRecentNotifications(); // Refresh when opening
    }
  };

  const handleLogout = () => {
    // clear auth tokens and any related user data
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
      // optionally clear everything: localStorage.clear();
    }
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfile = () => {
    // Navigate to the profile page
    navigate(`/${userType}/profile`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {showSidebar && sidebarItems && (
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              {/* Logo and Title */}
              <div className="flex items-center gap-3">
                <div className="">
                               <img src="/images/logo2.png" alt="Logo" className="w-20 h-10" />

                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900" style={{fontFamily:"Pacifico"}}>{title}</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={toggleNotificationDropdown}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {notificationLoading ? (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm">Loading...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
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
                          onClick={handleViewAllNotifications}
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

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-gray-600">{userInfo.email}</p>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>

                {/* Profile Icon */}
                <button
                  onClick={handleProfile}
                  className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  title="Profile"
                >
                  <UserCircle className="w-5 h-5" />
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {showSidebar && sidebarItems && sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex pt-16">
        {showSidebar && sidebarItems && (
          <Sidebar
            items={sidebarItems}
            basePath={`/${userType}`}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
