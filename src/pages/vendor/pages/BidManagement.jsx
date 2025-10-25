import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  IndianRupee,
  Eye,
  Download,
  Filter,
  Search,
  RotateCcw,
  Users,
  Trash2,
} from "lucide-react";
import TenderDetail from "../popups/TenderDetail";
import ParticipantsList from "../popups/ParticipantsList";
import RebidConfirmation from "../popups/RebidConfirmation";
import ContractDetailsModal from "../popups/ContractDetailsModal";
import api from "../../../services/apiService";
import bidsService from "../../../services/bidsService";
import toast from "../../../services/toastService";

const BidManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("bids");
  const [selectedTender, setSelectedTender] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRebid, setShowRebid] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [selectedBidForContract, setSelectedBidForContract] = useState(null);

  // Delete bid modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bidToDelete, setBidToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingBid, setDeletingBid] = useState(false);

  // remote bids loaded from API
  const [bids, setBids] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "technical":
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case "financial":
        return `${baseClasses} bg-indigo-100 text-indigo-700`;
      case "completed":
      case "under-evaluation":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "awarded":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "rejected":
      case "disqualified":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "deleted":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  // normalize API bid item to the structure expected by the UI
  const normalize = (item) => {
    // Determine evaluation status
    const hasPartialEvaluation =
      item.technicalEvaluation || item.financialEvaluation;
    const hasCompleteEvaluation =
      item.technicalEvaluation && item.financialEvaluation;

    // Map status more accurately based on evaluation data
    let displayStatus = item.status || "submitted";
    let canRebid = false;
    let evaluated = hasCompleteEvaluation;

    // Determine if rebid is available (typically when tender is still open)
    const deadline = item.tender?.bidDeadline
      ? new Date(item.tender.bidDeadline)
      : null;
    const isBeforeDeadline = deadline ? new Date() < deadline : false;
    canRebid =
      isBeforeDeadline &&
      (displayStatus === "submitted" || displayStatus === "pending");

    // Format bid amount with currency
    const formattedAmount =
      item.amount != null ? `₹${Number(item.amount).toLocaleString()}` : "-";

    return {
      id: item._id,
      tenderId: item.tender?.tenderId || item.tender?._id || "",
      title: item.tender?.title || "Untitled Tender",
      department: item.tender?.category || "",
      bidAmount: formattedAmount,
      timeline: item.timeline || "-",
      submittedDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-",
      deadline: item.tender?.bidDeadline
        ? new Date(item.tender.bidDeadline).toLocaleDateString()
        : "-",
      status: displayStatus,
      statusText: getStatusDisplayText(
        displayStatus,
        hasPartialEvaluation,
        hasCompleteEvaluation
      ),
      canRebid,
      evaluated,
      lastActivity: item.summary || "",
      documents: item.documents || [],
      quotation: item.quotation || null,
      technicalEvaluation: item.technicalEvaluation || null,
      financialEvaluation: item.financialEvaluation || null,
      disqualifyReason: item.disqualifyReason || null,
      deleteReason: item.deleteReason || null,
      contractTerms: item.contractTerms || null,
      // Include the full tender object for detailed views
      tender: item.tender || null,
      // Additional tender information (for backward compatibility)
      tenderValue: item.tender?.value || 0,
      tenderDescription: item.tender?.description || "",
      contactPerson: item.tender?.contactPerson || "",
      contactNumber: item.tender?.contactNumber || "",
      location: `${item.tender?.district || ""}, ${
        item.tender?.state || ""
      }`.replace(/^, |, $/, ""),
      raw: item,
    };
  };

  // Helper function to get display text for status
  const getStatusDisplayText = (status, hasPartialEval, hasCompleteEval) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "technical":
        return "Technical Evaluation";
      case "financial":
        return "Financial Evaluation";
      case "completed":
        return hasCompleteEval ? "Evaluation Complete" : "Under Review";
      case "awarded":
        return "Awarded";
      case "rejected":
        return "Rejected";
      case "disqualified":
        return "Disqualified";
      case "deleted":
        return "Deleted";
      case "draft":
        return "Draft";
      default:
        return "Submitted";
    }
  };

  // try to read stored user id from localStorage (robust to several id field names)
  const getStoredUserId = () => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const raw = window.localStorage.getItem("user");
      console.log("Raw user data from localStorage:", raw);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      console.log("Parsed user data:", parsed);
      if (!parsed || typeof parsed !== "object") return null;
      const userId = parsed._id || parsed.id || parsed.userId || null;
      console.log("Extracted user ID:", userId);
      return userId;
    } catch (e) {
      console.error("Error getting user ID from localStorage:", e);
      return null;
    }
  };

  const filteredBids = bids.map(normalize).filter((bid) => {
    const st = searchTerm.trim().toLowerCase();
    if (!st) return true; // Show all bids when no search term
    const matchesSearch =
      (bid.title || "").toLowerCase().includes(st) ||
      (bid.department || "").toLowerCase().includes(st) ||
      (bid.tenderId || "").toLowerCase().includes(st) ||
      (bid.id || "").toLowerCase().includes(st);
    return matchesSearch;
  });

  console.log("Raw bids from state:", bids);
  console.log("Normalized and filtered bids:", filteredBids);

  const fetchBids = useCallback(
    async (p = 1, replace = false) => {
      setLoading(true);
      setError(null);
      try {
        const userId = getStoredUserId();
        const queryParams = { page: p, limit };
        // Add user ID to query params for filtering user-specific bids
        if (userId) queryParams.user = userId;

        console.log("Fetching bids with params:", queryParams);
        console.log("User ID available:", userId);

        const resp = await api.get("/v1/bids", {
          queryParams,
        });

        console.log("API Response:", resp);

        // Handle new API response structure
        // The response should have the structure you provided: { success, message, totalCount, currentPage, totalPages, data }
        const data = resp?.data || [];
        const tp = resp?.totalPages || 1;
        const currentPage = resp?.currentPage || p;

        console.log("Parsed data:", { data, totalPages: tp, currentPage });

        setTotalPages(tp);
        setHasMore(currentPage < tp);
        setPage(currentPage);
        setBids((prev) => (replace ? data : [...prev, ...data]));
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError(err?.message || "Failed to load bids");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  ); // initial load
  useEffect(() => {
    // reset and fetch first page when component mounts
    setBids([]);
    setPage(1);
    fetchBids(1, true);
  }, [fetchBids]);

  // infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            fetchBids(page + 1);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef, hasMore, loading, page, fetchBids]);

  const handleRefresh = () => {
    setBids([]);
    setPage(1);
    fetchBids(1, true);
  };

  const stats = [
    {
      label: "Total Bids",
      value: bids.length.toString(),
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Awarded",
      value: bids.filter((bid) => bid.status === "awarded").length.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Under Review",
      value: bids
        .filter((bid) =>
          [
            "technical",
            "financial",
            "completed",
            "pending",
            "approved",
          ].includes(bid.status)
        )
        .length.toString(),
      icon: <Clock className="w-6 h-6 text-orange-600" />,
    },
    {
      label: "Total Value",
      value: `₹${(
        bids.reduce((sum, bid) => sum + (bid.raw?.amount || 0), 0) / 100000
      ).toFixed(1)}L`,
      icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
    },
  ];

  // Handlers
  const handleViewTender = (tender) => {
    setSelectedTender(tender);
    setCurrentView("tender-detail");
  };

  const handleBackToBids = () => {
    setCurrentView("bids");
    setSelectedTender(null);
  };

  const handleShowParticipants = (tender) => {
    setSelectedTender(tender);
    setShowParticipants(true);
  };

  const handleShowRebid = (tender) => {
    setSelectedTender(tender);
    setShowRebid(true);
  };

  const handleShowContract = (bid) => {
    console.log("handleShowContract - bid data:", bid);
    console.log("handleShowContract - tender data:", bid.tender);
    console.log("handleShowContract - raw item:", bid.raw);
    setSelectedBidForContract(bid);
    setShowContract(true);
  };

  const handleDeleteBid = async (bid) => {
    setBidToDelete(bid);
    setShowDeleteModal(true);
    setDeleteReason(""); // Reset reason
  };

  const confirmDeleteBid = async () => {
    if (!bidToDelete || !deleteReason.trim()) {
      toast.showError("Please provide a reason for deleting the bid.");
      return;
    }

    try {
      setDeletingBid(true);

      // Call the DELETE API using the bids service
      await bidsService.deleteBid(
        bidToDelete.id || bidToDelete._id,
        deleteReason.trim()
      );

      // Remove the deleted bid from the local state
      setBids((prevBids) =>
        prevBids.filter(
          (b) =>
            b._id !== (bidToDelete.id || bidToDelete._id) &&
            b.id !== (bidToDelete.id || bidToDelete._id)
        )
      );

      // Close modal and reset state
      setShowDeleteModal(false);
      setBidToDelete(null);
      setDeleteReason("");

      // Show success message
      toast.showSuccess("Bid deleted successfully");
    } catch (error) {
      console.error("Error deleting bid:", error);
      toast.showError(
        `Failed to delete bid: ${error.message || "Please try again."}`
      );
    } finally {
      setDeletingBid(false);
    }
  };

  const cancelDeleteBid = () => {
    setShowDeleteModal(false);
    setBidToDelete(null);
    setDeleteReason("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {currentView === "bids" && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Bid Submissions
              </h1>
              <p className="text-gray-600 mt-1">
                Track all your bid submissions with real-time status updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
              {loading && (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bids..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Bid Cards */}
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={getStatusBadge(bid.status)}>
                        {bid.statusText}
                      </span>
                      {bid.status === "submitted" && bid.canRebid && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Open
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {bid.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Tender ID: {bid.tenderId} • Bid ID: {bid.id} • Category:{" "}
                      {bid.department}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Bid Amount
                        </span>
                        <div className="font-semibold text-green-600 text-lg">
                          {bid.bidAmount}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Timeline
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.timeline}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Submitted Date
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.submittedDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Deadline
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.deadline}
                        </div>
                      </div>
                    </div>

                    {/* Evaluation Scores */}
                    {(bid.technicalEvaluation || bid.financialEvaluation) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Technical Score
                          </span>
                          <div className="font-semibold text-blue-600 text-lg">
                            {bid.technicalEvaluation?.totalRating || 0}/100
                          </div>
                          {bid.technicalEvaluation?.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              {bid.technicalEvaluation.notes}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Financial Score
                          </span>
                          <div className="font-semibold text-green-600 text-lg">
                            {bid.financialEvaluation?.totalRating || 0}/100
                          </div>
                          {bid.financialEvaluation?.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              {bid.financialEvaluation.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Disqualification Reason */}
                    {bid.status === "disqualified" && bid.disqualifyReason && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-sm text-red-600 font-medium block mb-1">
                          Disqualification Reason:
                        </span>
                        <div className="text-sm text-red-700">
                          {bid.disqualifyReason}
                        </div>
                      </div>
                    )}

                    {/* Delete Reason */}
                    {bid.status === "deleted" && bid.deleteReason && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-sm text-gray-600 font-medium block mb-1">
                          Delete Reason:
                        </span>
                        <div className="text-sm text-gray-700">
                          {bid.deleteReason}
                        </div>
                      </div>
                    )}

                    {/* Contract Terms */}
                    {bid.status === "awarded" && bid.contractTerms && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm text-green-600 font-medium block mb-2">
                          Contract Details:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-green-600 font-medium">
                              Duration:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.duration}
                            </div>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">
                              Bonus:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.bonus}
                            </div>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">
                              Start Date:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.commencementDate
                                ? new Date(
                                    bid.contractTerms.commencementDate
                                  ).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">
                              End Date:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.completionDate
                                ? new Date(
                                    bid.contractTerms.completionDate
                                  ).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        </div>
                        {bid.contractTerms.conditions && (
                          <div className="mt-2">
                            <span className="text-green-600 font-medium">
                              Conditions:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.conditions}
                            </div>
                          </div>
                        )}
                        {bid.contractTerms.remarks && (
                          <div className="mt-2">
                            <span className="text-green-600 font-medium">
                              Remarks:
                            </span>
                            <div className="text-green-700">
                              {bid.contractTerms.remarks}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Documents */}
                    {bid.documents && bid.documents.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 block mb-2">
                          Submitted Documents:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {bid.documents.map((doc, index) => (
                            <span
                              key={doc._id || index}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                              title={doc.description || ""}
                            >
                              {doc.name || `Document ${index + 1}`}
                              {doc.category && ` (${doc.category})`}
                            </span>
                          ))}
                          {bid.quotation && (
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                              Quotation
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {bid.lastActivity}
                      </p>
                    </div>

                    {(bid.evaluated || bid.status === "awarded") &&
                      bid.status === "awarded" && (
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-purple-600" />
                          <button
                            onClick={() => handleShowParticipants(bid)}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Participants list is now available for viewing
                          </button>
                        </div>
                      )}

                    {bid.canRebid && (
                      <div className="flex items-center gap-2 mb-3 text-green-600">
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Re-bid available before deadline
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleViewTender(bid)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Tender
                    </button>

                    {(bid.evaluated || bid.status === "awarded") && (
                      <button
                        onClick={() => handleShowParticipants(bid)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        <Users className="w-4 h-4" />
                        Participants List
                      </button>
                    )}

                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {bid.canRebid && (
                      <button
                        onClick={() => handleShowRebid(bid)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Re-Bid
                      </button>
                    )}
                    {bid.status === "awarded" && (
                      <button
                        onClick={() => handleShowContract(bid)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        View Contract
                      </button>
                    )}
                    {bid.status === "pending" && (
                      <button
                        onClick={() => handleDeleteBid(bid)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Bid
                      </button>
                    )}
                    {(bid.status === "rejected" ||
                      bid.status === "disqualified") && (
                      <button className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        View Feedback
                      </button>
                    )}
                    {bid.status === "approved" && (
                      <span className="text-green-600 font-medium text-sm">
                        ✓ Bid Approved
                      </span>
                    )}
                    {bid.status === "deleted" && (
                      <span className="text-gray-600 font-medium text-sm">
                        🗑️ Bid Deleted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* sentinel for infinite scroll */}
            <div ref={sentinelRef} />
            {error && (
              <div className="text-red-600 text-sm text-center py-4 bg-red-50 border border-red-200 rounded-lg">
                <strong>Error:</strong> {error}
                <br />
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-red-700 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}
            {!hasMore && !loading && bids.length > 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                No more bids
              </div>
            )}
          </div>

          {/* Empty State */}
          {!loading && filteredBids.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bids found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm.trim()
                  ? `No bids found matching "${searchTerm}"`
                  : error
                  ? `Error loading bids: ${error}`
                  : "You haven't submitted any bids yet"}
              </p>
              <button className="bg-primary-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Browse Tenders
              </button>
              <div className="mt-4 text-xs text-gray-400">
                Debug info: Total bids in state: {bids.length}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && bids.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading bids...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your bid submissions
              </p>
            </div>
          )}
        </>
      )}

      {currentView === "tender-detail" && selectedTender && (
        <TenderDetail
          tender={selectedTender}
          onBack={handleBackToBids}
          onShowParticipants={handleShowParticipants}
          onShowRebid={handleShowRebid}
        />
      )}

      {showParticipants && selectedTender && (
        <ParticipantsList
          tender={selectedTender}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {showRebid && selectedTender && (
        <RebidConfirmation
          tender={selectedTender}
          onClose={() => setShowRebid(false)}
          onConfirm={() => {
            setShowRebid(false);
            alert("Rebid process initiated");
          }}
        />
      )}

      {showContract && selectedBidForContract && (
        <ContractDetailsModal
          bid={selectedBidForContract}
          onClose={() => {
            setShowContract(false);
            setSelectedBidForContract(null);
          }}
        />
      )}

      {/* Delete Bid Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Bid
                </h3>
                <p className="text-sm text-gray-600">
                  {bidToDelete?.title ||
                    bidToDelete?.tenderTitle ||
                    "Selected bid"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">
                This action cannot be undone. Please provide a reason for
                deleting this bid:
              </p>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g., Bid submitted by mistake or needs major revision"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                disabled={deletingBid}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteBid}
                disabled={deletingBid}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBid}
                disabled={deletingBid || !deleteReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deletingBid ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Bid
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidManagement;
