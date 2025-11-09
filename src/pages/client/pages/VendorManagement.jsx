import React, { useState, useEffect, useRef, useCallback } from "react";
import apiService from "../../../services/apiService";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  FileText,
  AlertTriangle,
  User,
  TrendingUp,
  Download,
  MessageSquare,
  Ban,
  X,
} from "lucide-react";
import VendorDetails from "../popup/VendorDetails";
import RateVendorModal from "../popup/RateVendorModal";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

const VendorManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [vendorToRate, setVendorToRate] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [vendorToSuspend, setVendorToSuspend] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
  const [vendorToUnsuspend, setVendorToUnsuspend] = useState(null);
  const [unsuspendNotes, setUnsuspendNotes] = useState("");

  const tabs = [
    { id: "all", label: "All Vendors", count: 248 },
    { id: "verified", label: "Verified", count: 186 },
    { id: "pending", label: "Pending Verification", count: 42 },
    { id: "blacklisted", label: "Blacklisted", count: 3 },
  ];

  const [categories, setCategories] = useState([
    { value: "all", label: "All Categories" },
  ]);

  useEffect(() => {
    apiService
      .get("/v1/common/categories")
      .then((data) => {
        setCategories([
          { value: "all", label: "All Categories" },
          ...data.map((cat) => ({ value: cat.toLowerCase(), label: cat })),
        ]);
      })
      .catch(() => setCategories([{ value: "all", label: "All Categories" }]));
  }, []);

  // remote vendors state (from /v1/users?role=vendor)
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const formatLastActive = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Add suffix to day (1st, 2nd, 3rd, 4th, etc.)
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${suffix(day)}, ${year}`;
  };

  const normalize = (item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    phone: item.phoneNumber || item.phone || "",
    category:
      (item.company &&
        item.company.specializations &&
        item.company.specializations[0]) ||
      "—",
    location: item.address || "",
    status: item.isActive ? "verified" : "pending",
    rating: item.rating || 0,
    totalProjects: item.totalBids || 0,
    tendersWon: item.awardedBids || 0,
    successRate: item.successRate || 0,
    lastActivity: formatLastActive(item.lastActive),
    company: item.company || {},
    isSuspended: item.isSuspended || false,
    // Average ratings from vendor object
    technicalRating: item.averageRatings?.averageTechnicalRating || 0,
    financialRating: item.averageRatings?.averageFinancialRating || 0,
    deliveryRating: item.averageRatings?.averageDeliveryRating || 0,
    overallRating: item.averageRatings?.averageOverallRating || 0,
    totalRatings: item.averageRatings?.totalRatings || 0,
    hasRating: (item.averageRatings?.totalRatings || 0) > 0,
    raw: item,
  });

  const fetchVendors = useCallback(
    async (p = 1, replace = false) => {
      setLoading(true);
      try {
        const resp = await api.get("/v1/users/client", {
          queryParams: { page: p, limit, role: "vendor" },
        });
        const data = resp && resp.data ? resp.data : [];
        const tp =
          resp && typeof resp.totalPages === "number" ? resp.totalPages : 1;
        setTotalPages(tp);
        setHasMore(p < tp);
        setPage(p);

        const norm = data.map(normalize);
        setVendors((prev) => (replace ? norm : [...prev, ...norm]));
      } catch (err) {
        if (toastService && typeof toastService.showError === "function") {
          toastService.showError(err?.message || "Failed to load vendors");
        }
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    // initial load
    setVendors([]);
    setPage(1);
    fetchVendors(1, true);
  }, [fetchVendors]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            fetchVendors(page + 1, false);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef, hasMore, loading, page, fetchVendors]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "suspended":
      case "blacklisted":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "verified":
        return `${baseClasses} bg-green-100 text-green-600`;
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case "suspended":
        return `${baseClasses} bg-red-100 text-red-600`;
      case "blacklisted":
        return `${baseClasses} bg-red-100 text-red-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-blue-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedVendor(null);
  };

  const handleRateVendor = (vendor) => {
    setVendorToRate(vendor);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setVendorToRate(null);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      await api.post("/v1/ratings", {
        body: {
          ratedTo: ratingData.vendorId,
          technicalRating: ratingData.ratings.technical,
          financialRating: ratingData.ratings.financial,
          deliveryRating: ratingData.ratings.delivery,
          overallRating: ratingData.ratings.overall,
          additionalFeedback: ratingData.feedback || "",
        },
      });

      // Optionally refresh the vendor list to show updated ratings
      fetchVendors(1, true);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleSuspendVendor = (vendor) => {
    setVendorToSuspend(vendor);
    setShowSuspendModal(true);
  };

  const handleCloseSuspendModal = () => {
    setShowSuspendModal(false);
    setVendorToSuspend(null);
    setSuspendReason("");
  };

  const handleSubmitSuspend = async () => {
    if (!suspendReason.trim()) {
      toastService.showError("Please provide a reason for suspension");
      return;
    }

    try {
      await api.post("/v1/suspends", {
        body: {
          user: vendorToSuspend.raw._id || vendorToSuspend.raw.id,
          reason: suspendReason,
        },
      });

      toastService.showSuccess("Vendor suspended successfully");
      handleCloseSuspendModal();

      // Refresh the vendor list
      fetchVendors(1, true);
    } catch (error) {
      // Extract error message from response data
      const errorMessage =
        error?.data?.message || error?.message || "Failed to suspend vendor";
      toastService.showError(errorMessage);
    }
  };

  const handleUnsuspendVendor = (vendor) => {
    setVendorToUnsuspend(vendor);
    setShowUnsuspendModal(true);
  };

  const handleCloseUnsuspendModal = () => {
    setShowUnsuspendModal(false);
    setVendorToUnsuspend(null);
    setUnsuspendNotes("");
  };

  const handleSubmitUnsuspend = async () => {
    if (!unsuspendNotes.trim()) {
      toastService.showError("Please provide notes for unsuspension");
      return;
    }

    try {
      const vendorId = vendorToUnsuspend.raw._id || vendorToUnsuspend.raw.id;
      await api.put(`/v1/suspends/${vendorId}/unsuspend`, {
        body: {
          notes: unsuspendNotes,
        },
      });

      toastService.showSuccess("Vendor unsuspended successfully");
      handleCloseUnsuspendModal();

      // Refresh the vendor list
      fetchVendors(1, true);
    } catch (error) {
      // Extract error message from response data
      const errorMessage =
        error?.data?.message || error?.message || "Failed to unsuspend vendor";
      toastService.showError(errorMessage);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesTab = activeTab === "all" || vendor.status === activeTab;
    const matchesCategory =
      selectedCategory === "all" ||
      vendor.category.toLowerCase().includes(selectedCategory);
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const stats = [
    {
      label: "Total Vendors",
      value: "3",
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Active Vendors",
      value: "2",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Suspended",
      value: "1",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
    {
      label: "Verification Pending",
      value: "1",
      icon: <Clock className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rating Modal */}
      {showRatingModal && vendorToRate && (
        <RateVendorModal
          vendor={vendorToRate}
          onClose={handleCloseRatingModal}
          onSubmit={handleSubmitRating}
        />
      )}
      {/* Vendor Details Modal */}
      {showDetails && selectedVendor && (
        <VendorDetails vendor={selectedVendor} onClose={handleCloseDetails} />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vendor Management
            </h1>
            <p className="text-gray-600 mt-1">
              Tender Management & Procurement System
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Vendor List
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Vendor Cards */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {vendor.name}
                  </h3>
                  {vendor.status === "verified" && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
                  {vendor.status === "pending" && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(vendor)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 px-4 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleRateVendor(vendor)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 px-4 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Rate Vendor
                  </button>
                  {vendor.isSuspended ? (
                    <button
                      onClick={() => handleUnsuspendVendor(vendor)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium px-4 py-1.5 border border-green-200 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Unsuspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspendVendor(vendor)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium px-4 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                      <Ban className="w-4 h-4" />
                      Suspend
                    </button>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Contact Person
                  </div>
                  <div className="font-medium text-gray-900">
                    {vendor.contactPerson || vendor.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-medium text-gray-900">
                    {vendor.category}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Experience</div>
                  <div className="font-medium text-gray-900">
                    {vendor.experience}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">ID</div>
                  <div className="font-medium text-gray-900">{vendor.id}</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Tenders</div>
                  <div className="font-bold text-lg text-blue-600">
                    {vendor.totalProjects}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Won</div>
                  <div className="font-bold text-lg text-green-600">
                    {vendor.tendersWon}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Success Rate</div>
                  <div
                    className={`font-bold text-lg ${getPerformanceColor(
                      vendor.successRate
                    )}`}
                  >
                    {vendor.successRate}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Last Active</div>
                  <div className="font-medium text-sm text-gray-900">
                    {vendor.lastActivity}
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">
                    Technical Rating
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getRatingStars(vendor.technicalRating)}
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">
                    ({vendor.technicalRating})
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">
                    Financial Rating
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getRatingStars(vendor.financialRating)}
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">
                    ({vendor.financialRating})
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">
                    Delivery Rating
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getRatingStars(vendor.deliveryRating)}
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">
                    ({vendor.deliveryRating})
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">
                    Overall Rating
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getRatingStars(vendor.overallRating)}
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">
                    ({vendor.overallRating})
                  </span>
                </div>
              </div>

              {vendor.suspensionReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Suspension Reason</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    {vendor.suspensionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Infinite scroll sentinel and status */}
        <div className="mt-6 text-center">
          {loading && (
            <div className="text-sm text-gray-500">Loading vendors...</div>
          )}
          {!loading && !hasMore && vendors.length > 0 && (
            <div className="text-sm text-gray-500">No more vendors</div>
          )}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search criteria or filters"
                : "No vendors match the selected criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetails && (
        <VendorDetails vendor={selectedVendor} onClose={handleCloseDetails} />
      )}

      {showRatingModal && (
        <RateVendorModal
          vendor={vendorToRate}
          onClose={handleCloseRatingModal}
          onSubmit={handleSubmitRating}
        />
      )}

      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Suspend Vendor
                </h2>
              </div>
              <button
                onClick={handleCloseSuspendModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  You are about to suspend{" "}
                  <span className="font-semibold">{vendorToSuspend?.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Please provide a reason for this action.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suspension Reason *
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Enter the reason for suspending this vendor..."
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseSuspendModal}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSuspend}
                disabled={!suspendReason.trim()}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Ban className="w-5 h-5" />
                Suspend Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnsuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Unsuspend Vendor
                </h2>
              </div>
              <button
                onClick={handleCloseUnsuspendModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  You are about to unsuspend{" "}
                  <span className="font-semibold">
                    {vendorToUnsuspend?.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Please provide notes for this action.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unsuspension Notes *
                </label>
                <textarea
                  value={unsuspendNotes}
                  onChange={(e) => setUnsuspendNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Enter notes for unsuspending this vendor..."
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseUnsuspendModal}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUnsuspend}
                disabled={!unsuspendNotes.trim()}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Unsuspend Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
