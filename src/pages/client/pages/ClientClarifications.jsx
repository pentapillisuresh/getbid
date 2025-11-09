import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  ChevronDown,
  X,
  Paperclip,
  Download,
} from "lucide-react";
import clarificationsService from "../../../services/clarificationsService";
import toastService from "../../../services/toastService";
import ResponseModal from "../popup/ResponseModal";

const ClientClarifications = () => {
  const [clarifications, setClarifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Response Modal
  const [selectedClarification, setSelectedClarification] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Ref for infinite scroll observer
  const observer = useRef();
  const lastClarificationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch clarifications
  const fetchClarifications = async (pageNum, isNewSearch = false) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await clarificationsService.getClientClarifications(
        params
      );

      if (response?.data) {
        if (isNewSearch) {
          setClarifications(response.data);
        } else {
          setClarifications((prev) => [...prev, ...response.data]);
        }
        setTotalCount(response.totalCount || 0);
        setHasMore(response.currentPage < response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching clarifications:", error);
      toastService.showError("Failed to load clarifications");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchClarifications(1, true);
    setPage(1);
  }, [searchTerm, categoryFilter, priorityFilter, statusFilter]);

  // Load more on page change
  useEffect(() => {
    if (page > 1) {
      fetchClarifications(page);
    }
  }, [page]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "answered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "closed":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "answered":
        return `${baseClasses} bg-green-100 text-green-600`;
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case "closed":
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-600`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses =
      "inline-block px-2 py-1 rounded-full text-xs font-medium";

    switch (priority) {
      case "urgent":
        return `${baseClasses} bg-red-100 text-red-600`;
      case "high":
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case "low":
        return `${baseClasses} bg-blue-100 text-blue-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  const handleOpenResponseModal = (clarification) => {
    setSelectedClarification(clarification);
    setShowResponseModal(true);
  };

  const handleCloseResponseModal = () => {
    setSelectedClarification(null);
    setShowResponseModal(false);
  };

  const handleSubmitResponse = async (clarificationId, answerData) => {
    try {
      await clarificationsService.answerClarification(
        clarificationId,
        answerData
      );

      toastService.showSuccess("Response submitted successfully!");

      // Update the clarification in the list
      setClarifications((prev) =>
        prev.map((item) =>
          item._id === clarificationId
            ? { ...item, answer: answerData.answer, status: "answered" }
            : item
        )
      );

      handleCloseResponseModal();
    } catch (error) {
      console.error("Error submitting response:", error);
      toastService.showError(
        error?.message || "Failed to submit response. Please try again."
      );
      throw error; // Re-throw to prevent modal from closing
    }
  };

  const activeFiltersCount = [
    searchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tender Clarifications
          </h1>
          <p className="text-gray-600">
            View and respond to vendor questions about your tenders
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, tenders, or vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              activeFiltersCount > 0
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Financial">Financial</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Legal">Legal</option>
                  <option value="Security">Security</option>
                  <option value="Timeline">Timeline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="answered">Answered</option>
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clarifications List */}
      <div className="space-y-4">
        {clarifications.map((item, index) => {
          const isLast = index === clarifications.length - 1;
          return (
            <div
              key={item._id}
              ref={isLast ? lastClarificationRef : null}
              className="card border-l-4 border-primary-500 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-full bg-gray-50">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {item.tender?.title || "N/A"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {item.tender?.tenderId || "N/A"}
                      </span>
                      <span className={getPriorityBadge(item.priority)}>
                        {item.priority}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                      {item.isPublic && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                          Public
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Question from Vendor:
                      </h4>
                      <p className="text-gray-800">{item.question}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.user?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.answer && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Your Answer:
                        </h4>
                        <p className="text-green-700 mb-3">{item.answer}</p>

                        {/* Attachments */}
                        {item.attachments && item.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-300">
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="w-4 h-4 text-green-700" />
                              <span className="text-sm font-medium text-green-800">
                                Attachments ({item.attachments.length})
                              </span>
                            </div>
                            <div className="space-y-2">
                              {item.attachments.map((attachment, idx) => (
                                <a
                                  key={idx}
                                  href={attachment.url}
                                  download={attachment.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 bg-white rounded border border-green-200 hover:border-green-400 hover:bg-green-100 transition-colors group"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Paperclip className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm text-green-800 truncate">
                                      {attachment.fileName}
                                    </span>
                                  </div>
                                  <Download className="w-4 h-4 text-green-600 group-hover:text-green-700 flex-shrink-0 ml-2" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.updatedAt && item.answer && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mt-3">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Answered on{" "}
                              {new Date(item.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {item.status === "pending" && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-800">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Awaiting Response
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          This question requires your attention. Please provide
                          a response to help the vendor.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className={getStatusBadge(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Vendor: {item.user?.email || "N/A"}</span>
                  {item.user?.phoneNumber && (
                    <>
                      <span>•</span>
                      <span>{item.user.phoneNumber}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "pending" && (
                    <button
                      onClick={() => handleOpenResponseModal(item)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Respond
                    </button>
                  )}
                  {item.status === "answered" && (
                    <button
                      onClick={() => handleOpenResponseModal(item)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit Response
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Loading clarifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && clarifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No clarifications found
            </h3>
            <p className="text-gray-500">
              {activeFiltersCount > 0
                ? "Try adjusting your filters"
                : "No vendors have asked questions yet"}
            </p>
          </div>
        )}

        {/* End of list message */}
        {!loading && !hasMore && clarifications.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              You've reached the end of the list
            </p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedClarification && (
        <ResponseModal
          clarification={selectedClarification}
          onClose={handleCloseResponseModal}
          onSubmit={handleSubmitResponse}
        />
      )}
    </div>
  );
};

export default ClientClarifications;
