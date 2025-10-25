import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Award,
  Users,
  TrendingUp,
  Calendar,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Activity,
  Edit,
  Trash2,
  Settings,
  Loader2,
  RefreshCw,
} from "lucide-react";
import activitiesService from "../../../services/activitiesService";

const ClientDashboardHome = () => {
  // State for recent activities from API
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);

  // Function to get activity icon based on action type
  const getActivityIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "create":
      case "created":
      case "publish":
      case "published":
        return <Plus className="w-5 h-5 text-green-600" />;
      case "update":
      case "updated":
      case "edit":
      case "edited":
        return <Edit className="w-5 h-5 text-blue-600" />;
      case "delete":
      case "deleted":
        return <Trash2 className="w-5 h-5 text-red-600" />;
      case "view":
      case "viewed":
        return <Eye className="w-5 h-5 text-purple-600" />;
      case "download":
      case "downloaded":
        return <Download className="w-5 h-5 text-indigo-600" />;
      case "submit":
      case "submitted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "evaluate":
      case "evaluation":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "award":
      case "awarded":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "schedule":
      case "scheduled":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "tender":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "bid":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "vendor":
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
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

  // Fetch recent activities from API
  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);

      console.log("🔄 Fetching activities from API...");
      const response = await activitiesService.getMyActivities({
        page: 1,
        limit: 5, // Only get 5 most recent for dashboard
      });

      console.log("📥 API Response:", response);

      // Handle different possible response structures
      let activitiesData = null;

      if (
        response?.data?.activities &&
        Array.isArray(response.data.activities)
      ) {
        activitiesData = response.data.activities;
        console.log(
          "✅ Found activities in response.data.activities:",
          activitiesData.length
        );
      } else if (response?.activities && Array.isArray(response.activities)) {
        activitiesData = response.activities;
        console.log(
          "✅ Found activities in response.activities:",
          activitiesData.length
        );
      } else if (response?.data && Array.isArray(response.data)) {
        activitiesData = response.data;
        console.log(
          "✅ Found activities in response.data array:",
          activitiesData.length
        );
      } else if (Array.isArray(response)) {
        activitiesData = response;
        console.log(
          "✅ Found activities as direct array:",
          activitiesData.length
        );
      }

      if (activitiesData && activitiesData.length > 0) {
        setRecentActivities(activitiesData);
        console.log("✅ Using live API data");
      } else {
        console.log(
          "⚠️ No activities found in API response, using fallback data"
        );
        setRecentActivities(getFallbackActivities());
      }
    } catch (error) {
      console.error("❌ Error fetching recent activities:", error);
      setActivitiesError(error.message);
      // Use fallback demo data on error
      setRecentActivities(getFallbackActivities());
      console.log("⚠️ Using fallback data due to error");
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fallback demo activities
  const getFallbackActivities = () => [
    {
      id: "demo-1",
      action: "publish",
      description: "New tender published",
      details: "Highway Construction Project Phase 2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      entityType: "tender",
    },
    {
      id: "demo-2",
      action: "evaluation",
      description: "Bid evaluation completed",
      details: "School Building Construction",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      entityType: "bid",
    },
    {
      id: "demo-3",
      action: "schedule",
      description: "Pre-bid meeting scheduled",
      details: "Water Treatment Plant Upgrade",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      entityType: "meeting",
    },
    {
      id: "demo-4",
      action: "update",
      description: "Clarification published",
      details: "Metro Rail Extension Project",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      entityType: "clarification",
    },
  ];

  // Load activities on component mount
  useEffect(() => {
    fetchRecentActivities();
  }, []);
  const stats = [
    {
      title: "Active Tenders",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      description: "Currently published and open for bidding",
    },
    {
      title: "Under Evaluation",
      value: "8",
      change: "+3",
      changeType: "positive",
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      description: "Bids received and under review",
    },
    {
      title: "Awarded This Month",
      value: "15",
      change: "+5",
      changeType: "positive",
      icon: <Award className="w-8 h-8 text-green-600" />,
      description: "Tenders successfully awarded",
    },
    {
      title: "Total Vendors",
      value: "248",
      change: "+12",
      changeType: "positive",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      description: "Registered vendor database",
    },
  ];

  const upcomingDeadlines = [
    {
      title: "Bridge Construction Tender",
      type: "Bid Submission",
      deadline: "15/04/2024",
      daysLeft: 3,
      priority: "high",
    },
    {
      title: "Road Maintenance Contract",
      type: "Technical Evaluation",
      deadline: "20/04/2024",
      daysLeft: 8,
      priority: "medium",
    },
    {
      title: "Hospital Equipment Supply",
      type: "Award Decision",
      deadline: "25/04/2024",
      daysLeft: 13,
      priority: "low",
    },
  ];

  const quickActions = [
    {
      title: "Create New Tender",
      description: "Publish a new tender",
      icon: <Plus className="w-6 h-6 text-green-600" />,
      color: "green",
    },
    {
      title: "Schedule Pre-bid Meeting",
      description: "Organize vendor meeting",
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Evaluate Bids",
      description: "Review submitted bids",
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      color: "purple",
    },
    {
      title: "Manage Vendors",
      description: "Vendor verification",
      icon: <Users className="w-6 h-6 text-orange-600" />,
      color: "orange",
    },
    {
      title: "View Reports",
      description: "Analytics and insights",
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-primary-100 mb-4">
              Manage your tenders and track bid submissions efficiently
            </p>
            <div className="flex items-center gap-3">
              <div className="text-sm text-primary-200">Last 30 days</div>
            </div>
          </div>
          <div className="text-right">
            <select className="bg-white/20 backdrop-blur text-white border border-white/30 rounded-lg px-3 py-2 text-sm">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {stat.icon}
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
              {stat.change !== "0" && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`p-3 rounded-full bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors mb-3`}
                >
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <div className="flex items-center gap-2">
                {activitiesError && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Demo Data
                  </span>
                )}
                {!activitiesError && !activitiesLoading && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Live Data
                  </span>
                )}
                <button
                  onClick={fetchRecentActivities}
                  disabled={activitiesLoading}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  title="Refresh activities"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      activitiesLoading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {activitiesError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Cannot connect to API at{" "}
                  <code className="bg-yellow-100 px-1 rounded">
                    localhost:3003
                  </code>
                  .
                  <br />
                  Showing demo data. Start your backend server and click
                  refresh.
                </p>
                <button
                  onClick={() => {
                    console.log("🧪 Testing API connection manually...");
                    fetchRecentActivities();
                  }}
                  className="mt-2 text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded transition-colors"
                >
                  Test API Connection
                </button>
              </div>
            )}

            <div className="space-y-4">
              {activitiesLoading ? (
                // Loading skeleton
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 animate-pulse"
                    >
                      <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 rounded-full bg-gray-50">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {activity.description || activity.action || "Activity"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details ||
                          activity.entityType ||
                          "No details available"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatActivityTime(
                          activity.timestamp || activity.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activities found</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                onClick={() => (window.location.href = "/client/activities")}
              >
                View All Activities →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    item.priority === "high"
                      ? "border-red-400 bg-red-50"
                      : item.priority === "medium"
                      ? "border-blue-400 bg-blue-50"
                      : "border-blue-400 bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">{item.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {item.deadline}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.priority === "high"
                          ? "text-red-600"
                          : item.priority === "medium"
                          ? "text-blue-600"
                          : "text-blue-600"
                      }`}
                    >
                      {item.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Contract Value
                </span>
                <span className="text-lg font-bold text-green-600">
                  ₹45.2Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Avg. Bid Response Rate
                </span>
                <span className="text-lg font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Time</span>
                <span className="text-lg font-bold text-orange-600">
                  12 days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-bold text-purple-600">94%</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                System Status
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">All Services</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Last Backup</span>
                <span className="text-green-600 font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Security Scan</span>
                <span className="text-green-600 font-medium">Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardHome;
