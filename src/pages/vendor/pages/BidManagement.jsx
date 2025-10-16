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
} from "lucide-react";
import TenderDetail from "../popups/TenderDetail";
import ParticipantsList from "../popups/ParticipantsList";
import RebidConfirmation from "../popups/RebidConfirmation";
import api from "../../../services/apiService";

const BidManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("bids");
  const [selectedTender, setSelectedTender] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRebid, setShowRebid] = useState(false);

  const tabs = [
    { id: "all", label: "All Bids", count: 12 },
    { id: "draft", label: "Draft", count: 2 },
    { id: "submitted", label: "Submitted", count: 5 },
    { id: "under-evaluation", label: "Under Evaluation", count: 3 },
    { id: "awarded", label: "Awarded", count: 1 },
    { id: "rejected", label: "Rejected", count: 2 },
  ];

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
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "under-evaluation":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "awarded":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  // normalize API bid item to the structure expected by the UI
  const normalize = (item) => {
    return {
      id: item._id,
      tenderId: item.tender?._id || "",
      title: item.tender?.title || item.summary || "Untitled Bid",
      department: item.tender?.category || "",
      bidAmount: item.amount != null ? String(item.amount) : "-",
      submittedDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-",
      deadline: item.tender?.bidDeadline
        ? new Date(item.tender.bidDeadline).toLocaleDateString()
        : "-",
      status: item.status || "submitted",
      statusText: item.status || "Submitted",
      canRebid: !!item.canRebid,
      evaluated: !!item.evaluated,
      lastActivity: item.summary || "",
      documents: item.documents || [],
      raw: item,
    };
  };

  const filteredBids = bids.map(normalize).filter((bid) => {
    const matchesTab =
      activeTab === "all" || (bid.status && bid.status === activeTab);
    const st = searchTerm.trim().toLowerCase();
    if (!st) return matchesTab;
    const matchesSearch =
      (bid.title || "").toLowerCase().includes(st) ||
      (bid.department || "").toLowerCase().includes(st) ||
      (bid.tenderId || "").toLowerCase().includes(st) ||
      (bid.id || "").toLowerCase().includes(st);
    return matchesTab && matchesSearch;
  });

  const fetchBids = useCallback(
    async (p = 1, replace = false) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get("/v1/bids", {
          queryParams: { page: p, limit },
        });
        // expected resp.data is array
        const data = resp && resp.data ? resp.data : [];
        const tp =
          resp && typeof resp.totalPages === "number"
            ? resp.totalPages
            : resp && typeof resp.totalPages !== "undefined"
            ? Number(resp.totalPages)
            : 1;
        setTotalPages(tp);
        setHasMore(p < tp);
        setPage(p);
        setBids((prev) => (replace ? data : [...prev, ...data]));
      } catch (err) {
        setError(err?.message || "Failed to load bids");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // initial load
  useEffect(() => {
    // reset and fetch first page when component mounts or when tab/search changes
    setBids([]);
    setPage(1);
    fetchBids(1, true);
  }, [fetchBids, activeTab]);

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
      value: "12",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Success Rate",
      value: "68%",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Under Review",
      value: "3",
      icon: <Clock className="w-6 h-6 text-orange-600" />,
    },
    {
      label: "Total Value",
      value: "1.2M",
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

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
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
                      Tender ID: {bid.tenderId} • Bid ID: {bid.id}
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
                          Submitted Date
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.submittedDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Tender Deadline
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.deadline}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Category
                        </span>
                        <div className="font-semibold text-gray-900">
                          {bid.category}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {bid.lastActivity}
                      </p>
                    </div>

                    {bid.evaluated && bid.status === "awarded" && (
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

                    {bid.evaluated && (
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
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        View Contract
                      </button>
                    )}
                    {bid.status === "rejected" && (
                      <button className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        View Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* sentinel for infinite scroll */}
            <div ref={sentinelRef} />
            {error && (
              <div className="text-red-600 text-sm text-center py-4">
                {error}
              </div>
            )}
            {!hasMore && !loading && bids.length > 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                No more bids
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredBids.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bids found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "all"
                  ? "You haven't submitted any bids yet"
                  : `No bids found in ${tabs
                      .find((t) => t.id === activeTab)
                      ?.label.toLowerCase()} status`}
              </p>
              <button className="bg-primary-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Browse Tenders
              </button>
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
    </div>
  );
};

export default BidManagement;
