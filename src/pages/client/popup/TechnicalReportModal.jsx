import React from "react";
import { X, Download, FileText } from "lucide-react";

const TechnicalReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  const reportData = {
    totalBids: tender.bids.length,
    approved: tender.bids.filter(
      (b) =>
        b.status === "awarded" ||
        b.technicalEvaluation?.status === "completed" ||
        b.status === "technical-approved" ||
        b.status === "approved"
    ).length,
    disqualified: tender.bids.filter(
      (b) =>
        b.status === "disqualified" ||
        b.technicalEvaluation?.status === "disqualified"
    ).length,
    pending: tender.bids.filter(
      (b) =>
        (b.status !== "awarded" && !b.technicalEvaluation?.status) ||
        (b.technicalEvaluation?.status !== "completed" &&
          b.technicalEvaluation?.status !== "disqualified" &&
          b.status !== "technical-approved" &&
          b.status !== "approved" &&
          b.status !== "disqualified")
    ).length,
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF report...");
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Technical Evaluation Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Technical Evaluation Report
              </h1>
              <p className="text-lg text-amber-700 mb-1">{tender.title}</p>
              <p className="text-sm text-gray-500">
                Generated on {currentDate}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-1">Total Bids</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reportData.totalBids}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {reportData.approved}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-700 mb-1">Disqualified</p>
                <p className="text-3xl font-bold text-red-600">
                  {reportData.disqualified}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technical Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tender.bids.map((bid, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bid.vendor?.name ||
                            bid.vendorName ||
                            bid.user?.name ||
                            `Vendor ${index + 1}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bid.vendor?.contactPerson ||
                            bid.contactPerson ||
                            bid.user?.contactPerson ||
                            "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bid.technicalEvaluation?.totalRating
                          ? `${bid.technicalEvaluation.totalRating}/100`
                          : bid.technicalScore > 0
                          ? `${bid.technicalScore}/100`
                          : "Not Evaluated"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            bid.status === "awarded" ||
                            bid.technicalEvaluation?.status === "completed" ||
                            bid.status === "technical-approved" ||
                            bid.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : bid.status === "disqualified" ||
                                bid.technicalEvaluation?.status ===
                                  "disqualified"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bid.status === "awarded"
                            ? "Awarded"
                            : bid.technicalEvaluation?.status === "completed" ||
                              bid.status === "technical-approved" ||
                              bid.status === "approved"
                            ? "Approved"
                            : bid.status === "disqualified" ||
                              bid.technicalEvaluation?.status === "disqualified"
                            ? "Disqualified"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {bid.technicalEvaluation?.remarks || bid.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              <FileText className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReportModal;
