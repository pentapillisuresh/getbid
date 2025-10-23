import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
  const fetchTenders = useCallback(
    async (page = 1, isNewSearch = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams = {
          page,
          limit: 10,
        };

        // Add search parameter if available
        if (searchTerm) {
          queryParams.search = searchTerm;
        }

        // Add status filter if not "all"
        if (activeTab !== "all") {
          queryParams.status = activeTab;
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
    },
    [loading, searchTerm, activeTab]
  );

  // Map API data to component format
  const mapTenderData = (tender) => {
    const daysLeft = calculateDaysLeft(tender.bidDeadline);
    const status = getTenderStatus(tender);

    return {
      id: tender._id,
      tenderId: tender.tenderId,
      title: tender.title,
      department: tender.category, // Using category as department
      category: tender.category,
      estimatedValue: formatCurrency(tender.value),
      publishedDate: formatDate(tender.createdAt),
      submissionDeadline: formatDate(tender.bidDeadline),
      status: status,
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
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      fetchTenders(currentPage);
    }
  }, [currentPage, fetchTenders]);

  // Reset pagination and fetch new data when search term changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
      setTenders([]);
      setHasMore(true);
      // Add debounced search here if needed
      const timeoutId = setTimeout(() => {
        fetchTenders(1, true);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      fetchTenders(1, true);
    }
  }, [searchTerm]);

  // Reset pagination when active tab changes
  useEffect(() => {
    setCurrentPage(1);
    setTenders([]);
    setHasMore(true);
    fetchTenders(1, true);
  }, [activeTab]);

  const handleNewTender = (response) => {
    console.log("New Tender Created:", response);
    // Refresh the list after successful creation
    fetchTenders(1, true);
  };

  const handleEditTender = (response) => {
    console.log("Tender Updated:", response);
    // Refresh the list after successful update
    fetchTenders(1, true);
  };

  const handleAmendTender = (response) => {
    console.log("Tender Amended:", response);
    // Refresh the list after successful amendment
    fetchTenders(1, true);
  };

  const tabs = [
    { id: "all", label: "All Tenders", count: totalCount },
    { id: "draft", label: "Draft", count: 0 },
    { id: "published", label: "Published", count: totalCount },
    { id: "evaluation", label: "Under Evaluation", count: 0 },
    { id: "awarded", label: "Awarded", count: 0 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "evaluation":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "awarded":
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
        return `${baseClasses} bg-green-100 text-green-800`;
      case "evaluation":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "awarded":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-orange-100 text-orange-800`;
    }
  };

  const mappedTenders = tenders.map(mapTenderData);

  const filteredTenders = mappedTenders.filter((tender) => {
    const matchesTab = activeTab === "all" || tender.status === activeTab;
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalValue = tenders.reduce(
    (sum, tender) => sum + (tender.value || 0),
    0
  );
  const activeTenders = tenders.filter((tender) => tender.isActive).length;

  const stats = [
    {
      label: "Total Tenders",
      value: totalCount.toString(),
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Active Tenders",
      value: activeTenders.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Total Value",
      value: `₹${(totalValue / 10000000).toFixed(1)}Cr`,
      icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
    },
    {
      label: "Avg Response Rate",
      value: "78%",
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
            onClick={() => fetchTenders(1, true)}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? (
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
        <div className="flex items-center gap-4">
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
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
                          {tender.status === "evaluation"
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
                      <>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                          <MessageCircle className="w-4 h-4" />
                          Manage Q&A
                        </button>
                        <button
                          onClick={() => handleAmendTenderClick(tender)}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Amend Tender
                        </button>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                          Start Evaluation
                        </button>
                      </>
                    )}

                    {tender.status === "evaluation" && (
                      <>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                          Evaluate Bids
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                          Award Tender
                        </button>
                      </>
                    )}
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
        {!hasMore && tenders.length > 0 && (
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
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria"
              : activeTab === "all"
              ? "You haven't created any tenders yet"
              : `No tenders found in ${tabs
                  .find((t) => t.id === activeTab)
                  ?.label.toLowerCase()} status`}
          </p>
          <button
            onClick={handleCreateTenderClick}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Tender
          </button>
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
      />
    </div>
  );
};

export default TenderManagement;
