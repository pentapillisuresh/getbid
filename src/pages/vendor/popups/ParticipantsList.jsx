import React, { useState, useEffect } from "react";
import { X, Users, Download, Eye, ChevronDown, Loader2 } from "lucide-react";
import api from "../../../services/apiService";

const ParticipantsList = ({ tender, onClose }) => {
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("user");
        if (raw) {
          const user = JSON.parse(raw);
          return user._id || user.id;
        }
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
    return null;
  };

  console.log(tender);

  // Fetch bids data from API
  useEffect(() => {
    const fetchBids = async () => {
      if (!tender?.tender?._id) {
        setError("Tender ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/v1/bids", {
          queryParams: {
            tender: tender?.tender?._id,
          },
        });

        if (response.success && response.data) {
          setBids(response.data);
        } else {
          setError("Failed to load bids");
        }
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError(err.message || "Failed to load participants");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [tender?.tender?._id]);

  // Transform API data to participants format
  const transformBidsToParticipants = () => {
    const currentUserId = getCurrentUserId();

    // Sort bids by amount (ascending for rank calculation)
    const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);

    return sortedBids.map((bid, index) => {
      const isCurrentUser = bid.user?._id === currentUserId;
      const rank = `L${index + 1}`;

      // Determine status based on bid status
      let displayStatus = "Pending";
      let statusColor = "bg-yellow-100 text-yellow-700";

      if (bid.status === "awarded") {
        displayStatus = "Awarded";
        statusColor = "bg-green-100 text-green-700";
      } else if (bid.status === "rejected" || bid.status === "disqualified") {
        displayStatus = "Rejected";
        statusColor = "bg-red-100 text-red-700";
      } else if (bid.technicalEvaluation && !bid.technicalEvaluation.isDraft) {
        displayStatus = "Evaluated";
        statusColor = "bg-blue-100 text-blue-700";
      }

      return {
        id: bid._id,
        rank,
        vendorName: bid.user?.name || "Unknown Vendor",
        bidValue: `₹${bid.amount?.toLocaleString("en-IN") || "0"}`,
        experience: bid.timeline || "N/A",
        status: displayStatus,
        statusColor,
        documents: bid.documents?.length || 0,
        isYou: isCurrentUser,
        rawStatus: bid.status,
        technicalRating: bid.technicalEvaluation?.totalRating || null,
        disqualifyReason: bid.disqualifyReason || null,
        bidData: bid,
      };
    });
  };

  const participants = transformBidsToParticipants();

  const qualifiedParticipants = participants.filter(
    (p) => p.rawStatus !== "rejected" && p.rawStatus !== "disqualified"
  );

  const rejectedParticipants = participants.filter(
    (p) => p.rawStatus === "rejected" || p.rawStatus === "disqualified"
  );

  return (
    <div
      style={{ marginTop: "0px" }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Participants List
              </h2>
            </div>
            <p className="text-gray-600 mt-1">
              {tender.title} • Tender ID: {tender.tenderId}
            </p>
            {!loading && (
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  🟣 {tender.status || "Active"}
                </span>
                <span className="text-sm text-gray-600">
                  Total Participants: {participants.length}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading participants...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-6 my-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="font-medium text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Visibility Information */}
            <div className="mx-6 mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Visibility Information
                  </h3>
                  <p className="text-sm text-blue-700">
                    Only qualified participants and accepted bids are shown with
                    full details. Rejected bids have limited information
                    visibility for confidentiality.
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {/* <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="rank">Rank (L1, L2, L3)</option>
                    <option value="bidValue">Bid Value</option>
                    <option value="experience">Experience</option>
                  </select>
                </div> */}
                {/* <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Order:
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                  </select>
                </div> */}
              </div>
              <div className="text-sm text-gray-600">
                Showing {qualifiedParticipants.length} qualified participants
              </div>
            </div>

            {/* Participants Table */}
            <div className="mx-6 mb-6">
              {qualifiedParticipants.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No qualified participants found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          RANK
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          VENDOR NAME
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          BID VALUE
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          TIMELINE
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          STATUS
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          DOCUMENTS
                        </th>
                        {qualifiedParticipants.some(
                          (p) => p.technicalRating !== null
                        ) && (
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            RATING
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {qualifiedParticipants.map((participant, index) => (
                        <tr
                          key={participant.id || index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium text-sm">
                              {participant.rank}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {participant.vendorName
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {participant.vendorName}
                                  {participant.isYou && (
                                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                      You
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-green-600">
                              {participant.bidValue}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">
                              {participant.experience}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`${participant.statusColor} px-2 py-1 rounded-full text-xs font-medium`}
                            >
                              {participant.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700">
                                {participant.documents} files
                              </span>
                              {/* {participant.documents > 0 && (
                                <Download className="w-4 h-4 text-gray-400" />
                              )} */}
                            </div>
                          </td>
                          {qualifiedParticipants.some(
                            (p) => p.technicalRating !== null
                          ) && (
                            <td className="py-4 px-4">
                              {participant.technicalRating !== null ? (
                                <span className="font-medium text-gray-900">
                                  {participant.technicalRating}/100
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  N/A
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rejected Participants Section */}
            {rejectedParticipants.length > 0 && (
              <div className="mx-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Rejected Participants
                </h3>
                <div className="space-y-2">
                  {rejectedParticipants.map((participant, index) => (
                    <div
                      key={participant.id || index}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {participant.vendorName
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              {participant.vendorName}
                            </span>
                            <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                              {participant.status}
                            </span>
                            {participant.isYou && (
                              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Limited visibility
                          </span>
                          <span className="text-sm text-gray-500">
                            {participant.documents} files
                          </span>
                          {participant.disqualifyReason && (
                            <span className="text-sm text-red-600">
                              Reason: {participant.disqualifyReason}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
