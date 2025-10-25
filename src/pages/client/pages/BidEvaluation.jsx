import React, { useState, useEffect } from "react";
import { FileText, Award, CheckCircle } from "lucide-react";
import EvaluationModal from "../popup/EvaluationModal";
import TechnicalReportModal from "../popup/TechnicalReportModal";
import FinancialReportModal from "../popup/FinancialReportModal";
import { getMyTenders } from "../../../services/tenderApiService";
import { bidsService } from "../../../services/bidsService";
import toast from "../../../services/toastService";

const BidEvaluation = () => {
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [technicalModalOpen, setTechnicalModalOpen] = useState(false);
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [evaluationType, setEvaluationType] = useState("technical");
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [bidStats, setBidStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    approvedBids: 0,
    disqualifiedBids: 0,
    awardedBids: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch tenders from API
  const fetchTenders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTenders({ page, limit });

      if (response.success) {
        setTenders(response.data);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      }
    } catch (error) {
      console.error("Error fetching tenders:", error);
      setError("Failed to load tenders. Please try again.");
      toast.showError("Failed to load tenders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bid statistics from API
  const fetchBidStats = async () => {
    try {
      setStatsLoading(true);
      const response = await bidsService.getBidStats();

      if (response.success) {
        setBidStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching bid stats:", error);
      toast.showError("Failed to load bid statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
    fetchBidStats();
  }, []);

  // Helper function to get tender status based on tender status field
  const getTenderStatus = (tender) => {
    const { status } = tender;

    switch (status) {
      case "technical-evaluation":
        return {
          status: "Technical Evaluation",
          color: "bg-orange-100 text-orange-700",
        };
      case "financial-evaluation":
        return {
          status: "Financial Evaluation",
          color: "bg-blue-100 text-blue-700",
        };
      case "completed":
        return { status: "Completed", color: "bg-green-100 text-green-700" };
      default:
        return { status: "Open", color: "bg-gray-100 text-gray-700" };
    }
  };

  // Helper function to get technical and financial status based on tender status
  const getEvaluationStatus = (tender) => {
    const { status } = tender;

    let technicalStatus = "pending";
    let financialStatus = "pending";

    // Check tender status for evaluation phases
    if (status === "technical-evaluation") {
      technicalStatus = "completed";
      financialStatus = "pending";
    } else if (status === "financial-evaluation") {
      technicalStatus = "completed";
      financialStatus = "completed";
    } else if (status === "completed") {
      technicalStatus = "completed";
      financialStatus = "completed";
    }

    return { technicalStatus, financialStatus };
  };

  // Get stats from API data
  const getStats = () => {
    return [
      {
        label: "Total Bids",
        value: bidStats.totalBids.toString(),
        icon: <FileText className="w-6 h-6 text-blue-600" />,
        bgColor: "bg-blue-50",
      },
      {
        label: "Pending Bids",
        value: bidStats.pendingBids.toString(),
        icon: <FileText className="w-6 h-6 text-orange-600" />,
        bgColor: "bg-orange-50",
      },
      {
        label: "Approved Bids",
        value: bidStats.approvedBids.toString(),
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        bgColor: "bg-green-50",
      },
      {
        label: "Disqualified Bids",
        value: bidStats.disqualifiedBids.toString(),
        icon: (
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        bgColor: "bg-red-50",
      },
      {
        label: "Awarded Bids",
        value: bidStats.awardedBids.toString(),
        icon: <Award className="w-6 h-6 text-purple-600" />,
        bgColor: "bg-purple-50",
      },
    ];
  };

  const stats = getStats();

  // Filter tenders based on selected filter
  const getFilteredTenders = () => {
    if (filter === "all") return tenders;

    return tenders.filter((tender) => {
      const { status } = tender;

      switch (filter) {
        case "technical":
          return status === "technical-evaluation";
        case "financial":
          return status === "financial-evaluation";
        case "completed":
          return status === "completed";
        case "pending":
          return !status || status === "open" || status === "published";
        default:
          return true;
      }
    });
  };

  const filteredTenders = getFilteredTenders();

  const handleEvaluateBids = (tender, type = "technical") => {
    setCurrentEvaluation(tender);
    setEvaluationType(type);
    setEvaluationModalOpen(true);
  };

  const handleTechnicalReport = (tender) => {
    setCurrentEvaluation(tender);
    setTechnicalModalOpen(true);
  };

  const handleFinancialReport = (tender) => {
    setCurrentEvaluation(tender);
    setFinancialModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bid Evaluation</h1>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Evaluations</option>
              <option value="technical">Technical Evaluation</option>
              <option value="financial">Financial Evaluation</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending/Open</option>
            </select>
            <button
              onClick={() => {
                fetchTenders(1);
                fetchBidStats();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FileText className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {statsLoading
            ? // Loading state for stats
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            : stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading tenders...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Tenders
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                fetchTenders(1);
                fetchBidStats();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Tenders Found
            </h3>
            <p className="text-gray-600">
              No tenders match the selected filter.
            </p>
          </div>
        ) : (
          filteredTenders.map((tender) => {
            const tenderStatus = getTenderStatus(tender);
            const { technicalStatus, financialStatus } =
              getEvaluationStatus(tender);
            const bidDeadline = new Date(
              tender.bidDeadline
            ).toLocaleDateString();
            const value = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(tender.value);

            return (
              <div
                key={tender._id}
                className="bg-white rounded-lg shadow border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {tender.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-medium ${tenderStatus.color}`}
                      >
                        {tenderStatus.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span>ID: {tender.tenderId}</span>
                      <span>Bids Received: {tender.bidsCount}</span>
                      <span>Deadline: {bidDeadline}</span>
                      <span>Est. Value: {value}</span>
                      <span>Category: {tender.category}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            technicalStatus === "completed"
                              ? "bg-green-500"
                              : technicalStatus === "in-progress"
                              ? "bg-orange-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-sm text-gray-700">
                          Technical Evaluation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            financialStatus === "completed"
                              ? "bg-green-500"
                              : financialStatus === "in-progress"
                              ? "bg-orange-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-sm text-gray-700">
                          Financial Evaluation
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Approved:{" "}
                        {tender.bids
                          ? tender.bids.filter(
                              (bid) => bid.status === "approved"
                            ).length
                          : 0}
                      </span>
                      <span className="text-red-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Disqualified:{" "}
                        {tender.bids
                          ? tender.bids.filter(
                              (bid) => bid.status === "disqualified"
                            ).length
                          : 0}
                      </span>
                      <span className="text-blue-600 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Awarded:{" "}
                        {tender.bids
                          ? tender.bids.filter(
                              (bid) => bid.status === "awarded"
                            ).length
                          : 0}
                      </span>
                      <span className="text-orange-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Pending:{" "}
                        {tender.bids
                          ? tender.bids.filter(
                              (bid) => bid.status === "pending"
                            ).length
                          : 0}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleTechnicalReport(tender)}
                        className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded text-sm font-medium hover:bg-orange-100"
                      >
                        Technical Report
                      </button>
                      <button
                        onClick={() => handleFinancialReport(tender)}
                        className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100"
                      >
                        Financial Report
                      </button>
                      <button className="px-4 py-1.5 bg-green-50 text-green-700 rounded text-sm font-medium hover:bg-green-100">
                        Full Report
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        if (technicalStatus === "completed") {
                          handleEvaluateBids(tender, "financial");
                        } else {
                          handleEvaluateBids(tender, "technical");
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                      disabled={tender.bidsCount === 0}
                    >
                      <FileText className="w-4 h-4" />
                      {tender.bidsCount === 0 ? "No Bids" : "Evaluate Bids"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Manage Q&A
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => fetchTenders(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
            <button
              onClick={() => fetchTenders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {evaluationModalOpen && currentEvaluation && (
        <EvaluationModal
          tender={currentEvaluation}
          evaluationType={evaluationType}
          onClose={() => setEvaluationModalOpen(false)}
        />
      )}

      {technicalModalOpen && currentEvaluation && (
        <TechnicalReportModal
          tender={currentEvaluation}
          onClose={() => setTechnicalModalOpen(false)}
        />
      )}

      {financialModalOpen && currentEvaluation && (
        <FinancialReportModal
          tender={currentEvaluation}
          onClose={() => setFinancialModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BidEvaluation;
