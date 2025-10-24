import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

class FirebaseMessagingService {
  constructor() {
    this.deviceToken = null;
    this.isSupported = !!messaging;
  }

  // Request permission and get FCM token
  async requestPermissionAndGetToken() {
    if (!this.isSupported) {
      console.warn("Firebase messaging is not supported in this browser");
      return null;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notification permission granted.");

        // Get registration token
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (token) {
          console.log("FCM registration token:", token);
          this.deviceToken = token;

          // Store token in localStorage for persistence
          localStorage.setItem("fcmToken", token);

          return token;
        } else {
          console.log("No registration token available.");
          return null;
        }
      } else {
        console.log("Unable to get permission to notify.");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
      return null;
    }
  }

  // Get stored token from localStorage
  getStoredToken() {
    if (this.deviceToken) {
      return this.deviceToken;
    }

    const storedToken = localStorage.getItem("fcmToken");
    if (storedToken) {
      this.deviceToken = storedToken;
      return storedToken;
    }

    return null;
  }

  // Setup foreground message listener
  setupForegroundMessageListener() {
    if (!this.isSupported) {
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      // Extract notification data
      const { title, body, icon } = payload.notification || {};

      // Show notification if the page is in focus
      if (document.visibilityState === "visible") {
        this.showNotification(title, body, icon);
      }
    });
  }

  // Show browser notification
  showNotification(title, body, icon) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title || "New Message", {
        body: body || "You have a new message",
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }

  // Get device details for API calls
  getDeviceDetails() {
    const token = this.getStoredToken();

    return {
      deviceType: "web",
      deviceName: navigator.userAgent || "web-client",
      deviceToken: token || null,
      platform: navigator.platform || "unknown",
      browserName: this.getBrowserName(),
      browserVersion: this.getBrowserVersion(),
    };
  }

  // Helper method to get browser name
  getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  }

  // Helper method to get browser version
  getBrowserVersion() {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(chrome|firefox|safari|edge)\/(\d+)/i);
    return match ? match[2] : "unknown";
  }

  // Initialize the service
  async initialize() {
    if (!this.isSupported) {
      console.warn("Firebase messaging not supported");
      return false;
    }

    // Check if token already exists
    let token = this.getStoredToken();

    // If no token, request permission and get new token
    if (!token) {
      token = await this.requestPermissionAndGetToken();
    }

    // Setup message listener
    this.setupForegroundMessageListener();

    return !!token;
  }

  // Clear stored token (for logout)
  clearToken() {
    this.deviceToken = null;
    localStorage.removeItem("fcmToken");
  }
}

// Export singleton instance
const firebaseMessagingService = new FirebaseMessagingService();
export default firebaseMessagingService;
