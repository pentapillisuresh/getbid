import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import VendorDetails from "../popup/VendorDetails";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";

const VendorManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const tabs = [
    { id: "all", label: "All Vendors", count: 248 },
    { id: "verified", label: "Verified", count: 186 },
    { id: "pending", label: "Pending Verification", count: 42 },
    { id: "blacklisted", label: "Blacklisted", count: 3 },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "construction", label: "Construction" },
    { value: "it", label: "IT Services" },
    { value: "healthcare", label: "Healthcare" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "supply", label: "Supply & Logistics" },
  ];

  // remote vendors state (from /v1/users?role=vendor)
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

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
    totalProjects: item.totalProjects || 0,
    company: item.company || {},
    raw: item,
  });

  const fetchVendors = useCallback(
    async (p = 1, replace = false) => {
      setLoading(true);
      try {
        const resp = await api.get("/v1/users", {
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

  if (showDetails && selectedVendor) {
    return (
      <VendorDetails vendor={selectedVendor} onClose={handleCloseDetails} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getStatusIcon(vendor.status)}
                    </div>
                    {vendor.status === "verified" && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium">
                        Verified
                      </span>
                    )}
                    {vendor.status === "suspended" && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium">
                        Suspended
                      </span>
                    )}
                    {vendor.status === "pending" && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {vendor.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Contact Person
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {vendor.contactPerson}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Category</span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {vendor.category}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Experience</span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {vendor.experience}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-gray-600">
                              ID: {vendor.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                        <div className="text-sm text-gray-500">
                          Success Rate
                        </div>
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
                        <div className="text-xs text-gray-500 mb-1">
                          Technical Rating
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {getRatingStars(vendor.technicalRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.technicalRating})
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Financial Rating
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {getRatingStars(vendor.financialRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.financialRating})
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Delivery Rating
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {getRatingStars(vendor.deliveryRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.deliveryRating})
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Overall Rating
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {getRatingStars(vendor.overallRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.overallRating})
                          </span>
                        </div>
                      </div>
                    </div>

                    {vendor.suspensionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewDetails(vendor)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {vendor.status === "suspended" && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      Activate
                    </button>
                  )}
                  {vendor.status === "verified" && (
                    <>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                        Suspend
                      </button>
                      <button className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Send Message
                      </button>
                    </>
                  )}
                </div>
              </div>
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
    </div>
  );
};

export default VendorManagement;
