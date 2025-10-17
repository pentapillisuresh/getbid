import React, { useState } from "react";
import {
  X,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const QAPopup = ({ tender, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

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

  const qas = [
    {
      id: 1,
      question:
        "Is there any penalty clause for project delays? What are the acceptable reasons for extensions?",
      askedBy: storedUser.companyName || storedUser.name || "Your Company",
      date: "2024-01-25",
      status: "Pending",
      category: "Legal",
      type: "QA-004",
    },
    {
      id: 2,
      question:
        "What are the specific database requirements? Can we propose alternative database solutions?",
      answer:
        "The project requires PostgreSQL 12+ or MySQL 8+. Alternative solutions will be considered based on technical merit and cost-effectiveness.",
      askedBy: "DataSoft Solutions",
      answeredBy: "Procurement Team",
      date: "2024-01-24",
      answerDate: "2024-01-24",
      status: "Answered",
      category: "Technical",
      type: "QA-006",
    },
    {
      id: 3,
      question:
        "Are there any specific security compliance requirements for this project?",
      answer:
        "Yes, the project must comply with ISO 27001 standards and government data protection guidelines.",
      askedBy: "SecureIT Inc.",
      answeredBy: "Technical Team",
      date: "2024-01-23",
      answerDate: "2024-01-23",
      status: "Answered",
      category: "Security",
      type: "QA-005",
    },
    {
      id: 4,
      question:
        "What is the expected timeline for project completion and delivery?",
      answer:
        "The project should be completed within 6 months from the date of contract signing.",
      askedBy: "BuildCorp Ltd.",
      answeredBy: "Project Manager",
      date: "2024-01-22",
      answerDate: "2024-01-22",
      status: "Answered",
      category: "Timeline",
      type: "QA-003",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Answered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "Answered":
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
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const filteredQAs = qas.filter(
    (qa) =>
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {tender.title} •{" "}
              {tender.id ? `T2024-00${tender.id}` : "T2024-002"}
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
              Browse Q&A ({qas.length})
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
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>All Categories</option>
                  <option>Technical</option>
                  <option>Legal</option>
                  <option>Security</option>
                  <option>Timeline</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>Answered</option>
                  <option>Pending</option>
                </select>
              </div>

              {/* Q&A List */}
              <div className="space-y-4">
                {filteredQAs.map((qa, index) => (
                  <div
                    key={qa.id}
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
                          <span className="text-xs font-mono text-gray-500">
                            {qa.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {qa.date}
                          </span>
                        </div>
                      </div>
                      <span className={getStatusBadge(qa.status)}>
                        {qa.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {qa.question}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Asked by {qa.askedBy}
                      </p>
                    </div>

                    {qa.answer && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-yellow-700 font-medium">
                            Response from {qa.answeredBy}
                          </span>
                        </div>
                        <p className="text-gray-800">{qa.answer}</p>
                      </div>
                    )}

                    {qa.status === "Pending" && (
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
                        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          Share
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Select category</option>
                    <option>Technical</option>
                    <option>Legal</option>
                    <option>Security</option>
                    <option>Timeline</option>
                    <option>Financial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Type your question here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Be specific and clear in your question for better responses
                  </p>
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
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Submit Question
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
