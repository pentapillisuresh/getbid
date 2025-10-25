import api from "./apiService";

class NotificationsService {
  /**
   * Fetch notifications with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of notifications per page (default: 4)
   * @returns {Promise} - Notification data with pagination info
   */
  async getNotifications(page = 1, limit = 4) {
    try {
      const response = await api.get(`/notifications/my-notifications`, {
        queryParams: { page, limit },
      });
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {Promise} - Response from the API
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(
        `/notifications/${notificationId}/mark-read`
      );
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark multiple notifications as read
   * @param {string[]} notificationIds - Array of notification IDs
   * @returns {Promise} - Response from the API
   */
  async markMultipleAsRead(notificationIds) {
    try {
      const response = await api.patch("/notifications/mark-read", {
        body: { notificationIds },
      });
      return response;
    } catch (error) {
      console.error("Error marking multiple notifications as read:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @returns {Promise} - Unread count response
   */
  async getUnreadCount() {
    try {
      const response = await api.get("/notifications/unread-count");
      return response;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  /**
   * Archive notification
   * @param {string} notificationId - ID of the notification to archive
   * @returns {Promise} - Response from the API
   */
  async archiveNotification(notificationId) {
    try {
      const response = await api.patch(
        `/notifications/${notificationId}/archive`
      );
      return response;
    } catch (error) {
      console.error("Error archiving notification:", error);
      throw error;
    }
  }

  /**
   * Format notification time
   * @param {string} timestamp - ISO timestamp
   * @returns {string} - Formatted time string
   */
  formatNotificationTime(timestamp) {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return notificationTime.toLocaleDateString();
    }
  }

  /**
   * Get notification icon based on type
   * @param {string} type - Notification type
   * @returns {string} - Icon class or component name
   */
  getNotificationIcon(type) {
    const iconMap = {
      bid_status: "FileText",
      tender_update: "Bell",
      contract_award: "Award",
      payment: "CreditCard",
      system: "Settings",
      deadline_reminder: "Clock",
      default: "Bell",
    };
    return iconMap[type] || iconMap.default;
  }

  /**
   * Get notification priority color
   * @param {string} priority - Notification priority
   * @returns {string} - CSS color class
   */
  getPriorityColor(priority) {
    const colorMap = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-blue-600 bg-blue-50",
      default: "text-gray-600 bg-gray-50",
    };
    return colorMap[priority] || colorMap.default;
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;
