import React, { useState, useEffect } from "react";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

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
} from "lucide-react";
import TopupModal from "../../../components/shared/TopupModal";

const VendorDashboardHome = () => {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const stats = [
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

  const recentTenders = [
    {
      id: 1,
      title: "Highway Construction Project Phase II",
      department: "Department of Public Works",
      category: "Construction",
      estimatedValue: "₹85,50,000",
      deadline: "2024-05-15",
      status: "Open",
      daysLeft: 15,
      statusColor: "green",
    },
    {
      id: 2,
      title: "Government Office IT Infrastructure",
      department: "Ministry of Electronics & IT Services",
      category: "IT Services",
      estimatedValue: "₹65,75,000",
      deadline: "2024-05-10",
      status: "Closing Soon",
      daysLeft: 5,
      statusColor: "yellow",
    },
    {
      id: 3,
      title: "Medical Equipment Procurement",
      department: "State Health Department",
      category: "Healthcare",
      estimatedValue: "₹1,25,50,000",
      deadline: "2024-05-08",
      status: "Open",
      daysLeft: 12,
      statusColor: "green",
    },
  ];

  const recentActivity = [
    {
      type: "new_tender",
      title: "New tender published",
      description: "Highway Construction Project Phase 2",
      time: "2 hours ago",
      icon: <FileText className="w-5 h-5 text-green-600" />,
    },
    {
      type: "bid_completed",
      title: "Bid evaluation completed",
      description: "School Building Construction",
      time: "4 hours ago",
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
    },
    {
      type: "meeting_scheduled",
      title: "Pre-bid meeting scheduled",
      description: "Water Treatment Plant Upgrade",
      time: "6 hours ago",
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
    },
    {
      type: "clarification",
      title: "Clarification published",
      description: "Metro Rail Extension Project",
      time: "1 day ago",
      icon: <FileText className="w-5 h-5 text-purple-600" />,
    },
  ];

  const quickActions = [
    {
      title: "Browse Tenders",
      description: "Find new opportunities",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Submit Bid",
      description: "Upload your proposal",
      icon: <Clock className="w-6 h-6 text-green-600" />,
      color: "green",
    },
    {
      title: "Track Bids",
      description: "Monitor submission status",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: "purple",
    },
    {
      title: "Top-up Plan",
      description: "Add more tender credits",
      icon: <Award className="w-6 h-6 text-orange-600" />,
      color: "orange",
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
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Last login: Today 09:30 AM
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Account Status: Verified
              </span>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Latest Tender Opportunities */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Latest Tender Opportunities
              </h2>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
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
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
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
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View All Bid Submissions →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gray-50">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          {/* Recent Notifications */}
          <div className="card">
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
          </div>
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
    </div>
  );
};

export default VendorDashboardHome;
