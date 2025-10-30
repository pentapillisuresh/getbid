// Firebase service worker for background notifications
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Initialize Firebase in service worker
// NOTE: These values must match the project used by the client app.
// Service worker cannot read import.meta.env, so we embed the same config here.
const firebaseConfig = {
  apiKey: "AIzaSyBDre2052Ggn92fKX2qHwit0L4i-65dVM",
  authDomain: "get-bid.firebaseapp.com",
  projectId: "get-bid",
  storageBucket: "get-bid.firebasestorage.app",
  messagingSenderId: "39548298873",
  appId: "1:39548298873:web:bf203d681c5dc6c64d56a8",
  measurementId: "G-J7HVYDKBF6",
};

firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data || {},
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received:", event);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    // Open the app when notification is clicked
    event.waitUntil(clients.openWindow("/"));
  }
});
