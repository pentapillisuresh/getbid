import React from "react";
import { X, Download, CheckCircle, MapPin, Phone, User } from "lucide-react";

const TenderDetailsModal = ({ show, onClose, tender }) => {
  if (!show || !tender) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {tender.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tender ID</p>
              <p className="font-semibold">{tender.id || tender._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="inline-flex items-center gap-2 font-semibold text-green-600">
                <CheckCircle className="w-4 h-4" />
                {tender.status
                  ? tender.status.charAt(0).toUpperCase() +
                    tender.status.slice(1)
                  : "Active"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="font-semibold text-green-600">
                {tender.estimatedValue ||
                  (tender.value
                    ? `₹${Number(tender.value).toLocaleString()}`
                    : "—")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bids Received</p>
              <p className="font-semibold text-purple-600">
                {tender.bidsReceived || tender.bidsCount || 0}
                {tender.isBidSubmitted && (
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    ✓ Bid Submitted
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold">{tender.category || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submission Deadline</p>
              <p className="font-semibold text-red-600">
                {tender.submissionDeadline ||
                  (tender.bidDeadline ? tender.bidDeadline.split("T")[0] : "—")}
              </p>
            </div>
          </div>

          {/* Location and Contact Information */}
          {(tender.state ||
            tender.district ||
            tender.address ||
            tender.contactPerson ||
            tender.contactNumber) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Location & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(tender.state || tender.district || tender.address) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-gray-800">
                        {[tender.address, tender.district, tender.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {(tender.contactPerson || tender.contactNumber) && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Contact Details
                      </p>
                      {tender.contactPerson && (
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-800">
                            {tender.contactPerson}
                          </p>
                        </div>
                      )}
                      {tender.contactNumber && (
                        <p className="text-gray-800">{tender.contactNumber}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-800">{tender.description}</p>
          </div>

          {/* Eligibility */}
          {tender.eligibilityCriteria &&
            tender.eligibilityCriteria.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Eligibility Criteria
                </h3>
                <ul className="space-y-2">
                  {tender.eligibilityCriteria.map((criteria, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Technical Specifications */}
          {tender.technicalSpecifications && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Technical Specifications
              </h3>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                {tender.technicalSpecifications}
              </p>
            </div>
          )}

          {/* Tender Documents */}
          {tender.documents && tender.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tender Documents
              </h3>
              <div className="space-y-3">
                {tender.documents.map((doc, index) => (
                  <div
                    key={doc._id || index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <span className="text-gray-700 font-medium">
                        {doc.fileName}
                      </span>
                      <p className="text-sm text-gray-500">{doc.mimeType}</p>
                    </div>
                    <button
                      onClick={() => window.open(doc.url, "_blank")}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-bid Meeting */}
          {tender.meetingDate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pre-bid Meeting
              </h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="font-medium text-blue-700">
                  {new Date(tender.meetingDate).toLocaleDateString("en-GB")}
                </p>
                {tender.meetingVenue && (
                  <p className="text-sm text-blue-600">{tender.meetingVenue}</p>
                )}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">
              View Bids
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetailsModal;
