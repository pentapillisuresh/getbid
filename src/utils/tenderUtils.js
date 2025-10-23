// Utility functions for tender data manipulation

export const formatCurrency = (value) => {
  if (!value) return "₹0";
  if (value < 10000000) {
    const lacs = value / 100000;
    return `₹${lacs.toFixed(1)} L`;
  }
  const crores = value / 10000000;
  return `₹${crores.toFixed(1)} Cr`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const calculateDaysLeft = (deadlineDate) => {
  if (!deadlineDate) return 0;
  const deadline = new Date(deadlineDate);
  const today = new Date();
  const diffTime = deadline - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTenderStatus = (tender) => {
  if (!tender.isActive) return "draft";

  const daysLeft = calculateDaysLeft(tender.bidDeadline);

  if (daysLeft < 0) {
    // Past deadline - check if evaluated or awarded
    return "evaluation"; // or 'awarded' based on your business logic
  }

  return "published";
};

export const getPriorityLevel = (value) => {
  if (value > 10000000) return "high";
  if (value > 5000000) return "medium";
  return "low";
};

export const downloadDocument = (doc) => {
  if (!doc || !doc.url) return;

  const a = document.createElement("a");
  a.href = doc.url;
  a.download = doc.fileName || "document";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const openDocument = (doc) => {
  if (!doc || !doc.url) return;
  window.open(doc.url, "_blank");
};
