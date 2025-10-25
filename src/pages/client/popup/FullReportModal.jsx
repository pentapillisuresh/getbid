import React from "react";
import {
  X,
  Download,
  FileText,
  Award,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const FullReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  // Validate tender value
  const tenderValue = tender?.value && !isNaN(tender.value) ? tender.value : 0;

  // Process all bids with comprehensive data
  const processedBids = React.useMemo(() => {
    if (!tender?.bids || !Array.isArray(tender.bids)) {
      return [];
    }

    return tender.bids
      .map((bid, index) => ({
        ...bid,
        numericAmount: (() => {
          if (typeof bid.amount === "string") {
            const cleanAmount = bid.amount.replace(/[₹,\s]/g, "");
            const parsed = parseFloat(cleanAmount);
            return isNaN(parsed) ? 0 : parsed;
          } else if (typeof bid.amount === "number") {
            return isNaN(bid.amount) ? 0 : bid.amount;
          } else {
            return 0;
          }
        })(),
        vendorName:
          bid.vendor?.name ||
          bid.vendorName ||
          bid.user?.name ||
          `Vendor ${index + 1}`,
        contactPerson:
          bid.vendor?.contactPerson ||
          bid.contactPerson ||
          bid.user?.contactPerson ||
          "N/A",
        technicalScore:
          bid.technicalEvaluation?.totalRating || bid.technicalScore || 0,
        financialScore:
          bid.financialEvaluation?.totalRating || bid.financialScore || 0,
        technicalStatus:
          bid.status === "awarded"
            ? "completed"
            : bid.technicalEvaluation?.status || "pending",
        financialStatus:
          bid.status === "awarded"
            ? "completed"
            : bid.financialEvaluation?.status || "pending",
        isAwarded: bid.status === "awarded",
        submittedDate: bid.createdAt
          ? new Date(bid.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      }))
      .sort((a, b) => a.numericAmount - b.numericAmount)
      .map((bid, index) => {
        const rank = index + 1;
        const estimatedValue = tenderValue || 0;
        const variance =
          estimatedValue > 0 && !isNaN(bid.numericAmount)
            ? (
                ((bid.numericAmount - estimatedValue) / estimatedValue) *
                100
              ).toFixed(1)
            : "0.0";

        return {
          ...bid,
          rank,
          bidAmount: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          }).format(bid.numericAmount),
          variance: `${variance > 0 ? "+" : ""}${variance}%`,
          overallScore: ((bid.technicalScore + bid.financialScore) / 2).toFixed(
            1
          ),
          status: bid.isAwarded
            ? "Awarded"
            : rank === 1
            ? "L1 (Lowest)"
            : `L${rank}`,
        };
      });
  }, [tender, tenderValue]);

  // Calculate summary statistics
  const summaryStats = {
    totalBids: tender?.bids?.length || 0,
    technicalApproved: processedBids.filter(
      (b) =>
        b.isAwarded || b.technicalStatus === "completed" || b.technicalScore > 0
    ).length,
    financialEvaluated: processedBids.filter(
      (b) =>
        b.isAwarded || b.financialStatus === "completed" || b.financialScore > 0
    ).length,
    awarded: processedBids.filter((b) => b.isAwarded).length,
  };

  // Calculate financial summary
  const estimatedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(tenderValue);

  const lowestBid =
    processedBids.length > 0 ? processedBids[0].bidAmount : "₹0";
  const lowestBidNumeric =
    processedBids.length > 0 ? processedBids[0].numericAmount : 0;

  const difference =
    processedBids.length > 0 && tenderValue > 0 && lowestBidNumeric >= 0
      ? Math.abs(tenderValue - lowestBidNumeric)
      : 0;

  const savings =
    difference > 0
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
        }).format(difference)
      : "₹0";

  const savingsPositive =
    processedBids.length > 0 && tenderValue > 0 && lowestBidNumeric >= 0
      ? tenderValue > lowestBidNumeric
      : true;

  const handleDownloadPDF = () => {
    console.log("Downloading Full Report PDF...");
  };

  const handleExportExcel = () => {
    console.log("Exporting Full Report to Excel...");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Complete Evaluation Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Technical & Financial Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Header Information */}
            <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Complete Evaluation Report
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                {tender?.title || "Tender Title"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Tender ID: {tender?.tenderId || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Generated on {currentDate}
              </p>

              {/* Status Indicators */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tender?.status === "technical-evaluation" ||
                      tender?.status === "financial-evaluation" ||
                      tender?.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Technical Evaluation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tender?.status === "financial-evaluation" ||
                      tender?.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Financial Evaluation
                  </span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tender?.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">Award Process</span>
                </div> */}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-1">Total Bids</p>
                <p className="text-3xl font-bold text-blue-600">
                  {summaryStats.totalBids}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">
                  Technical Approved
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {summaryStats.technicalApproved}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-700 mb-1">
                  Financial Evaluated
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {summaryStats.financialEvaluated}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-sm text-orange-700 mb-1">Awarded</p>
                <p className="text-3xl font-bold text-orange-600">
                  {summaryStats.awarded}
                </p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-1">Estimated Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {estimatedValue}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-700 mb-1">Lowest Bid</p>
                <p className="text-2xl font-bold text-purple-600">
                  {lowestBid}
                </p>
              </div>
              <div
                className={`${
                  savingsPositive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } rounded-lg p-4 text-center`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {savingsPositive ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  )}
                  <p
                    className={`text-sm ${
                      savingsPositive ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {savingsPositive ? "Savings" : "Additional Cost"}
                  </p>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    savingsPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {processedBids.length > 0 &&
                  tenderValue > 0 &&
                  lowestBidNumeric >= 0
                    ? `${savingsPositive ? "" : "+"}${savings}`
                    : "₹0"}
                </p>
              </div>
            </div>

            {/* Comprehensive Bid Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detailed Bid Analysis
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bid Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technical Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processedBids.length > 0 ? (
                      processedBids.map((bid) => (
                        <tr
                          key={bid.rank}
                          className={`hover:bg-gray-50 ${
                            bid.isAwarded ? "bg-green-50" : ""
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                bid.isAwarded
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              {bid.isAwarded ? (
                                <Award className="w-4 h-4" />
                              ) : (
                                bid.rank
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div
                              className={`text-sm font-medium ${
                                bid.isAwarded
                                  ? "text-green-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {bid.vendorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {bid.contactPerson}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {bid.bidAmount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                            <span
                              className={
                                bid.variance.startsWith("-")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {bid.variance}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <span className="font-semibold">
                                {bid.technicalScore}/100
                              </span>
                              <div
                                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                  bid.technicalStatus === "completed" ||
                                  bid.isAwarded
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {bid.isAwarded
                                  ? "Awarded"
                                  : bid.technicalStatus === "completed"
                                  ? "Approved"
                                  : "Pending"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                bid.isAwarded
                                  ? "bg-green-100 text-green-800"
                                  : bid.status.includes("L1")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {bid.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {bid.submittedDate}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          <div className="space-y-2">
                            <p className="font-medium">No bid data available</p>
                            <p className="text-sm">
                              Complete evaluation report will show when bids are
                              submitted and evaluated.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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

export default FullReportModal;
