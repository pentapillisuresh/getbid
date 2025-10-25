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
} from "lucide-react";
import activitiesService from "../../../services/activitiesService";

const ActivitiesPage = () => {
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
    { value: "tender_created", label: "Tender Created" },
    { value: "tender_updated", label: "Tender Updated" },
    { value: "tender_published", label: "Tender Published" },
    { value: "bid_received", label: "Bid Received" },
    { value: "evaluation_started", label: "Evaluation Started" },
    { value: "tender_awarded", label: "Tender Awarded" },
    { value: "user_login", label: "User Login" },
    { value: "document_uploaded", label: "Document Uploaded" },
    { value: "settings_changed", label: "Settings Changed" },
  ];

  const users = [
    { value: "all", label: "All Users" },
    { value: "dr_rajesh_kumar", label: "Dr. Rajesh Kumar" },
    { value: "priya_sharma", label: "Priya Sharma" },
    { value: "amit_patel", label: "Amit Patel" },
    { value: "system", label: "System" },
  ];

  // Demo/fallback data when API is not available
  const demoActivities = [
    {
      _id: "demo-1",
      user: {
        _id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        role: "client",
      },
      action: "tender_created",
      description: "Created tender: Demo Tender 1",
      entityType: "tender",
      entityId: "demo-tender-1",
      metadata: {
        tenderTitle: "Demo Infrastructure Project",
        tenderId: "TND20250001",
        category: "Infrastructure",
        value: 500000,
      },
      ipAddress: "127.0.0.1",
      severity: "success",
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "demo-2",
      user: {
        _id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        role: "client",
      },
      action: "tender_updated",
      description: "Updated tender: Demo Tender 1",
      entityType: "tender",
      entityId: "demo-tender-1",
      metadata: {
        tenderTitle: "Demo Infrastructure Project",
        tenderId: "TND20250001",
        statusChanged: true,
        previousStatus: "draft",
        newStatus: "published",
      },
      ipAddress: "127.0.0.1",
      severity: "info",
      isVisible: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  // Fetch activities from API
  const fetchActivities = useCallback(
    async (page = 1, append = false) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching activities:", { page, selectedAction, append });

        const response = await activitiesService.getMyActivities({
          page,
          limit: 10,
          action: selectedAction !== "all" ? selectedAction : undefined,
          // Add more filters as needed
        });

        console.log("Activities response:", response);

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
        console.error("Error fetching activities:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.status,
          response: err.response,
        });

        // If it's a 404 or network error, fall back to demo data
        if (
          err.message.includes("404") ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("Network Error")
        ) {
          console.warn("API not available, using demo data");
          if (!append) {
            setActivities(demoActivities);
            setHasMore(false);
          }
          setError(
            "API server not available. Showing demo data. Please check if your backend server is running on http://localhost:3003"
          );
        } else {
          setError(err.message || "Failed to fetch activities");
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [selectedAction]
  );

  // Load more activities when page changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchActivities(1, false);
    } else {
      fetchActivities(currentPage, true);
    }
  }, [currentPage, fetchActivities]);

  // Reset and refetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    setActivities([]);
    setHasMore(true);
    fetchActivities(1, false);
  }, [selectedAction, selectedUser, dateRange]);

  // Manual refresh
  const handleRefresh = () => {
    setCurrentPage(1);
    setActivities([]);
    setHasMore(true);
    setInitialLoading(true);
    fetchActivities(1, false);
  };

  // Helper function to get activity icon
  const getActivityIcon = (action, severity) => {
    switch (action) {
      case "tender_created":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "tender_updated":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "tender_published":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "bid_received":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "evaluation_started":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "tender_awarded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "user_login":
        return <User className="w-4 h-4 text-gray-600" />;
      case "document_uploaded":
        return <Download className="w-4 h-4 text-indigo-600" />;
      case "settings_changed":
        return <Settings className="w-4 h-4 text-gray-600" />;
      default:
        if (severity === "error") {
          return <AlertTriangle className="w-4 h-4 text-red-600" />;
        }
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return "text-green-600 bg-green-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter activities based on search and filters
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.metadata?.tenderTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesAction =
      selectedAction === "all" || activity.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const stats = [
    {
      label: "Total Activities",
      value: activities.length.toString(),
      icon: <Shield className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Recent Activities",
      value: activities
        .filter((a) => {
          const activityDate = new Date(a.createdAt);
          const today = new Date();
          return activityDate.toDateString() === today.toDateString();
        })
        .length.toString(),
      icon: <Clock className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Tender Actions",
      value: activities
        .filter((a) => a.entityType === "tender")
        .length.toString(),
      icon: <FileText className="w-6 h-6 text-purple-600" />,
    },
    {
      label: "Success Events",
      value: activities
        .filter((a) => a.severity === "success")
        .length.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">
            Complete system activity log and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">
                Error Loading Activities
              </h4>
              <p className="text-red-700">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {actionTypes.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {users.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="last-24-hours">Last 24 Hours</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Initial Loading State */}
      {initialLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading activities...</p>
          </div>
        </div>
      )}

      {/* Activities List */}
      {!initialLoading && (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const isLast = index === filteredActivities.length - 1;
            return (
              <div
                key={activity._id}
                ref={isLast ? lastActivityElementRef : null}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Activity Icon & Status */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${getSeverityColor(
                          activity.severity
                        )}`}
                      >
                        {getActivityIcon(activity.action, activity.severity)}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          activity.severity
                        )}`}
                      >
                        {activity.severity}
                      </div>
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {activity.description}
                        </h3>
                        {activity.metadata?.tenderId && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {activity.metadata.tenderId}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4" />
                            <span>
                              <strong>User:</strong> {activity.user.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span>
                              <strong>Role:</strong> {activity.user.role}
                            </span>
                          </div>
                          {activity.metadata?.tenderTitle && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>
                                <strong>Tender:</strong>{" "}
                                {activity.metadata.tenderTitle}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              <strong>Time:</strong>{" "}
                              {formatDate(activity.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span>
                              <strong>IP:</strong> {activity.ipAddress}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>
                              <strong>Entity:</strong> {activity.entityType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Change Details */}
                      {activity.metadata?.statusChanged && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Status Change
                          </h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                              {activity.metadata.previousStatus}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              {activity.metadata.newStatus}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading More Indicator */}
          {loading && !initialLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                  Loading more activities...
                </p>
              </div>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && activities.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No more activities to load
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!initialLoading && filteredActivities.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No activities found
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedAction !== "all"
              ? "Try adjusting your search criteria or filters"
              : "No activities recorded yet"}
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              Security & Compliance
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>
                • All system activities are automatically logged and monitored
              </p>
              <p>
                • Activity logs are retained for 7 years as per compliance
                requirements
              </p>
              <p>
                • Unauthorized access attempts are immediately flagged and
                investigated
              </p>
              <p>• Log integrity is protected using cryptographic signatures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
