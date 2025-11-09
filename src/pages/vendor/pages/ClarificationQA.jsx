import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Send,
  Eye,
  Paperclip,
  Download,
  ChevronDown,
  X,
} from "lucide-react";
import tenderApiService from "../../../services/tenderApiService";
import clarificationsService from "../../../services/clarificationsService";
import toastService from "../../../services/toastService";

const ClarificationQA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [loadingTenders, setLoadingTenders] = useState(false);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Clarifications state
  const [clarifications, setClarifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Stats state
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answered: 0,
    pending: 0,
    responseRate: 0,
  });

  // Form state for new question
  const [questionForm, setQuestionForm] = useState({
    tender: "",
    category: "Technical",
    priority: "medium",
    question: "",
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fetch tender names on component mount
  useEffect(() => {
    fetchTenderNames();
    fetchVendorStats();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const fetchTenderNames = async () => {
    setLoadingTenders(true);
    try {
      const response = await tenderApiService.getTenderNames();
      if (response?.data) {
        setTenders(response.data);
      }
    } catch (error) {
      console.error("Error fetching tender names:", error);
      toastService.showError("Failed to load tenders");
    } finally {
      setLoadingTenders(false);
    }
  };

  const fetchVendorStats = async () => {
    try {
      const response = await clarificationsService.getVendorStats();
      if (response?.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
      // Don't show error toast for stats, just keep default values
    }
  };

  // Handle form input change
  const handleQuestionFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit new question
  const handleSubmitQuestion = async () => {
    // Validation
    if (!questionForm.tender) {
      toastService.showError("Please select a tender");
      return;
    }
    if (!questionForm.category) {
      toastService.showError("Please select a category");
      return;
    }
    if (!questionForm.question.trim()) {
      toastService.showError("Please enter your question");
      return;
    }

    setIsSubmitting(true);
    try {
      const questionData = {
        tender: questionForm.tender,
        category: questionForm.category,
        question: questionForm.question,
        priority: questionForm.priority,
        isPublic: questionForm.isPublic,
      };

      await clarificationsService.postQuestion(questionData);

      toastService.showSuccess("Question submitted successfully!");

      // Reset form
      setQuestionForm({
        tender: "",
        category: "Technical",
        priority: "medium",
        question: "",
        isPublic: true,
      });

      // Close modal
      setShowNewQuestion(false);

      // Refresh stats after submitting a question
      fetchVendorStats();
    } catch (error) {
      console.error("Error submitting question:", error);
      toastService.showError(
        error?.message || "Failed to submit question. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch clarifications
  const fetchClarifications = async (pageNum, isNewSearch = false) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
      };

      // Add filters to params if they are set
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      if (priorityFilter) {
        params.priority = priorityFilter;
      }
      if (statusFilter) {
        params.status = statusFilter;
      }
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      const response = await clarificationsService.getUserClarifications(
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

  // Initial load and on filter changes
  useEffect(() => {
    fetchClarifications(1, true);
    setPage(1);
  }, [categoryFilter, priorityFilter, statusFilter, debouncedSearchTerm]);

  // Load more on page change
  useEffect(() => {
    if (page > 1) {
      fetchClarifications(page);
    }
  }, [page]);

  const getStatusIcon = (status) => {
    const normalizedStatus = status === "pending" ? "open" : status;
    switch (normalizedStatus) {
      case "answered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "open":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "closed":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status === "pending" ? "open" : status;
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (normalizedStatus) {
      case "answered":
        return `${baseClasses} bg-green-100 text-green-600`;
      case "open":
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
        return `${baseClasses} bg-orange-100 text-orange-600 border-orange-600`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case "low":
        return `${baseClasses} bg-blue-100 text-blue-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  // Since filtering is now done server-side via API, we use clarifications directly
  const filteredClarifications = clarifications;

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  const activeFiltersCount = [
    debouncedSearchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
  ].filter(Boolean).length;

  const statsData = [
    {
      label: "Total Questions",
      value: stats.totalQuestions.toString(),
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Answered",
      value: stats.answered.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Clarifications & Q&A
          </h1>
          <p className="text-gray-600">
            Ask questions and get clarifications from tender authorities
          </p>
        </div>
        <button
          onClick={() => setShowNewQuestion(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="card">
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
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

      {/* New Question Modal */}
      {showNewQuestion && (
        <div
          style={{ marginTop: "0px" }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">
                Ask New Question
              </h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tender <span className="text-red-500">*</span>
                </label>
                <select
                  name="tender"
                  value={questionForm.tender}
                  onChange={handleQuestionFormChange}
                  disabled={loadingTenders}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingTenders ? "Loading tenders..." : "Select a tender"}
                  </option>
                  {tenders.map((tender) => (
                    <option key={tender._id} value={tender._id}>
                      {tender.tenderId} - {tender.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={questionForm.category}
                  onChange={handleQuestionFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Technical">Technical</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Financial">Financial</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={questionForm.priority}
                  onChange={handleQuestionFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="question"
                  value={questionForm.question}
                  onChange={handleQuestionFormChange}
                  rows="4"
                  placeholder="Enter your question here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={questionForm.isPublic}
                  onChange={handleQuestionFormChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this question public
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4 flex-shrink-0">
              <button
                onClick={() => {
                  setShowNewQuestion(false);
                  setQuestionForm({
                    tender: "",
                    category: "Technical",
                    priority: "medium",
                    question: "",
                    isPublic: true,
                  });
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredClarifications.map((item, index) => (
          <div
            key={item._id}
            ref={
              index === filteredClarifications.length - 1
                ? lastClarificationRef
                : null
            }
            className="card border-l-4 border-primary-500 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-full bg-gray-50">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {item.tender?.title || "N/A"}
                    </h3>
                    <span className={getPriorityBadge(item.priority)}>
                      {item.priority}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Question:
                    </h4>
                    <p className="text-gray-800">{item.question}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Asked on {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.answer && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Answer:
                      </h4>
                      <p className="text-green-700 mb-3">{item.answer}</p>

                      {item.attachments && item.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                            <Paperclip className="w-4 h-4" />
                            <span className="font-medium">Attachments:</span>
                          </div>
                          <div className="space-y-2">
                            {item.attachments.map((file) => (
                              <a
                                key={file._id}
                                href={file.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline"
                              >
                                <Download className="w-4 h-4" />
                                <span>{file.fileName}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-green-600 mt-3">
                        {item.answeredBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{item.answeredBy.name || "N/A"}</span>
                          </div>
                        )}
                        {item.answeredAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Answered on{" "}
                              {new Date(item.answeredAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(item.status === "open" || item.status === "pending") &&
                    !item.answer && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-orange-800">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Awaiting Response
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          Your question has been forwarded to the relevant
                          authority. You will be notified once a response is
                          available.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              <div className="text-right">
                <span className={getStatusBadge(item.status)}>
                  {(item.status === "pending" ? "open" : item.status)
                    .charAt(0)
                    .toUpperCase() +
                    (item.status === "pending" ? "open" : item.status).slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  <Eye className="w-4 h-4" />
                  View Full Discussion
                </button>
              </div>

              <div className="flex items-center gap-2">
                {(item.status === "open" || item.status === "pending") && (
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Follow Up
                  </button>
                )}
                {item.status === "answered" && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Mark as Helpful
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">
              Loading clarifications...
            </span>
          </div>
        )}

        {/* End of List */}
        {!hasMore && clarifications.length > 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              No more clarifications to load
            </p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && filteredClarifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "You haven't asked any questions yet"}
          </p>
          <button
            onClick={() => setShowNewQuestion(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ask Your First Question
          </button>
        </div>
      )}
    </div>
  );
};

export default ClarificationQA;
