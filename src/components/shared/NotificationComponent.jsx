import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import firebaseMessagingService from "../../services/firebaseMessagingService";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    // Check notification permission
    const checkPermission = () => {
      if ("Notification" in window) {
        setIsPermissionGranted(Notification.permission === "granted");
      }
    };

    checkPermission();

    // Setup foreground message listener
    firebaseMessagingService.setupForegroundMessageListener();

    // Listen for foreground messages
    if (firebaseMessagingService.isSupported) {
      // This would be handled by the service itself
      console.log("Notification component initialized");
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const token =
        await firebaseMessagingService.requestPermissionAndGetToken();
      if (token) {
        setIsPermissionGranted(true);
        console.log("Notification permission granted and token received");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (!firebaseMessagingService.isSupported) {
    return null; // Don't render if notifications aren't supported
  }

  return (
    <div className="notification-component">
      {/* Permission Request Banner */}
      {!isPermissionGranted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Enable Notifications
                </h4>
                <p className="text-sm text-blue-700">
                  Get notified about important tender updates and deadlines
                </p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* In-app Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.body}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
