import React from "react";
import {
  X,
  Download,
  CheckCircle,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  MessageCircle,
  Link,
  Award,
  MapPin,
  Phone,
  FileText,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  downloadDocument,
  openDocument,
  formatDate,
} from "../../../utils/tenderUtils";

const TenderDetailsModal = ({ show, onClose, tender, onCancelTender }) => {
  if (!show || !tender) return null;

  console.log(tender);

  return (
    <div
      style={{ marginTop: "0px" }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  tender.status === "published"
                    ? "bg-green-100"
                    : tender.status === "evaluation" ||
                      tender.status === "technical-evaluation"
                    ? "bg-blue-100"
                    : tender.status === "awarded" ||
                      tender.status === "financial-evaluation" ||
                      tender.status === "completed"
                    ? "bg-purple-100"
                    : tender.status === "cancelled"
                    ? "bg-red-100"
                    : tender.status === "in-progress"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                {tender.status === "published" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : tender.status === "evaluation" ||
                  tender.status === "technical-evaluation" ? (
                  <Clock className="w-5 h-5 text-blue-600" />
                ) : tender.status === "awarded" ||
                  tender.status === "financial-evaluation" ||
                  tender.status === "completed" ? (
                  <Award className="w-5 h-5 text-purple-600" />
                ) : tender.status === "cancelled" ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 capitalize">
                  {tender.status == "financial-evaluation"
                    ? "Completed"
                    : tender.status === "technical-evaluation"
                    ? "Evaluation Completed"
                    : tender.status}
                </p>
                <p className="text-sm text-gray-600">{tender.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Days Left</p>
              <p
                className={`font-semibold ${
                  tender.daysLeft > 0 ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {tender.daysLeft > 0
                  ? `${tender.daysLeft} days`
                  : `${Math.abs(tender.daysLeft)} days ago`}
              </p>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Tender ID</p>
              <p className="font-semibold text-gray-900">{tender.tenderId}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="font-semibold text-green-600">
                {tender.estimatedValue}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Bids Received</p>
              <p className="font-semibold text-purple-600">
                {tender.bidsReceived}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Published Date</p>
              <p className="font-semibold text-gray-900">
                {tender.publishedDate}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
              {tender.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {tender.eligibilityCriteria &&
            tender.eligibilityCriteria.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Eligibility Criteria
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {tender.eligibilityCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-800">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          {/* Technical Specifications */}
          {tender.technicalSpecifications && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Technical Specifications
              </p>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                {tender.technicalSpecifications}
              </p>
            </div>
          )}

          {/* Location Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">State</p>
                <p className="font-semibold text-gray-900">
                  {tender.state || "Not specified"}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">District</p>
                <p className="font-semibold text-gray-900">
                  {tender.district || "Not specified"}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Location Scope</p>
                <p className="font-semibold text-gray-900">
                  {tender.locationScope || "Not specified"}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-900">
                  {tender.address || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-semibold text-gray-900">
                  {tender.createdBy || "Not specified"}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Contact Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">
                    {tender.contactNumber || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Submission Deadline</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Calendar className="w-4 h-4" />
                {tender.submissionDeadline}
              </div>
            </div>
            {tender.isBidSubmitted !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Bid Status</p>
                <div
                  className={`flex items-center gap-2 font-semibold ${
                    tender.isBidSubmitted ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {tender.isBidSubmitted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {tender.isBidSubmitted
                    ? "Bid Submitted"
                    : "Bid Not Submitted"}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-2">Created By</p>
              <p className="text-gray-900 font-semibold">{tender.createdBy}</p>
            </div>
            {tender.linkedAccount && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Account Link</p>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Link className="w-4 h-4" />
                  Linked to main account
                </div>
              </div>
            )}
          </div>

          {/* Pre-bid Meeting */}
          {tender.preBidMeeting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">
                  Pre-bid Meeting Scheduled
                </h3>
              </div>
              <div className="space-y-2">
                {tender.meetingDate && (
                  <p className="text-sm text-blue-700">
                    <strong>Date:</strong> {formatDate(tender.meetingDate)}
                  </p>
                )}
                {tender.meetingVenue && (
                  <p className="text-sm text-blue-700">
                    <strong>Venue:</strong> {tender.meetingVenue}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Award Information */}
          {tender.awardedTo && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">
                  Tender Awarded
                </h3>
              </div>
              <p className="text-sm text-purple-700">
                Awarded to: {tender.awardedTo}
              </p>
            </div>
          )}

          {/* Tender Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Tender Documents
            </h3>
            <div className="space-y-3">
              {tender.documents && tender.documents.length > 0 ? (
                tender.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          {doc.fileName}
                        </span>
                        <p className="text-xs text-gray-500">{doc.mimeType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDocument(doc)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No documents available
                </p>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* {tender.documents && tender.documents.length > 0 && (
              <button
                onClick={() => {
                  tender.documents.forEach(downloadDocument);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Download className="w-4 h-4" />
                Download All Documents
              </button>
            )} */}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
            >
              Close
            </button>

            {/* {tender.status === "published" && tender.bidsReceived > 0 && (
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                View Bids ({tender.bidsReceived})
              </button>
            )}

            {tender.status === "evaluation" && (
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                Continue Evaluation
              </button>
            )}

            {tender.status === "published" && !tender.awardedTo && (
              <button
                onClick={onCancelTender}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
              >
                Cancel Tender
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetailsModal;
