import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Download,
  Eye,
  Building2,
  MapPin,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";
import ViewDetailsPopup from "../popups/ViewDetailsPopup";
import QAPopup from "../popups/QAPopup";
import SubmitBidPopup from "../popups/SubmitBidPopup";
import SupportPopup from "../popups/SupportPopup";
import api from "../../../services/apiService";

const TenderListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [activePopup, setActivePopup] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  // -------------------- Filter Options --------------------
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "construction", label: "Construction" },
    { value: "it", label: "IT Services" },
    { value: "healthcare", label: "Healthcare" },
    { value: "transportation", label: "Transportation" },
    { value: "supply", label: "Supply" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "closing-soon", label: "Closing Soon" },
    { value: "prebid", label: "Pre-bid Meeting" },
  ];

  const statesAndDistricts = {
    all: ["All Districts"],
    Maharashtra: ["All Districts", "Mumbai", "Pune", "Nagpur", "Nashik"],
    Karnataka: ["All Districts", "Bangalore", "Mysore", "Mangalore", "Hubli"],
    Delhi: ["All Districts", "New Delhi", "Central Delhi", "East Delhi"],
    TamilNadu: ["All Districts", "Chennai", "Coimbatore", "Madurai", "Salem"],
  };

  // -------------------- Tenders Data (from API) --------------------
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // last loaded page
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "-";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    } catch (e) {
      return String(val);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (e) {
      return iso;
    }
  };

  const calculateDaysLeft = (iso) => {
    if (!iso) return null;
    const now = new Date();
    const d = new Date(iso);
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const hasMore = currentPage < totalPages;

  const loadPage = useCallback(
    async (page = 1, append = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await api.get("/v1/tenders", {
          queryParams: { page, limit },
        });
        // API shape: { success, message, totalCount, currentPage, totalPages, data: [...] }
        const items = (res.data || []).map((it) => ({
          _id: it._id,
          title: it.title,
          // new fields from API
          bidsCount: it.bidsCount || 0,
          isBidSubmitted: !!it.isBidSubmitted,
          department: it.postedBy ? it.postedBy.name : "—",
          location: `${it.district || ""}${
            it.district && it.state ? ", " : ""
          }${it.state || ""}`,
          state: it.state,
          district: it.district,
          category: it.category,
          estimatedValue: formatCurrency(it.value),
          publishedDate: formatDate(it.createdAt),
          deadline: formatDate(it.bidDeadline),
          description: it.description || it.technicalSpecifications || "-",
          eligibility: (it.eligibilityCriteria || []).join(", "),
          documentFee: it.documentFee || "-",
          emd: it.emd || "-",
          status: it.isActive ? "Open" : "Closed",
          daysLeft: calculateDaysLeft(it.bidDeadline),
          statusColor:
            calculateDaysLeft(it.bidDeadline) <= 7 ? "yellow" : "green",
          priority: it.priority || "medium",
          raw: it,
        }));

        setTotalCount(res.totalCount || (items ? items.length : 0));
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || page);

        setTenders((prev) => (append ? prev.concat(items) : items));
      } catch (err) {
        setError(err.message || "Failed to load tenders");
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [limit]
  );

  // initial load
  useEffect(() => {
    loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPage]);

  // reset when filters/search change
  useEffect(() => {
    // when filters change, reset to first page and reload
    setTenders([]);
    setTotalPages(1);
    setCurrentPage(0);
    loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedState,
    selectedDistrict,
  ]);

  // IntersectionObserver to load more when sentinel is visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !loadingMore &&
            !loading &&
            currentPage < totalPages
          ) {
            loadPage(currentPage + 1, true);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [currentPage, totalPages, loadingMore, loading, loadPage]);

  // -------------------- Filter Logic --------------------
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      tender.category.toLowerCase().includes(selectedCategory);
    const matchesStatus =
      selectedStatus === "all" ||
      tender.status.toLowerCase().replace(" ", "-") === selectedStatus;
    const matchesState =
      selectedState === "all" || tender.state === selectedState;
    const matchesDistrict =
      selectedDistrict === "all" || tender.district === selectedDistrict;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesState &&
      matchesDistrict
    );
  });

  // -------------------- Badge Style --------------------
  const getStatusBadge = (status, statusColor, daysLeft) => {
    const baseClasses =
      "inline-block px-3 py-1 rounded-full text-xs font-medium";
    if (statusColor === "green")
      return `${baseClasses} bg-green-100 text-green-600`;
    if (statusColor === "yellow" || daysLeft <= 7)
      return `${baseClasses} bg-yellow-100 text-yellow-600`;
    if (statusColor === "blue")
      return `${baseClasses} bg-blue-100 text-blue-600`;
    return `${baseClasses} bg-gray-100 text-gray-600`;
  };

  // -------------------- Popup Handlers --------------------
  const openPopup = (popupType, tender = null) => {
    setSelectedTender(tender);
    setActivePopup(popupType);
  };
  const closePopup = () => {
    setActivePopup(null);
    setSelectedTender(null);
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tender Listings
            </h1>
            <p className="text-gray-600 mt-1">
              Browse and filter available tenders
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredTenders.length} tenders
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("all");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All States</option>
              {Object.keys(statesAndDistricts)
                .filter((s) => s !== "all")
                .map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statesAndDistricts[selectedState].map((d) => (
                <option key={d} value={d === "All Districts" ? "all" : d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tender Cards */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-8">Loading tenders...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filteredTenders.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {t.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {t.location}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          {t.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={getStatusBadge(
                          t.status,
                          t.statusColor,
                          t.daysLeft
                        )}
                      >
                        {t.status}
                      </span>
                      {t.priority === "high" && (
                        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                          <Star className="w-3 h-3 fill-current" /> High
                          Priority
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{t.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">
                        Estimated Value
                      </div>
                      <div className="font-bold text-green-700 text-xl">
                        {t.estimatedValue}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-red-600 font-medium">
                        Submission Deadline
                      </div>
                      <div className="font-bold text-red-700">{t.deadline}</div>
                      <div className="text-sm text-red-600">
                        {t.daysLeft} days left
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">
                        Published Date
                      </div>
                      <div className="font-bold text-blue-700">
                        {t.publishedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => openPopup("details", t)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                      <button
                        onClick={() => openPopup("qa", t)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" /> View Q&A
                      </button>
                      <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button
                        onClick={() => openPopup("support")}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                      >
                        <Building2 className="w-4 h-4" /> Support
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.daysLeft <= 7 && (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <Clock className="w-4 h-4" /> Closing Soon
                        </span>
                      )}
                      {t.isBidSubmitted ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium"
                        >
                          Bid Submitted
                        </button>
                      ) : (
                        <button
                          onClick={() => openPopup("submit", t)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105"
                        >
                          Submit Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* Show bids count as a small summary below the list */}
          <div className="text-sm text-gray-500 mt-2">
            Total tenders: {filteredTenders.length} • Total bids (sum):{" "}
            {tenders.reduce((acc, td) => acc + (td.bidsCount || 0), 0)}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} />

          {loadingMore && (
            <div className="text-center py-4 text-sm text-gray-600">
              Loading more...
            </div>
          )}

          {!loading &&
            !loadingMore &&
            !error &&
            !hasMore &&
            tenders.length > 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                No more tenders
              </div>
            )}
        </div>

        {/* Empty State */}
        {filteredTenders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tenders found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Popups */}
      {activePopup === "details" && selectedTender && (
        <ViewDetailsPopup tender={selectedTender} onClose={closePopup} />
      )}
      {activePopup === "qa" && selectedTender && (
        <QAPopup tender={selectedTender} onClose={closePopup} />
      )}
      {activePopup === "submit" && selectedTender && (
        <SubmitBidPopup tender={selectedTender} onClose={closePopup} />
      )}
      {activePopup === "support" && <SupportPopup onClose={closePopup} />}
    </div>
  );
};

export default TenderListings;
