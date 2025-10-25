import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  ChevronLeft,
  Archive,
  Check,
  AlertCircle,
  Clock,
  FileText,
  Settings,
  CreditCard,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import notificationsService from "../../../services/notificationsService";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const observerRef = useRef();

  const limit = 10;

  // Icon mapping for different notification types
  const getIcon = (type) => {
    const iconMap = {
      bid_status: FileText,
      tender_update: Bell,
      contract_award: Award,
      payment: CreditCard,
      system: Settings,
      deadline_reminder: Clock,
    };
    const IconComponent = iconMap[type] || Bell;
    return <IconComponent className="w-5 h-5" />;
  };

  // Fetch notifications with pagination
  const fetchNotifications = useCallback(async (pageNum = 1, reset = true) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await notificationsService.getNotifications(
        pageNum,
        limit
      );
      const newNotifications = response.data || [];

      if (reset) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }

      setHasMore(
        newNotifications.length === limit && pageNum < response.totalPages
      );
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      if (reset) {
        setNotifications([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []); // Remove limit dependency since it's constant

  // Initial load
  useEffect(() => {
    fetchNotifications(1, true);
  }, []); // Remove fetchNotifications dependency to prevent infinite loop

  // Infinite scroll observer
  const lastNotificationRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications(page + 1, false);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, page]
  ); // Remove fetchNotifications dependency

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await notificationsService.markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // Navigate based on notification type, not specific IDs
    const targetUrl = getSimpleRouteForNotification(notification);
    navigate(targetUrl);
  };

  // Helper function to get simple route based on notification type (no IDs)
  const getSimpleRouteForNotification = (notification) => {
    // Dynamically determine user type from localStorage
    const getUserType = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.role === "vendor" ? "vendor" : "client";
      } catch {
        // Default to client if we can't determine
        return "client";
      }
    };

    const userType = getUserType();

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

  // Handle checkbox selection
  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map((n) => n._id)));
    }
    setSelectAll(!selectAll);
  };

  // Mark selected as read
  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      const notificationIds = Array.from(selectedNotifications);
      await notificationsService.markMultipleAsRead(notificationIds);

      setNotifications((prev) =>
        prev.map((n) =>
          selectedNotifications.has(n._id) ? { ...n, isRead: true } : n
        )
      );
      setSelectedNotifications(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Archive selected notifications
  const handleArchiveSelected = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      const promises = Array.from(selectedNotifications).map((id) =>
        notificationsService.archiveNotification(id)
      );
      await Promise.all(promises);

      setNotifications((prev) =>
        prev.filter((n) => !selectedNotifications.has(n._id))
      );
      setSelectedNotifications(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Failed to archive notifications:", error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredNotifications.length} notifications
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {selectedNotifications.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark as Read
                </button>
                <button
                  onClick={handleArchiveSelected}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {["all", "unread", "read"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Select All
              </label>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification, index) => {
                const isLast = index === filteredNotifications.length - 1;
                const isSelected = selectedNotifications.has(notification._id);

                return (
                  <div
                    key={notification._id}
                    ref={isLast ? lastNotificationRef : null}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    } ${isSelected ? "bg-blue-100" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleSelectNotification(notification._id)
                        }
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div
                        className={`flex-shrink-0 p-2 rounded-full ${notificationsService.getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3
                              className={`text-base font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {notification.message}
                            </p>

                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                {notification.metadata.tenderTitle && (
                                  <span>
                                    Tender: {notification.metadata.tenderTitle}
                                  </span>
                                )}
                                {notification.metadata.amount && (
                                  <span>
                                    Amount: ₹
                                    {Number(
                                      notification.metadata.amount
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4">
                            <span className="text-sm text-gray-500">
                              {notificationsService.formatNotificationTime(
                                notification.createdAt
                              )}
                            </span>

                            {/* Priority badge */}
                            {notification.priority === "high" && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                High Priority
                              </span>
                            )}

                            {/* Unread indicator */}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading more indicator */}
              {loadingMore && (
                <div className="px-6 py-4 text-center border-t">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading more notifications...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                  ? "No read notifications"
                  : "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
