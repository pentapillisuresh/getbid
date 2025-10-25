import React from "react";
import { X, Download, FileText } from "lucide-react";

const FinancialReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  // Validate tender value
  const tenderValue = tender?.value && !isNaN(tender.value) ? tender.value : 0;

  // Process bids from tender data
  const processedBids = React.useMemo(() => {
    if (!tender?.bids || !Array.isArray(tender.bids)) {
      return [];
    }

    // Filter bids that have been evaluated OR awarded
    const evaluatedBids = tender.bids
      .filter((bid) => {
        // Include bids that are awarded (they have been through evaluation process)
        if (bid.status === "awarded") {
          return bid.amount !== undefined && bid.amount !== null;
        }

        // Include bids that have at least financial evaluation completed
        const hasFinancialEval =
          bid.financialEvaluation &&
          (bid.financialEvaluation.totalRating !== undefined ||
            bid.financialEvaluation.status === "completed");
        const hasAmount = bid.amount !== undefined && bid.amount !== null;

        return hasFinancialEval && hasAmount;
      })
      .map((bid) => ({
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
      }))
      .sort((a, b) => a.numericAmount - b.numericAmount); // Sort by amount (lowest first)

    // Add rank and calculate variance
    return evaluatedBids.map((bid, index) => {
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
        ...bid, // This preserves numericAmount and all other bid properties
        rank,
        vendorName:
          bid.vendor?.name ||
          bid.vendorName ||
          bid.user?.name ||
          `Vendor ${rank}`,
        contactPerson:
          bid.vendor?.contactPerson ||
          bid.contactPerson ||
          bid.user?.contactPerson ||
          "N/A",
        bidAmount: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
        }).format(bid.numericAmount),
        variance: `${variance > 0 ? "+" : ""}${variance}%`,
        status:
          bid.status === "awarded"
            ? "Awarded"
            : rank === 1
            ? "L1 (Lowest)"
            : `L${rank}`,
        technicalScore: bid.technicalEvaluation?.totalRating || 0,
        financialScore: bid.financialEvaluation?.totalRating || 0,
        overallScore:
          ((bid.technicalEvaluation?.totalRating || 0) +
            (bid.financialEvaluation?.totalRating || 0)) /
          2,
        bidId: bid._id || bid.id,
        submittedDate: bid.createdAt
          ? new Date(bid.createdAt).toLocaleDateString("en-GB")
          : "N/A",
        isAwarded: bid.status === "awarded",
      };
    });
  }, [tender]);

  // Calculate financial summary
  const estimatedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(tenderValue);

  const lowestBid =
    processedBids.length > 0 ? processedBids[0].bidAmount : "₹0";

  // Calculate the actual difference between estimated value and lowest bid
  const lowestBidNumeric =
    processedBids.length > 0 ? processedBids[0].numericAmount : 0;

  console.log("Calculation Debug:", {
    processedBidsLength: processedBids.length,
    firstBid: processedBids[0],
    lowestBidNumeric,
    tenderValue,
  });

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

  // Count awarded bids
  const awardedBidsCount = processedBids.filter((bid) => bid.isAwarded).length;

  // Debug logging
  console.log("Financial Report Debug:", {
    tenderValue,
    processedBidsLength: processedBids.length,
    lowestBidNumeric,
    firstBidAmount: processedBids[0]?.numericAmount,
    firstBidOriginalAmount: processedBids[0]?.amount,
    lowestBid,
    difference,
    savings,
    savingsPositive,
    calculationCheck: {
      hasProcessedBids: processedBids.length > 0,
      hasTenderValue: tenderValue > 0,
      hasLowestBidNumeric: lowestBidNumeric > 0,
      rawDifference: tenderValue - lowestBidNumeric,
    },
  });

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
              Financial Evaluation Report
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
                Financial Evaluation Report
              </h1>
              <p className="text-lg text-gray-700 mb-1">
                {tender?.title || "Tender Title"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Tender ID: {tender?.tenderId || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Generated on {currentDate}
              </p>

              {/* Evaluation Status Indicator */}
              <div className="flex items-center justify-center gap-4 mt-4">
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
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
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
                <p
                  className={`text-sm ${
                    savingsPositive ? "text-green-700" : "text-red-700"
                  } mb-1`}
                >
                  {processedBids.length > 0 &&
                  tenderValue > 0 &&
                  lowestBidNumeric >= 0
                    ? savingsPositive
                      ? "Saving"
                      : "Additional Cost"
                    : "Difference"}
                </p>
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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-sm text-orange-700 mb-1">
                  Evaluated / Awarded
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {processedBids.length}
                  {awardedBidsCount > 0 && (
                    <span className="text-sm text-green-600 ml-1">
                      ({awardedBidsCount} awarded)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                            <span className="text-sm font-semibold">
                              {bid.isAwarded ? "★" : bid.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`text-sm font-medium ${
                              bid.isAwarded ? "text-green-900" : "text-gray-900"
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-semibold">
                            {bid.technicalScore}/100
                          </span>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <div className="space-y-2">
                          <p className="font-medium">
                            No financial evaluation data available
                          </p>
                          <p className="text-sm">
                            Financial reports show bids that have completed
                            financial evaluation or have been awarded.
                          </p>
                          {tender?.bids && tender.bids.length > 0 && (
                            <p className="text-sm text-blue-600">
                              Total bids received: {tender.bids.length} |
                              Evaluated/Awarded bids: {processedBids.length}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
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

export default FinancialReportModal;
