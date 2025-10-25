import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  Settings,
  Loader2,
  RefreshCw,
  Activity,
  Award,
  XCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import activitiesService from "../../../services/activitiesService";

const VendorActivitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState("last-30-days");

  // API state management
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // Infinite scroll
  const observer = useRef();
  const lastActivityElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "bid_submitted", label: "Bid Submitted" },
    { value: "bid_updated", label: "Bid Updated" },
    { value: "tender_viewed", label: "Tender Viewed" },
    { value: "document_uploaded", label: "Document Uploaded" },
    { value: "clarification_asked", label: "Clarification Asked" },
    { value: "profile_updated", label: "Profile Updated" },
    { value: "evaluation_received", label: "Evaluation Received" },
    { value: "contract_awarded", label: "Contract Awarded" },
    { value: "user_login", label: "User Login" },
  ];

  // Function to get activity icon based on action type
  const getActivityIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "bid_submitted":
      case "submit":
      case "submitted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "bid_updated":
      case "update":
      case "updated":
      case "edit":
      case "edited":
        return <Edit className="w-5 h-5 text-blue-600" />;
      case "tender_viewed":
      case "view":
      case "viewed":
        return <Eye className="w-5 h-5 text-purple-600" />;
      case "document_uploaded":
      case "upload":
      case "uploaded":
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case "clarification_asked":
      case "clarification":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "profile_updated":
      case "profile":
        return <User className="w-5 h-5 text-gray-600" />;
      case "evaluation_received":
      case "evaluation":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "contract_awarded":
      case "award":
      case "awarded":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "user_login":
      case "login":
        return <Shield className="w-5 h-5 text-blue-600" />;
      case "create":
      case "created":
        return <Plus className="w-5 h-5 text-green-600" />;
      case "delete":
      case "deleted":
        return <Trash2 className="w-5 h-5 text-red-600" />;
      case "download":
      case "downloaded":
        return <Download className="w-5 h-5 text-indigo-600" />;
      case "schedule":
      case "scheduled":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  // Function to get severity badge color
  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format activity time
  const formatActivityTime = (timestamp) => {
    if (!timestamp) return "Unknown time";

    try {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffInMs = now - activityTime;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60)
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

      return activityTime.toLocaleDateString();
    } catch (error) {
      return "Unknown time";
    }
  };

  // Demo/fallback data when API is not available
  const demoActivities = [
    {
      _id: "demo-1",
      user: {
        _id: "demo-user-1",
        name: "Demo Vendor",
        email: "vendor@example.com",
        role: "vendor",
      },
      action: "bid_submitted",
      description: "Submitted bid for Highway Construction Project",
      entityType: "bid",
      entityId: "demo-bid-1",
      metadata: {
        tenderTitle: "Highway Construction Project Phase 2",
        tenderId: "TND20250001",
        bidAmount: 50000000,
        category: "Infrastructure",
      },
      ipAddress: "127.0.0.1",
      severity: "success",
      isVisible: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "demo-2",
      user: {
        _id: "demo-user-1",
        name: "Demo Vendor",
        email: "vendor@example.com",
        role: "vendor",
      },
      action: "tender_viewed",
      description: "Viewed tender details",
      entityType: "tender",
      entityId: "demo-tender-2",
      metadata: {
        tenderTitle: "School Building Construction",
        tenderId: "TND20250002",
        category: "Building",
        value: 25000000,
      },
      ipAddress: "127.0.0.1",
      severity: "info",
      isVisible: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "demo-3",
      user: {
        _id: "demo-user-1",
        name: "Demo Vendor",
        email: "vendor@example.com",
        role: "vendor",
      },
      action: "document_uploaded",
      description: "Uploaded technical specifications",
      entityType: "document",
      entityId: "demo-doc-1",
      metadata: {
        fileName: "technical_specs.pdf",
        fileSize: 2048576,
        documentType: "technical",
        relatedTender: "Water Treatment Plant Upgrade",
      },
      ipAddress: "127.0.0.1",
      severity: "success",
      isVisible: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "demo-4",
      user: {
        _id: "demo-user-1",
        name: "Demo Vendor",
        email: "vendor@example.com",
        role: "vendor",
      },
      action: "evaluation_received",
      description: "Received bid evaluation results",
      entityType: "evaluation",
      entityId: "demo-eval-1",
      metadata: {
        tenderTitle: "Metro Rail Extension Project",
        technicalScore: 85,
        financialScore: 92,
        overallScore: 88.5,
        status: "qualified",
      },
      ipAddress: "127.0.0.1",
      severity: "success",
      isVisible: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "demo-5",
      user: {
        _id: "demo-user-1",
        name: "Demo Vendor",
        email: "vendor@example.com",
        role: "vendor",
      },
      action: "clarification_asked",
      description: "Asked clarification about project scope",
      entityType: "clarification",
      entityId: "demo-clarif-1",
      metadata: {
        tenderTitle: "Airport Terminal Construction",
        question: "Regarding material specifications in section 3.2",
        status: "pending",
      },
      ipAddress: "127.0.0.1",
      severity: "info",
      isVisible: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const fetchActivities = useCallback(
    async (page = 1, append = false) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching vendor activities:", {
          page,
          selectedAction,
          append,
        });

        const response = await activitiesService.getMyActivities({
          page,
          limit: 10,
          action: selectedAction !== "all" ? selectedAction : undefined,
          // Add more filters as needed
        });

        console.log("Vendor activities response:", response);

        if (response.success) {
          const newActivities = response.data || [];

          if (append) {
            setActivities((prev) => [...prev, ...newActivities]);
          } else {
            setActivities(newActivities);
          }

          // Check if there are more pages
          setHasMore(page < response.totalPages);
        } else {
          throw new Error(response.message || "Failed to fetch activities");
        }
      } catch (err) {
        console.error("Error fetching vendor activities:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.status,
          response: err.response,
        });

        // If it's a 404 or network error, fall back to demo data
        if (
          err.message.includes("404") ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("Network Error") ||
          err.code === "ECONNREFUSED"
        ) {
          console.log("API not available, using demo data");
          if (!append) {
            setActivities(demoActivities);
          }
          setHasMore(false);
          setError("API not available - showing demo data");
        } else {
          setError(err.message || "Failed to fetch activities");
          if (!append) {
            setActivities([]);
          }
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [selectedAction]
  );

  // Load activities when page changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchActivities(1, false);
    } else {
      fetchActivities(currentPage, true);
    }
  }, [currentPage, fetchActivities]);

  // Reset when filters change
  useEffect(() => {
    setCurrentPage(1);
    setActivities([]);
    setHasMore(true);
    fetchActivities(1, false);
  }, [selectedAction]);

  // Search and filter logic
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = searchTerm
      ? activity.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.metadata?.tenderTitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.metadata?.tenderId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  const handleRefresh = () => {
    setCurrentPage(1);
    setActivities([]);
    setHasMore(true);
    fetchActivities(1, false);
  };

  const handleExport = async () => {
    try {
      const blob = await activitiesService.exportActivities(
        {
          action: selectedAction !== "all" ? selectedAction : undefined,
        },
        "csv"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendor-activities-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">
            Track all your activities and system interactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Activities
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search descriptions, actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {actionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">
                API Connection Issue
              </p>
              <p className="text-yellow-700 text-sm">
                Cannot connect to activities service. Showing demo data.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto text-yellow-600 hover:text-yellow-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredActivities.length} activities found
          </p>
        </div>

        <div className="">
          {initialLoading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => {
              const isLast = index === filteredActivities.length - 1;
              return (
                <div
                  key={activity._id || activity.id}
                  ref={isLast ? lastActivityElementRef : null}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-gray-50">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.description || activity.action}
                          </p>
                          {activity.metadata && (
                            <div className="mt-1 space-y-1">
                              {activity.metadata.tenderTitle && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Tender:</span>{" "}
                                  {activity.metadata.tenderTitle}
                                </p>
                              )}
                              {activity.metadata.tenderId && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">ID:</span>{" "}
                                  {activity.metadata.tenderId}
                                </p>
                              )}
                              {activity.metadata.bidAmount && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Amount:</span> ₹
                                  {activity.metadata.bidAmount.toLocaleString()}
                                </p>
                              )}
                              {activity.metadata.fileName && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">File:</span>{" "}
                                  {activity.metadata.fileName}
                                </p>
                              )}
                              {activity.metadata.technicalScore !==
                                undefined && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Technical Score:
                                  </span>{" "}
                                  {activity.metadata.technicalScore}/100
                                </p>
                              )}
                              {activity.metadata.financialScore !==
                                undefined && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Financial Score:
                                  </span>{" "}
                                  {activity.metadata.financialScore}/100
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-xs text-gray-500">
                              {formatActivityTime(
                                activity.createdAt || activity.timestamp
                              )}
                            </p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(
                                activity.severity
                              )}`}
                            >
                              {activity.severity || "info"}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {activity.entityType || activity.action}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {activity.metadata?.status && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.metadata.status === "qualified" ||
                                activity.metadata.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : activity.metadata.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {activity.metadata.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No activities found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No activities match "${searchTerm}"`
                  : "No activities have been recorded yet"}
              </p>
            </div>
          )}

          {/* Loading indicator for infinite scroll */}
          {loading && !initialLoading && (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-600 mt-2">
                Loading more activities...
              </p>
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && !loading && filteredActivities.length > 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">
                You've reached the end of the activity log
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorActivitiesPage;
