import React, { useState } from "react";
import { X, Users, Download, Eye, ChevronDown } from "lucide-react";

const ParticipantsList = ({ tender, onClose }) => {
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("ascending");

  const participants = [
    // read current vendor name from localStorage for the "You" participant
    (() => {
      let storedUser = {};
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem("user");
          if (raw) storedUser = JSON.parse(raw) || {};
        }
      } catch (e) {
        storedUser = {};
      }
      return {
        rank: "L1",
        vendorName: storedUser.companyName || storedUser.name || "Your Company",
        bidValue: "$89,500",
        experience: "12 years",
        status: "Accepted",
        documents: 4,
        isYou: true,
      };
    })(),
    {
      rank: "L2",
      vendorName: "CleanPro Services",
      bidValue: "$92,800",
      experience: "8 years",
      status: "Accepted",
      documents: 3,
      isYou: false,
    },
    {
      rank: "L3",
      vendorName: "Excel Maintenance Co.",
      bidValue: "$95,200",
      experience: "15 years",
      status: "Accepted",
      documents: 3,
      isYou: false,
    },
    {
      rank: "L4",
      vendorName: "Perfect Clean Ltd.",
      bidValue: "$98,700",
      experience: "6 years",
      status: "Rejected",
      documents: 2,
      isYou: false,
    },
  ];

  const qualifiedParticipants = participants.filter(
    (p) => p.status === "Accepted"
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            <div className="flex items-center gap-4 mt-3">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                🟣 Evaluated
              </span>
              <span className="text-sm text-gray-600">
                Total Participants: {participants.length}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
                full details. Rejected bids have limited information visibility
                for confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {qualifiedParticipants.length} qualified participants
          </div>
        </div>

        {/* Participants Table */}
        <div className="mx-6 mb-6">
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
                    EXPERIENCE
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    STATUS
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    DOCUMENTS
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {qualifiedParticipants.map((participant, index) => (
                  <tr
                    key={index}
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
                              .slice(0, 2)}
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
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {participant.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">
                          {participant.documents} files
                        </span>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejected Participants Section */}
        <div className="mx-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">
            Rejected Participants
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">PC</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Perfect Clean Ltd.
                  </span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                    Rejected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Limited visibility
                </span>
                <span className="text-sm text-gray-500">
                  5 years experience
                </span>
                <span className="text-sm text-gray-500">2 files</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;
