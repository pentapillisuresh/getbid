import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Building,
  Phone,
  Mail,
  User,
  FileText,
  Download,
  Heart,
  Clock,
} from "lucide-react";

const ViewDetailsPopup = ({ tender, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen || !tender) return null;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closing soon":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle document download
  const handleDocumentDownload = (documentUrl, documentName) => {
    if (documentUrl) {
      // If we have a URL, create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = documentName || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // If no URL available, show a message or handle as needed
      alert(
        `Download for "${documentName}" is not available at the moment. Please contact the organization directly.`
      );
    }
  };

  // Handle download all documents
  const handleDownloadAllDocuments = () => {
    const documents = tender.documents || tender.supportingDocuments || [];

    if (documents.length === 0) {
      alert("No documents available for download.");
      return;
    }

    // Download each document with a small delay to avoid browser blocking
    documents.forEach((doc, index) => {
      const docName =
        doc.name ||
        doc.filename ||
        doc.originalName ||
        doc.title ||
        `Document ${index + 1}`;
      const docUrl = doc.url || doc.downloadUrl || doc.fileUrl || doc.path;

      setTimeout(() => {
        handleDocumentDownload(docUrl, docName);
      }, index * 500); // 500ms delay between downloads
    });
  };

  // Helper function to check if bid submission is allowed (until end of deadline day)
  const isBidSubmissionAllowed = (bidDeadline) => {
    if (!bidDeadline) return false;

    const deadlineDate = new Date(bidDeadline);
    const currentDate = new Date();

    // Set deadline to end of day (23:59:59.999)
    deadlineDate.setHours(23, 59, 59, 999);

    // Allow submission until end of deadline day
    return currentDate <= deadlineDate;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{tender.title}</h2>
            {(tender.tenderId || tender._id) && (
              <p className="text-sm text-gray-500 mt-1">
                Tender ID: {tender.tenderId || tender._id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Status and Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {tender.status && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      tender.status
                    )}`}
                  >
                    {tender.status}
                  </span>
                </div>
              )}
              {(tender.value || tender.estimatedValue) && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(tender.value || tender.estimatedValue)}
                  </p>
                </div>
              )}
              {(tender.bidDeadline || tender.deadline) && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Submission Deadline
                  </p>
                  <p className="font-semibold text-red-600">
                    {formatDate(tender.bidDeadline || tender.deadline)}
                  </p>
                </div>
              )}
              {(tender.location || (tender.district && tender.state)) && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">
                    {tender.location ||
                      (tender.district && tender.state
                        ? `${tender.district}, ${tender.state}`
                        : null)}
                  </p>
                </div>
              )}
            </div>

            {/* Project Description */}
            {tender.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Project Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {tender.description}
                </p>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Organization Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organization Details
                </h3>
                <div className="space-y-4">
                  {tender.organization && (
                    <div>
                      <p className="text-sm text-gray-500">Organization:</p>
                      <p className="font-medium text-gray-900">
                        {tender.organization}
                      </p>
                    </div>
                  )}
                  {tender.category && (
                    <div>
                      <p className="text-sm text-gray-500">Category:</p>
                      <p className="font-medium text-gray-900">
                        {tender.category}
                      </p>
                    </div>
                  )}
                  {(tender.createdAt || tender.publishedDate) && (
                    <div>
                      <p className="text-sm text-gray-500">Publishing Date:</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(tender.createdAt || tender.publishedDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {tender.contactPerson && (
                    <div>
                      <p className="text-sm text-gray-500">Contact Person:</p>
                      <p className="font-medium text-gray-900">
                        {tender.contactPerson}
                      </p>
                    </div>
                  )}
                  {tender.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <a
                        href={`mailto:${tender.contactEmail}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {tender.contactEmail}
                      </a>
                    </div>
                  )}
                  {tender.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone:</p>
                      <a
                        href={`tel:${tender.contactPhone}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {tender.contactPhone}
                      </a>
                    </div>
                  )}
                  {tender.contactNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Contact Number:</p>
                      <a
                        href={`tel:${tender.contactNumber}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {tender.contactNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            {tender.eligibilityCriteria &&
              tender.eligibilityCriteria.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Eligibility Criteria
                  </h3>
                  <div className="space-y-2">
                    {tender.eligibilityCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Technical Requirements */}
            {tender.technicalRequirements &&
              tender.technicalRequirements.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Requirements
                  </h3>
                  <div className="space-y-2">
                    {tender.technicalRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Technical Specifications */}
            {tender.technicalSpecifications && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {tender.technicalSpecifications}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {((tender.documents && tender.documents.length > 0) ||
              (tender.supportingDocuments &&
                tender.supportingDocuments.length > 0)) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tender.documents && tender.documents.length > 0
                    ? tender.documents.map((doc, index) => {
                        // Handle different document structure formats
                        const docName =
                          doc.name ||
                          doc.filename ||
                          doc.originalName ||
                          doc.title ||
                          `Document ${index + 1}`;
                        const docUrl =
                          doc.url || doc.downloadUrl || doc.fileUrl || doc.path;

                        return (
                          <div
                            key={doc._id || doc.id || index}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span
                              className="text-gray-700 flex-1 truncate"
                              title={docName}
                            >
                              {docName}
                            </span>
                            <button
                              onClick={() =>
                                handleDocumentDownload(docUrl, docName)
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    : tender.supportingDocuments &&
                      tender.supportingDocuments.length > 0
                    ? tender.supportingDocuments.map((doc, index) => {
                        const docName =
                          doc.name ||
                          doc.filename ||
                          doc.originalName ||
                          doc.title ||
                          `Document ${index + 1}`;
                        const docUrl =
                          doc.url || doc.downloadUrl || doc.fileUrl || doc.path;

                        return (
                          <div
                            key={doc._id || doc.id || index}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span
                              className="text-gray-700 flex-1 truncate"
                              title={docName}
                            >
                              {docName}
                            </span>
                            <button
                              onClick={() =>
                                handleDocumentDownload(docUrl, docName)
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* <button
              onClick={handleDownloadAllDocuments}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download All Documents
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4" />
              Save for Later
            </button> */}
          </div>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isBidSubmissionAllowed(tender.bidDeadline)
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isBidSubmissionAllowed(tender.bidDeadline)}
            title={
              !isBidSubmissionAllowed(tender.bidDeadline)
                ? "Bid submission deadline has passed"
                : "Submit your bid for this tender"
            }
            onClick={() => {
              onClose();
              navigate("/choose-login-type");
            }}
          >
            Submit Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPopup;
