import React, { useState, useEffect, useCallback, useRef } from "react";
import apiService from "../../../services/apiService";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  MessageCircle,
  Link,
  Award,
  Loader2,
} from "lucide-react";
import TenderFormModal from "../popup/TenderFormModal";
import TenderDetailsModal from "../popup/TenderDetailsModal";
import CancelTenderModal from "../popup/CancelTenderModal";
import api from "../../../services/apiService";
import {
  formatCurrency,
  formatDate,
  calculateDaysLeft,
  getTenderStatus,
  getPriorityLevel,
} from "../../../utils/tenderUtils";

const TenderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'amend'
  const [selectedTender, setSelectedTender] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // API state
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  // Stats state
  const [statsData, setStatsData] = useState({
    totalTenders: 0,
    activeTenders: 0,
    totalValue: 0,
    averageResponseRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Track initial load to prevent unnecessary API calls
  const isInitialLoad = useRef(true);

  // Get stored user ID from localStorage (robust to several id field names)
  const getStoredUserId = () => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const raw = window.localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed._id || parsed.id || parsed.userId || null;
    } catch (e) {
      return null;
    }
  };

  // Intersection Observer for infinite scroll
  const observer = useRef();
  const lastTenderElementRef = useCallback(
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

  // API functions
  const fetchTenders = async (page = 1, isNewSearch = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page,
        limit: 10,
      };

      // Add user ID as postedBy parameter
      const userId = getStoredUserId();
      if (userId) {
        queryParams.postedBy = userId;
      }

      // Add search parameter if available
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Add category filter if selected
      if (categoryFilter) {
        queryParams.category = categoryFilter;
      }

      // Add state filter if selected
      if (stateFilter) {
        queryParams.state = stateFilter;
      }

      // Add district filter if selected
      if (districtFilter) {
        queryParams.district = districtFilter;
      }

      // Add status filter if selected
      if (statusFilter) {
        queryParams.status = statusFilter;
      }

      const response = await api.get("/v1/tenders", {
        queryParams,
      });

      if (response.success) {
        const newTenders = response.data || [];

        if (isNewSearch || page === 1) {
          setTenders(newTenders);
        } else {
          setTenders((prev) => [...prev, ...newTenders]);
        }

        setTotalCount(response.totalCount || 0);
        setTotalPages(response.totalPages || 0);
        setHasMore(page < (response.totalPages || 0));
      }
    } catch (err) {
      console.error("Error fetching tenders:", err);
      setError("Failed to fetch tenders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get("/v1/tenders/stats");

      if (response.success) {
        setStatsData(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Keep default values on error
    } finally {
      setStatsLoading(false);
    }
  };

  // Map API data to component format
  const mapTenderData = (tender) => {
    const daysLeft = calculateDaysLeft(tender.bidDeadline);
    // const status = getTenderStatus(tender);

    // Debug logging
    console.log(
      "Original tender status:",
      tender.status,
      "Mapped status:",
      status,
      "Filter:",
      statusFilter
    );

    return {
      id: tender._id,
      tenderId: tender.tenderId,
      title: tender.title,
      department: tender.category, // Using category as department
      category: tender.category,
      estimatedValue: formatCurrency(tender.value),
      publishedDate: formatDate(tender.createdAt),
      submissionDeadline: formatDate(tender.bidDeadline),
      status: tender.status,
      bidsReceived: tender.bidsCount || 0,
      daysLeft: daysLeft,
      priority: getPriorityLevel(tender.value),
      description: tender.description,
      createdBy: tender.contactPerson || "System",
      clarifications: 0, // Not available in API
      preBidMeeting: !!tender.meetingDate,
      linkedAccount: false, // Not available in API
      awardedTo: "",
      // Additional fields from API
      eligibilityCriteria: tender.eligibilityCriteria || [],
      technicalSpecifications: tender.technicalSpecifications || "",
      documents: tender.documents || [],
      meetingDate: tender.meetingDate,
      meetingVenue: tender.meetingVenue,
      state: tender.state,
      district: tender.district,
      address: tender.address,
      contactNumber: tender.contactNumber,
      locationScope: tender.locationScope,
      isBidSubmitted: tender.isBidSubmitted || false,
      rawData: tender, // Keep original data for modal
    };
  };

  // Effects
  useEffect(() => {
    fetchTenders(1, true);
    fetchStats();
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      fetchTenders(currentPage);
    }
  }, [currentPage]);

  // Reset pagination when search term changes (with debounce)
  useEffect(() => {
    if (!isInitialLoad.current) {
      setCurrentPage(1);
      setTenders([]);
      setHasMore(true);

      const timeoutId = setTimeout(() => {
        fetchTenders(1, true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    if (!isInitialLoad.current) {
      setCurrentPage(1);
      setTenders([]);
      setHasMore(true);
      fetchTenders(1, true);
    }
  }, [categoryFilter, statusFilter, stateFilter, districtFilter]);

  const handleNewTender = (response) => {
    console.log("New Tender Created:", response);
    // Refresh the list and stats after successful creation
    fetchTenders(1, true);
    fetchStats();
  };

  const handleEditTender = (response) => {
    console.log("Tender Updated:", response);
    // Refresh the list and stats after successful update
    fetchTenders(1, true);
    fetchStats();
  };

  const handleAmendTender = (response) => {
    console.log("Tender Amended:", response);
    // Refresh the list and stats after successful amendment
    fetchTenders(1, true);
    fetchStats();
  };

  // API filter options
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: "All Categories" },
  ]);
  const [stateOptions, setStateOptions] = useState([
    { value: "", label: "All States" },
  ]);
  const [districtOptions, setDistrictOptions] = useState([
    { value: "", label: "All Districts" },
  ]);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // Fetch categories and states on mount
  useEffect(() => {
    apiService
      .get("/v1/common/categories")
      .then((data) => {
        setCategoryOptions([
          { value: "", label: "All Categories" },
          ...data.map((cat) => ({ value: cat, label: cat })),
        ]);
      })
      .catch(() =>
        setCategoryOptions([{ value: "", label: "All Categories" }])
      );
    apiService
      .get("/v1/common/states")
      .then((data) => {
        setStateOptions([
          { value: "", label: "All States" },
          ...data.map((state) => ({ value: state, label: state })),
        ]);
      })
      .catch(() => setStateOptions([{ value: "", label: "All States" }]));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (stateFilter) {
      setDistrictsLoading(true);
      apiService
        .get(`/v1/common/districts/${encodeURIComponent(stateFilter)}`)
        .then((data) => {
          setDistrictOptions([
            { value: "", label: "All Districts" },
            ...data.map((district) => ({ value: district, label: district })),
          ]);
          setDistrictsLoading(false);
        })
        .catch(() => {
          setDistrictOptions([{ value: "", label: "All Districts" }]);
          setDistrictsLoading(false);
        });
      setDistrictFilter("");
    } else {
      setDistrictOptions([{ value: "", label: "All Districts" }]);
      setDistrictFilter("");
    }
  }, [stateFilter]);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "in-progress", label: "In Progress" },
    { value: "technical-evaluation", label: "Technical Evaluated" },
    { value: "financial-evaluation", label: "Financial Evaluated" },
    { value: "completed", label: "Completed" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
      case "in-progress":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "evaluation":
      case "technical-evaluation":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "financial-evaluation":
      // return <IndianRupee className="w-5 h-5 text-purple-600" />;
      case "awarded":
      case "completed":
        return <Award className="w-5 h-5 text-purple-600" />;
      case "draft":
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "published":
      case "in-progress":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "evaluation":
      case "technical-evaluation":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "financial-evaluation":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "awarded":
      case "completed":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-orange-100 text-orange-800`;
    }
  };

  const mappedTenders = tenders.map(mapTenderData);

  const filteredTenders = mappedTenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Only client-side filtering for search since server-side filtering handles category and status
    return matchesSearch;
  });

  const stats = [
    {
      label: "Total Tenders",
      value: statsData.totalTenders.toString(),
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Active Tenders",
      value: statsData.activeTenders.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Total Value",
      value: `₹${(statsData.totalValue / 10000000).toFixed(1)}Cr`,
      icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
    },
    {
      label: "Avg Response Rate",
      value: `${statsData.averageResponseRate}%`,
      icon: <Users className="w-6 h-6 text-orange-600" />,
    },
  ];

  const handleViewDetails = (tender) => {
    setSelectedTender(tender);
    setShowDetails(true);
  };

  const handleEditTenderClick = (tender) => {
    setSelectedTender(tender);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAmendTenderClick = (tender) => {
    setSelectedTender(tender);
    setModalMode("amend");
    setShowModal(true);
  };

  const handleCreateTenderClick = () => {
    setSelectedTender(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTender(null);
    setModalMode("create");
  };

  const handleCancelTender = () => {
    setShowCancelModal(true);
    setShowDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tender Management
          </h1>
          <p className="text-gray-600">
            Create, manage, and track your tender publications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchTenders(1, true);
              fetchStats();
            }}
            disabled={loading || statsLoading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading || statsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            Refresh
          </button>
          <button
            onClick={handleCreateTenderClick}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Tender
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="min-w-[180px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* State Filter */}
            <div className="min-w-[180px]">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* District Filter */}
            <div className="min-w-[180px]">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={
                  !stateFilter ||
                  districtsLoading ||
                  districtOptions.length === 1
                }
              >
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {districtsLoading ? "Loading..." : option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Status Filter */}
            <div className="min-w-[180px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setCategoryFilter("");
                setStateFilter("");
                setDistrictFilter("");
                setStatusFilter("");
                setSearchTerm("");
              }}
              disabled={
                !categoryFilter &&
                !stateFilter &&
                !districtFilter &&
                !statusFilter &&
                !searchTerm
              }
              className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                categoryFilter ||
                stateFilter ||
                districtFilter ||
                statusFilter ||
                searchTerm
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50 bg-white"
                  : "text-gray-400 bg-gray-50 cursor-not-allowed"
              }`}
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Tender Cards */}
      <div className="space-y-4">
        {filteredTenders.map((tender, index) => {
          // Add ref to last element for infinite scroll
          const isLastElement = index === filteredTenders.length - 1;
          return (
            <div
              key={tender.id}
              ref={isLastElement ? lastTenderElementRef : null}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {getStatusIcon(tender.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tender.title}
                        </h3>
                        <span className={getStatusBadge(tender.status)}>
                          {tender.status === "in-progress"
                            ? "In Progress"
                            : tender.status === "technical-evaluation"
                            ? "Evaluation Completed"
                            : tender.status === "financial-evaluation"
                            ? "Completed"
                            : tender.status === "completed"
                            ? "Completed"
                            : tender.status === "evaluation"
                            ? "Evaluation"
                            : tender.status.charAt(0).toUpperCase() +
                              tender.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {tender.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        tender.daysLeft > 0 ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {tender.daysLeft > 0
                        ? `${tender.daysLeft} days left`
                        : `${Math.abs(tender.daysLeft)} days ago`}
                    </div>
                  </div>
                </div>

                {/* Description and ID */}
                <p className="text-gray-700 mb-3">{tender.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>ID: {tender.tenderId}</span>
                  <span>•</span>
                  <span>Est. Value: {tender.estimatedValue}</span>
                  <span>•</span>
                  <span>Bids: {tender.bidsReceived}</span>
                  <span>•</span>
                  <span>Published: {tender.publishedDate}</span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <div className="font-semibold text-gray-900">
                      {tender.submissionDeadline}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Clarifications:
                    </span>
                    <div className="font-semibold text-gray-900">
                      {tender.clarifications}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm text-gray-500">Created by:</span>
                    <div className="font-semibold text-gray-900">
                      {tender.createdBy}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {tender.preBidMeeting && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <MessageCircle className="w-4 h-4" />
                        Pre-bid meeting scheduled
                      </div>
                    )}
                    {tender.linkedAccount && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Link className="w-4 h-4" />
                        Linked to main account
                      </div>
                    )}
                    {tender.awardedTo && (
                      <div className="flex items-center gap-2 text-purple-600 text-sm">
                        <Award className="w-4 h-4" />
                        Awarded to {tender.awardedTo}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {tender.status === "cancelled" ? (
                      <>
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mr-2">
                          Cancelled
                        </span>
                        <button
                          onClick={() => handleViewDetails(tender)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleViewDetails(tender)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditTenderClick(tender)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>

                        {tender.status === "published" && (
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                            <MessageCircle className="w-4 h-4" />
                            Manage Q&A
                          </button>
                        )}
                        {(tender.status === "in-progress" ||
                          tender.status === "published") && (
                          <button
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                            onClick={async () => {
                              try {
                                const userId = getStoredUserId();
                                let email = "";
                                try {
                                  const raw =
                                    window.localStorage.getItem("user");
                                  if (raw) {
                                    const parsed = JSON.parse(raw);
                                    email =
                                      parsed.email || parsed.contact || "";
                                  }
                                } catch (e) {
                                  email = "";
                                }
                                await apiService.post("/auth/send-otp", {
                                  body: {
                                    type: "email",
                                    contact: email,
                                    userId: userId,
                                  },
                                });
                                setShowCancelModal(true);
                                setSelectedTender(tender);
                              } catch (err) {
                                alert(
                                  "Failed to send OTP: " +
                                    (err?.message || "Unknown error")
                                );
                              }
                            }}
                          >
                            <AlertTriangle className="w-4 h-4" />
                            Cancel Tender
                          </button>
                        )}
                      </>
                    )}
                    {/* {tender.status === "evaluation" && (
                      <>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                          Evaluate Bids
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                          Award Tender
                        </button>
                      </>
                    } */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading more tenders...</span>
            </div>
          </div>
        )}

        {/* No More Data Indicator */}
        {!hasMore && tenders.length > 0 && filteredTenders.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No more tenders to load</p>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading tenders
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => fetchTenders(1, true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTenders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tenders found
          </h3>
          <p className="text-gray-500 mb-4">No tenders available</p>
        </div>
      )}

      {/* Modals */}
      <TenderFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={
          modalMode === "create"
            ? handleNewTender
            : modalMode === "edit"
            ? handleEditTender
            : handleAmendTender
        }
        editMode={modalMode === "edit"}
        amendMode={modalMode === "amend"}
        tenderData={selectedTender}
        user={{ name: "Current User", type: "Client" }} // Replace with actual user data
      />

      <TenderDetailsModal
        show={showDetails}
        onClose={() => setShowDetails(false)}
        tender={selectedTender}
        onCancelTender={handleCancelTender}
      />

      <CancelTenderModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        tender={selectedTender}
        onCancelSuccess={() => fetchTenders(1, true)}
      />
    </div>
  );
};

export default TenderManagement;
