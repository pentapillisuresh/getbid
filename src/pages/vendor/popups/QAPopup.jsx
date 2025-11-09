import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Paperclip,
  Download,
} from "lucide-react";
import clarificationsService from "../../../services/clarificationsService";
import toastService from "../../../services/toastService";

const QAPopup = ({ tender, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Public clarifications state
  const [clarifications, setClarifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Form state for asking questions
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    priority: "medium",
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // try to get current vendor name
  let storedUser = {};
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem("user");
      if (raw) storedUser = JSON.parse(raw) || {};
    }
  } catch (e) {
    storedUser = {};
  }

  // Fetch public clarifications for this tender
  useEffect(() => {
    if (tender?._id || tender?.id) {
      fetchPublicClarifications();
    }
  }, [tender, searchQuery, categoryFilter, statusFilter]);

  const fetchPublicClarifications = async () => {
    setLoading(true);
    try {
      const params = {
        tender: tender._id || tender.id,
        isPublic: true,
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await clarificationsService.getClarifications(
        tender._id || tender.id,
        params
      );

      if (response?.data) {
        setClarifications(response.data);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching public clarifications:", error);
      toastService.showError("Failed to load clarifications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status === "pending" ? "pending" : status;
    switch (normalizedStatus) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "answered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status === "pending" ? "pending" : status;
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (normalizedStatus) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "answered":
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Legal: "bg-purple-100 text-purple-700",
      Technical: "bg-blue-100 text-blue-700",
      Security: "bg-red-100 text-red-700",
      Timeline: "bg-green-100 text-green-700",
      Commercial: "bg-orange-100 text-orange-700",
      Financial: "bg-yellow-100 text-yellow-700",
      Environmental: "bg-teal-100 text-teal-700",
      Logistics: "bg-indigo-100 text-indigo-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit question
  const handleSubmitQuestion = async () => {
    // Validation
    if (!formData.category) {
      toastService.showError("Please select a category");
      return;
    }
    if (!formData.question.trim()) {
      toastService.showError("Please enter your question");
      return;
    }

    setIsSubmitting(true);
    try {
      const questionData = {
        tender: tender._id || tender.id,
        category: formData.category,
        question: formData.question,
        priority: formData.priority,
        isPublic: formData.isPublic,
      };

      const response = await clarificationsService.postQuestion(questionData);

      toastService.showSuccess("Question submitted successfully!");

      // Reset form
      setFormData({
        category: "",
        question: "",
        priority: "medium",
        isPublic: false,
      });

      // Switch to browse tab
      setActiveTab("browse");

      // Refresh the clarifications list
      fetchPublicClarifications();
    } catch (error) {
      console.error("Error submitting question:", error);
      toastService.showError(
        error?.message || "Failed to submit question. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(tender);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Q&A - Clarifications
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {tender.title} • {tender?.raw?.tenderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "browse"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Q&A ({totalCount})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("ask")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "ask"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Ask Question
            </div>
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "browse" && (
            <>
              {/* Search and Filters */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions and answers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Financial">Financial</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Legal">Legal</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="answered">Answered</option>
                </select>
              </div>

              {/* Q&A List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading clarifications...
                    </span>
                  </div>
                ) : clarifications.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No clarifications yet
                    </h3>
                    <p className="text-gray-500">
                      Be the first to ask a question about this tender
                    </p>
                  </div>
                ) : (
                  clarifications.map((qa, index) => (
                    <div
                      key={qa._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(qa.status)}
                            <span className="text-sm font-mono text-gray-500">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                qa.category
                              )}`}
                            >
                              {qa.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(qa.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={getStatusBadge(qa.status)}>
                          {qa.status.charAt(0).toUpperCase() +
                            qa.status.slice(1)}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {qa.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Asked by {qa.user?.name || "Unknown"}
                        </p>
                      </div>

                      {qa.answer && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-green-700 font-medium">
                              Response from{" "}
                              {qa.answeredBy?.name || "Procurement Team"}
                            </span>
                            {qa.answeredAt && (
                              <span className="text-xs text-green-600">
                                {new Date(qa.answeredAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-green-800 mb-3">{qa.answer}</p>

                          {qa.attachments && qa.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-green-300">
                              <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                                <Paperclip className="w-4 h-4" />
                                <span className="font-medium">
                                  Attachments:
                                </span>
                              </div>
                              <div className="space-y-2">
                                {qa.attachments.map((file) => (
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
                        </div>
                      )}

                      {qa.status === "pending" && !qa.answer && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-700 font-medium">
                              Waiting for response from procurement team
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <User className="w-3 h-3" />
                            <span className="capitalize">
                              {qa.priority} Priority
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{qa.tender?.tenderId || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "ask" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ask a Question
                </h3>
                <p className="text-gray-600">
                  Ask clarifications about this tender. Questions are public and
                  responses will be visible to all vendors.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Technical">Technical</option>
                    <option value="Legal">Legal</option>
                    <option value="Security">Security</option>
                    <option value="Timeline">Timeline</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    value={formData.question}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Type your question here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Be specific and clear in your question for better responses
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this question public
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Question Guidelines
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Questions should be related to tender specifications
                    </li>
                    <li>• Avoid asking about proprietary information</li>
                    <li>• Response time is typically 2-3 business days</li>
                    <li>• All questions and answers are public</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setFormData({
                        category: "",
                        question: "",
                        priority: "medium",
                        isPublic: false,
                      });
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuestion}
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Question"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAPopup;
