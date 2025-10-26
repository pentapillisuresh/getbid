import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Building,
  Search,
  ChevronDown,
  Download,
  Heart,
} from "lucide-react";
import api from "../../services/apiService";
import ViewDetailsPopup from "../../components/shared/ViewDetailsPopup";
import Header from "./Header";
import Footer from "./Footer";

const TendersSection = ({ isStandalone = false }) => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTender, setSelectedTender] = useState(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    sortBy: "deadline",
  });

  // Categories for dropdown
  const categories = [
    "All Categories",
    "Construction",
    "IT Services",
    "Consulting",
    "Supply",
    "Transportation",
    "Healthcare",
    "Education",
    "Infrastructure",
  ];

  // Locations for dropdown
  const locations = [
    "All Locations",
    "Mumbai, Maharashtra",
    "New Delhi",
    "Bangalore, Karnataka",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Pune, Maharashtra",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
  ];

  // Sort options
  const sortOptions = [
    { value: "deadline", label: "Deadline (Earliest)" },
    { value: "value", label: "Estimated Value" },
    { value: "published", label: "Recently Published" },
  ];

  useEffect(() => {
    fetchPublicTenders(1, true);
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (page === 1) {
      fetchPublicTenders(1, true);
    }
  }, [filters]);

  // Handle infinite scroll
  useEffect(() => {
    if (!isStandalone) return; // Only for standalone mode

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        fetchPublicTenders(page + 1, false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isStandalone, hasMore, loading, loadingMore, page]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setHasMore(true);
  };

  const fetchPublicTenders = async (pageNum = 1, resetData = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.category &&
          filters.category !== "All Categories" && {
            category: filters.category,
          }),
        ...(filters.location &&
          filters.location !== "All Locations" && {
            location: filters.location,
          }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      };

      const response = await api.get("/v1/tenders/public", {
        queryParams: params,
        headers: {
          // Override to exclude auth header for public endpoint
          "Content-Type": "application/json",
        },
        getAuthToken: () => null, // Explicitly no auth token
      });

      if (response?.data) {
        const newTenders = response.data || [];

        if (resetData || pageNum === 1) {
          setTenders(newTenders);
        } else {
          setTenders((prev) => [...prev, ...newTenders]);
        }

        // Check if we have more data to load
        setHasMore(newTenders.length === 10);
        setPage(pageNum);
      } else {
        throw new Error("Failed to fetch tenders");
      }
    } catch (err) {
      console.error("Error fetching tenders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closing soon":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (tender) => {
    setSelectedTender(tender);
    setIsViewDetailsOpen(true);
  };

  const handleCloseViewDetails = () => {
    setIsViewDetailsOpen(false);
    setSelectedTender(null);
  };

  const handleChooseLoginType = () => {
    navigate("/choose-login-type");
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Tenders
            </h2>
            <p className="text-lg text-gray-600">
              Discover new business opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Tenders
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">
                Unable to load tenders at the moment. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header for standalone mode */}
      {isStandalone && <Header />}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse Available Tenders
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Discover opportunities from government and private organizations.
            Find the perfect tender for your business.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      {isStandalone && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, organization, or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Location Dropdown */}
              <div className="relative">
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {(isStandalone ? tenders : tenders.slice(0, 3)).length} of{" "}
              {tenders.length} tenders
            </p>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div
        className={`max-w-7xl mx-auto px-4 ${isStandalone ? "pb-16" : "py-16"}`}
      >
        {!isStandalone && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Tenders
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover new business opportunities from government and private
              organizations. Browse active tenders and submit your bids to grow
              your business.
            </p>
          </div>
        )}

        {/* Tenders Grid */}
        {tenders.length > 0 ? (
          <div className="space-y-6">
            {(isStandalone ? tenders : tenders.slice(0, 3)).map(
              (tender, index) => (
                <div
                  key={tender._id || index}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            tender.status || "Open"
                          )}`}
                        >
                          {tender.status || "Open"}
                        </span>
                      </div>
                      {/* <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" /> */}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {tender.title || "Highway Construction Project Phase II"}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {tender.description ||
                        "Construction of 50km highway section including bridges, overpasses, and drainage systems. The project involves modern road construction techniques, quality materials, and adherence to environmental standards."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Organization</p>
                        <p className="font-medium text-gray-900">
                          {tender.organization || "Department of Public Works"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">
                          {tender.category || "Construction"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Value</p>
                        <p className="font-medium text-green-600">
                          {formatCurrency(
                            tender.value || tender.estimatedValue || 8550000
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deadline</p>
                        <p className="font-medium text-red-600">
                          {formatDate(
                            tender.bidDeadline ||
                              tender.deadline ||
                              "2024-02-15"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          📍{" "}
                          {tender.location ||
                            (tender.district && tender.state
                              ? `${tender.district}, ${tender.state}`
                              : "Mumbai, Maharashtra")}
                        </span>
                        <span>
                          📅 Published:{" "}
                          {formatDate(
                            tender.createdAt ||
                              tender.publishedDate ||
                              "2024-01-05"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(tender)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4" />
                          Download Documents
                        </button> */}
                        <button
                          onClick={handleChooseLoginType}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Submit Bid
                        </button>
                        {/* <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Save
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">
                Unable to load tenders at the moment. Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Tenders Available
            </h3>
            <p className="text-gray-600">
              Check back later for new tender opportunities.
            </p>
          </div>
        )}

        {/* Loading more indicator for infinite scroll */}
        {isStandalone && loadingMore && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading more tenders...</p>
          </div>
        )}

        {/* End of list message for infinite scroll */}
        {isStandalone && !hasMore && tenders.length > 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 font-medium">No more tenders to show</p>
            <p className="text-sm text-gray-500 mt-1">
              You've reached the end of the list
            </p>
          </div>
        )}

        {/* View All Button - only show when not standalone */}
        {tenders.length > 0 && !isStandalone && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/browse-tenders")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Tenders
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer for standalone mode */}
      {isStandalone && <Footer />}

      {/* View Details Popup */}
      <ViewDetailsPopup
        tender={selectedTender}
        isOpen={isViewDetailsOpen}
        onClose={handleCloseViewDetails}
      />
    </div>
  );
};

export default TendersSection;
