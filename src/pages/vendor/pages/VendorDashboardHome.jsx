import React, { useState, useEffect, useMemo } from "react";
import api from "../../../services/apiService";
import activitiesService from "../../../services/activitiesService";
import toastService from "../../../services/toastService";
import tenderApiService from "../../../services/tenderApiService";
import vendorStatsService from "../../../services/vendorStatsService";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Download,
  ExternalLink,
  Calendar,
  IndianRupee,
  Award,
  Eye,
  X,
  XCircle,
  RefreshCw,
  AlertCircle,
  Activity,
  Edit,
  Trash2,
  Plus,
  Users,
  Settings,
  Loader2,
} from "lucide-react";
import TopupModal from "../../../components/shared/TopupModal";
import ViewDetailsPopup from "../popups/ViewDetailsPopup";

const VendorDashboardHome = () => {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Fallback demo activities for vendor
  const getFallbackActivities = () => [
    {
      id: "demo-1",
      action: "bid_submitted",
      description: "Submitted bid for Highway Construction Project",
      details: "Highway Construction Project Phase 2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      entityType: "bid",
    },
    {
      id: "demo-2",
      action: "tender_viewed",
      description: "Viewed tender details",
      details: "School Building Construction",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      entityType: "tender",
    },
    {
      id: "demo-3",
      action: "document_uploaded",
      description: "Uploaded technical specifications",
      details: "Water Treatment Plant Upgrade",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      entityType: "document",
    },
    {
      id: "demo-4",
      action: "evaluation_received",
      description: "Received bid evaluation results",
      details: "Metro Rail Extension Project",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      entityType: "evaluation",
    },
  ];

  // State for recent activities from API - initialize with demo data
  const [recentActivities, setRecentActivities] = useState(
    getFallbackActivities()
  );
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);

  // State for upcoming deadlines from API
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [deadlinesLoading, setDeadlinesLoading] = useState(true);
  const [deadlinesError, setDeadlinesError] = useState(null);

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
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "evaluation_received":
      case "evaluation":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "contract_awarded":
      case "award":
      case "awarded":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "profile_updated":
      case "profile":
        return <Users className="w-5 h-5 text-gray-600" />;
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

      console.log("🔄 Fetching vendor activities from API...");

      // Set fallback data immediately to ensure something is shown
      const fallbackData = getFallbackActivities();

      const response = await activitiesService.getMyActivities({
        page: 1,
        limit: 5, // Only get 5 most recent for dashboard
      });

      console.log("📥 Vendor API Response:", response);

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
        setRecentActivities(fallbackData);
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

  // Fetch upcoming deadlines from API
  const fetchUpcomingDeadlines = async () => {
    try {
      setDeadlinesLoading(true);
      setDeadlinesError(null);

      console.log("🔄 Fetching upcoming deadlines from API...");

      const response = await tenderApiService.getVendorClosingSoonTenders();

      console.log("📅 Upcoming Deadlines API Response:", response);

      // Handle different possible response structures
      let tendersData = [];

      if (response?.success && response?.data && Array.isArray(response.data)) {
        tendersData = response.data;
      } else if (Array.isArray(response?.data)) {
        tendersData = response.data;
      } else if (Array.isArray(response)) {
        tendersData = response;
      } else {
        console.log("⚠️ Unexpected response format, trying to extract data...");
        tendersData = [];
      }

      if (tendersData.length > 0) {
        // Filter and transform only active tenders that are closing soon
        const currentDate = new Date();
        const filteredTenders = tendersData.filter((tender) => {
          if (!tender.bidDeadline) return false;
          const deadline = new Date(tender.bidDeadline);
          const diffTime = deadline - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 30; // Only show tenders closing within 30 days
        });

        const formattedDeadlines = filteredTenders
          .sort((a, b) => new Date(a.bidDeadline) - new Date(b.bidDeadline)) // Sort by deadline
          .slice(0, 10) // Take only top 10
          .map((tender) => {
            const deadline = new Date(tender.bidDeadline);
            const diffTime = deadline - currentDate;
            const daysLeft = Math.max(
              0,
              Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            );

            return {
              id: tender._id,
              tenderId: tender.tenderId,
              title: tender.title,
              type: "Bid Submission",
              deadline: deadline.toLocaleDateString("en-GB"),
              bidDeadlineISO: tender.bidDeadline,
              daysLeft: daysLeft,
              isUrgent: daysLeft <= 3,
              priority:
                daysLeft <= 3 ? "high" : daysLeft <= 7 ? "medium" : "low",
              category: tender.category,
              value: tender.value,
              status: tender.status,
              description: tender.description,
            };
          });

        setUpcomingDeadlines(formattedDeadlines);
        console.log(
          "✅ Using live deadlines data:",
          formattedDeadlines.length,
          "deadlines found"
        );
      } else {
        console.log("⚠️ No valid tenders found in API response");
        throw new Error("No tenders data found");
      }
    } catch (error) {
      console.error("❌ Error fetching upcoming deadlines:", error);
      setDeadlinesError(error.message);

      // Fallback to demo data on error
      const fallbackDeadlines = [
        {
          title: "Bridge Construction Tender",
          type: "Bid Submission",
          deadline: "30/10/2025",
          daysLeft: 5,
          priority: "high",
        },
        {
          title: "Road Maintenance Contract",
          type: "Technical Evaluation",
          deadline: "05/11/2025",
          daysLeft: 11,
          priority: "medium",
        },
        {
          title: "Hospital Equipment Supply",
          type: "Award Decision",
          deadline: "15/11/2025",
          daysLeft: 21,
          priority: "low",
        },
      ];

      setUpcomingDeadlines(fallbackDeadlines);
      console.log("⚠️ Using fallback deadlines data");
    } finally {
      setDeadlinesLoading(false);
    }
  };

  // Fetch vendor stats from API
  const fetchVendorStats = async () => {
    try {
      setStatsLoading(true);
      console.log("🔄 Fetching vendor stats from API...");

      const response = await vendorStatsService.getVendorStats();
      console.log("📊 Vendor stats service response:", response);

      if (response.success && response.data) {
        console.log("✅ Setting stats data:", response.data);
        setStatsData(response.data);
        console.log("✅ Vendor stats loaded successfully:", response.data);
      } else {
        console.warn("⚠️ Failed to fetch vendor stats:", response.error);
        // Keep statsData as null to use fallback demo data
        setStatsData(null);
      }
    } catch (error) {
      console.error("❌ Error fetching vendor stats:", error);
      // Keep statsData as null to use fallback demo data
      setStatsData(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // Create stats array from API data or fallback to demo data
  const getStats = () => {
    console.log("📊 getStats called with statsData:", statsData);

    if (statsData) {
      console.log("📊 Using API data for stats");
      const apiStats = [
        {
          title: "Active Tenders",
          value: statsData.activeTenders?.toString() || "0",
          change: "+2",
          changeType: "positive",
          icon: <FileText className="w-8 h-8 text-blue-600" />,
          description: "Currently published and open for bidding",
        },
        {
          title: "Submitted Bids",
          value: statsData.submittedBids?.toString() || "0",
          change: "+3",
          changeType: "positive",
          icon: <Clock className="w-8 h-8 text-orange-600" />,
          description: "Bids submitted and under review",
        },
        {
          title: "Success Rate",
          value: `${statsData.successRate || 0}%`,
          change: "+5%",
          changeType: "positive",
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          description: "This month success rate",
        },
        {
          title: "Under Review",
          value: statsData.underReview?.toString() || "0",
          change: "0",
          changeType: "neutral",
          icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
          description: "Bids currently under evaluation",
        },
      ];
      console.log("📊 Generated API stats:", apiStats);
      return apiStats;
    }

    console.log("📊 Using fallback demo data for stats");
    // Fallback demo stats when API data is not available
    return [
      {
        title: "Active Tenders",
        value: "24",
        change: "+2",
        changeType: "positive",
        icon: <FileText className="w-8 h-8 text-blue-600" />,
        description: "Currently published and open for bidding",
      },
      {
        title: "Submitted Bids",
        value: "12",
        change: "+3",
        changeType: "positive",
        icon: <Clock className="w-8 h-8 text-orange-600" />,
        description: "Bids received and under review",
      },
      {
        title: "Success Rate",
        value: "68%",
        change: "+5%",
        changeType: "positive",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        description: "This month success rate",
      },
      {
        title: "Under Review",
        value: "5",
        change: "0",
        changeType: "neutral",
        icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
        description: "No change from last period",
      },
    ];
  };

  // Calculate stats using useMemo to react to statsData changes
  const stats = useMemo(() => {
    console.log("🔄 Recalculating stats with data:", statsData);
    return getStats();
  }, [statsData]);

  // Load activities and stats on component mount
  useEffect(() => {
    console.log(
      "🚀 VendorDashboardHome mounted, fetching activities, deadlines, and stats..."
    );
    fetchRecentActivities();
    fetchUpcomingDeadlines();
    fetchVendorStats();
  }, []);

  // Debug effect to monitor statsData changes
  useEffect(() => {
    console.log("📊 statsData changed:", statsData);
    console.log("📊 statsLoading:", statsLoading);
  }, [statsData, statsLoading]);

  const [recentTenders, setRecentTenders] = useState([]);
  const [tendersLoading, setTendersLoading] = useState(false);
  const [tendersError, setTendersError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setTendersLoading(true);
        setTendersError(null);
        const resp = await api.get("/v1/tenders?page=1&limit=3");

        const items = (resp && resp.data) || [];
        const mapped = items.map((t) => {
          const deadline = t.bidDeadline || t.deadline || null;
          const daysLeft = deadline
            ? Math.max(
                Math.ceil(
                  (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
                ),
                0
              )
            : null;
          const status = t.isActive
            ? daysLeft === 0
              ? "Closing"
              : "Open"
            : "Closed";
          const statusColor =
            status === "Open"
              ? "green"
              : status === "Closing"
              ? "yellow"
              : "gray";

          // Format location string
          const locationParts = [t.district, t.state].filter(Boolean);
          const location = locationParts.join(", ") || "Not specified";

          // Format meeting date
          const meetingDate = t.meetingDate
            ? new Date(t.meetingDate).toLocaleDateString()
            : null;

          return {
            id: t._id,
            title: t.title || "Untitled Tender",
            department: t.department || t.state || "",
            category: t.category || "General",
            estimatedValue: formatCurrency(t.value || t.estimatedValue || 0),
            deadline: deadline ? new Date(deadline).toLocaleDateString() : "-",
            status,
            daysLeft: daysLeft === null ? "-" : daysLeft,
            statusColor,
            bidsCount: t.bidsCount || 0,
            isBidSubmitted: !!t.isBidSubmitted,

            // Additional fields for ViewDetailsPopup
            description: t.description || "No description available",
            eligibilityCriteria: t.eligibilityCriteria || [],
            technicalSpecifications: t.technicalSpecifications || "",
            documents: t.documents || [],
            meetingDate: meetingDate,
            meetingVenue: t.meetingVenue || "",
            location: location,
            address: t.address || "",
            contactPerson: t.contactPerson || "",
            contactNumber: t.contactNumber || "",
            contactEmail: t.contactEmail || "",
            publishedDate: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString()
              : "",
            documentFee: "Not specified",
            emd: "Not specified",
            originalData: t, // Keep original data for reference
          };
        });
        setRecentTenders(mapped);
      } catch (err) {
        console.error("Failed to load recent tenders", err);
        setTendersError(
          (err && err.message) || "Failed to load recent tenders"
        );
      } finally {
        setTendersLoading(false);
      }
    })();
  }, []);

  const quickActions = [
    {
      title: "Browse Tenders",
      description: "Find new opportunities",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: "blue",
      route: "/vendor/tender-listings",
    },
    {
      title: "Submit Bid",
      description: "Upload your proposal",
      icon: <Clock className="w-6 h-6 text-green-600" />,
      color: "green",
      route: "/vendor/tender-listings",
    },
    {
      title: "Track Bids",
      description: "Monitor submission status",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: "purple",
      route: "/vendor/bid-management",
    },
    {
      title: "Top-up Plan",
      description: "Add more tender credits",
      icon: <Award className="w-6 h-6 text-orange-600" />,
      color: "orange",
      action: "topup",
    },
  ];

  // --- Subscription Plans (fetched from API) ---
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState(null);

  const activeSubscription =
    subscriptions && subscriptions.length > 0
      ? subscriptions.find(
          (s) => s.status === "paid" && new Date(s.validTill) > new Date()
        ) || null
      : null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "-";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    } catch (e) {
      return String(val);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setPlansLoading(true);
        setPlansError(null);
        const resp = await (
          await import("../../../services/apiService")
        ).default.get("/v1/plans");
        const items = (resp && resp.data) || [];
        const mapped = items.map((p) => ({
          id: p._id,
          planID: p.planID,
          icon: p.icon || "",
          name: p.name || "Plan",
          price: p.price || 0,
          tendersLimit: p.tendersLimit || 0,
          validDays: p.validDays || null,
          included: Array.isArray(p.included) ? p.included : [],
          excluded: Array.isArray(p.excluded) ? p.excluded : [],
          isPopular: !!p.isPopular,
          isActive: !!p.isActive,
        }));
        setPlans(mapped);
      } catch (err) {
        console.error("Failed to load plans", err);
        setPlansError((err && err.message) || "Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    })();
  }, []);
  // handle onSuccess from TopupModal to refresh subscriptions and close modal
  const handleTopupSuccess = async () => {
    try {
      const resp = await api.get("/v1/subscriptions");
      setSubscriptions((resp && resp.data) || []);
      setShowTopupModal(false);
    } catch (err) {
      console.error("Failed to refresh subscriptions", err);
    }
  };

  // handle showing tender details modal
  const handleShowTenderDetails = (tender) => {
    setSelectedTender(tender);
    setShowDetailsModal(true);
  };

  // handle closing tender details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTender(null);
  };

  // fetch subscriptions
  useEffect(() => {
    (async () => {
      try {
        setSubsLoading(true);
        setSubsError(null);
        const resp = await api.get("/v1/subscriptions");
        const items = (resp && resp.data) || [];
        setSubscriptions(items);
      } catch (err) {
        console.error("Failed to load subscriptions", err);
        setSubsError((err && err.message) || "Failed to load subscriptions");
      } finally {
        setSubsLoading(false);
      }
    })();
  }, []);

  // read logged-in user's display name from localStorage
  let storedUser = {};
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem("user");
      if (raw) storedUser = JSON.parse(raw) || {};
    }
  } catch (e) {
    storedUser = {};
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back,{" "}
              {storedUser.name || storedUser.companyName || "Guest"}
            </h1>
            <p className="text-primary-100 mb-4">
              Manage your tenders and track bid submissions efficiently
            </p>
            {/* <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Last login: Today 09:30 AM
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Account Status: Verified
              </span>
            </div> */}
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                {subsLoading ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : activeSubscription ? (
                  <>
                    <div className="text-2xl font-bold">
                      {activeSubscription.plan?.name || "Subscription"}
                    </div>
                    <div className="text-primary-100 text-sm">
                      Active Subscription
                    </div>
                    <div className="text-sm text-primary-200 mt-2">
                      Valid until:{" "}
                      {activeSubscription.validTill
                        ? new Date(
                            activeSubscription.validTill
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">No Active Plan</div>
                    <div className="text-sm text-primary-100">
                      No active subscription
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => setShowTopupModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Subscribe
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Subscription Section (only if there is an active subscription) */}
      {activeSubscription ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Active Subscription
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <h3 className="text-lg font-bold text-green-700">
                {activeSubscription.plan?.name || "Subscription"}
              </h3>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Remaining Tenders</p>
              <h3 className="text-xl font-bold text-gray-800">
                {Math.max(
                  (activeSubscription.plan?.tendersLimit || 0) -
                    (activeSubscription.usedBids || 0),
                  0
                )}
              </h3>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tenders Used</p>
              <h3 className="text-xl font-bold text-gray-800">
                {activeSubscription.usedBids || 0}
              </h3>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Days Remaining</p>
              <h3 className="text-xl font-bold text-orange-600">
                {activeSubscription.validTill
                  ? Math.ceil(
                      (new Date(activeSubscription.validTill) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : "-"}
              </h3>
            </div>
            <div>
              <button
                onClick={() => setShowTopupModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Top-up
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    activeSubscription.plan?.tendersLimit
                      ? ((activeSubscription.plan.tendersLimit -
                          (activeSubscription.usedBids || 0)) /
                          activeSubscription.plan.tendersLimit) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Usage Progress: {activeSubscription.usedBids || 0}/
              {activeSubscription.plan?.tendersLimit || 0} used | Valid until{" "}
              {activeSubscription.validTill
                ? new Date(activeSubscription.validTill).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">No Active Subscription</h3>
            <p className="text-sm text-gray-600">
              You don't have an active plan. Subscribe to start submitting bids.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowTopupModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading
          ? // Loading skeleton for stats cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div>
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-8 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          : stats.map((stat, index) => (
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
                  {/* {stat.change !== "0" && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <span>{stat.change}</span>
                    </div>
                  )} */}
                </div>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                if (action.route) return navigate(action.route);
                if (action.action === "topup") return setShowTopupModal(true);
              }}
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
        {/* Latest Tender Opportunities */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Latest Tender Opportunities
              </h2>
              <button
                onClick={() => navigate("/vendor/tender-listings")}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View All Tender Listings →
              </button>
            </div>

            <div className="space-y-4">
              {recentTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {tender.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {tender.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {tender.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <IndianRupee className="w-4 h-4" />
                          {tender.estimatedValue}
                        </span>
                        <span className="text-gray-500">
                          Deadline: {tender.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          tender.statusColor === "green"
                            ? "bg-green-100 text-green-600"
                            : tender.statusColor === "yellow"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tender.status}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {tender.daysLeft} days left
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleShowTenderDetails(tender)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      View Tender
                    </button>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/vendor/bid-management")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Bid Submissions →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
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
                    key={activity.id || activity._id || index}
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
                          activity.metadata?.tenderTitle ||
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
                onClick={() => navigate("/vendor/activities")}
              >
                View All Activities →
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Deadlines
              </h3>
              {deadlinesLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
              {!deadlinesLoading && (
                <button
                  onClick={fetchUpcomingDeadlines}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Refresh deadlines"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {deadlinesError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600">
                  Error loading deadlines: {deadlinesError}
                </p>
                <button
                  onClick={fetchUpcomingDeadlines}
                  className="text-sm text-red-700 underline mt-1"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="space-y-3">
              {deadlinesLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50 animate-pulse"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                      item.priority === "high"
                        ? "border-red-400 bg-red-50"
                        : item.priority === "medium"
                        ? "border-blue-400 bg-blue-50"
                        : "border-blue-400 bg-blue-50"
                    }`}
                    onClick={() => {
                      if (item.id) {
                        navigate("/vendor/tender-listings");
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        {item.tenderId && (
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {item.tenderId}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {item.deadline}
                        </p>
                        {item.category && (
                          <p className="text-xs text-gray-400 mt-1">
                            Category: {item.category}
                          </p>
                        )}
                        {item.value && (
                          <p className="text-xs text-green-600 mt-1">
                            Value: ₹{item.value.toLocaleString()}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-2">
                        <span
                          className={`text-xs font-medium block ${
                            item.priority === "high"
                              ? "text-red-600"
                              : item.priority === "medium"
                              ? "text-blue-600"
                              : "text-blue-600"
                          }`}
                        >
                          {item.daysLeft} days left
                        </span>
                        {item.isUrgent && (
                          <span className="text-xs text-red-500 font-medium">
                            URGENT
                          </span>
                        )}
                        {item.id && (
                          <ExternalLink className="w-3 h-3 text-gray-400 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming deadlines</p>
                  <button
                    onClick={() => navigate("/vendor/tender-listings")}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                  >
                    Browse available tenders
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          {/* <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Notifications
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm">
                Mark All Read
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New Tender Available ●
                  </p>
                  <p className="text-sm text-gray-600">
                    Smart City Infrastructure Development Project - Phase II has
                    been published.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Submission Deadline Approaching ●
                  </p>
                  <p className="text-sm text-gray-600">
                    Highway Construction Project Phase I closes in 48 hours.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Bid Status Updated
                  </p>
                  <p className="text-sm text-gray-600">
                    Your bid for Medical Equipment Procurement is now under
                    technical evaluation.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All Notifications →
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <TopupModal
        show={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        plans={plans}
        plansLoading={plansLoading}
        plansError={plansError}
        onSuccess={handleTopupSuccess}
        formatCurrency={formatCurrency}
      />

      {showDetailsModal && selectedTender && (
        <ViewDetailsPopup
          tender={selectedTender}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default VendorDashboardHome;
