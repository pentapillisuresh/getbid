import React from "react";
import {
  X,
  Download,
  FileText,
  Award,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const FullReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [showContractModal, setShowContractModal] = React.useState(false);

  // Helper function to format date as "Nov 28th, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${month} ${getOrdinal(day)}, ${year}`;
  };

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
        company: bid.company || bid.user?.company || null,
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
    const doc = new jsPDF();

    // Helper to replace rupee symbol with Rs.
    const formatCurrencyForPDF = (amount) => {
      if (!amount) return "N/A";
      return String(amount).replace(/₹/g, "Rs. ");
    };

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Complete Evaluation Report", 105, 20, { align: "center" });

    // Add tender title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(tender.title || "Tender Title", 105, 30, { align: "center" });

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 105, 37, { align: "center" });

    // Add summary statistics
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 14, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Bids: ${summaryStats.totalBids}`, 14, 58);
    doc.text(`Technical Approved: ${summaryStats.technicalApproved}`, 14, 65);
    doc.text(`Financial Evaluated: ${summaryStats.financialEvaluated}`, 14, 72);
    doc.text(`Awarded: ${summaryStats.awarded}`, 14, 79);

    // Add financial summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, 92);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Estimated Value: ${formatCurrencyForPDF(estimatedValue)}`,
      14,
      100
    );
    doc.text(`Lowest Bid: ${formatCurrencyForPDF(lowestBid)}`, 14, 107);
    doc.text(
      `${savingsPositive ? "Savings" : "Excess"}: ${formatCurrencyForPDF(
        savings
      )}`,
      14,
      114
    );

    // Add tender details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Tender Information", 14, 127);

    // Map tender status for display
    let tenderStatus = tender.status || "N/A";
    if (tender.status === "in-progress") tenderStatus = "In Progress";
    else if (tender.status === "technical-evaluation")
      tenderStatus = "Technical Evaluation Completed";
    else if (
      tender.status === "financial-evaluation" ||
      tender.status === "completed"
    )
      tenderStatus = "Completed";
    else if (tender.status === "cancelled") tenderStatus = "Cancelled";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const tenderInfo = [
      ["Tender ID", tender.tenderId || tender.id || "N/A"],
      ["Tender Title", tender.title || "N/A"],
      ["Category", tender.category || "N/A"],
      ["Status", tenderStatus],
    ];

    autoTable(doc, {
      startY: 130,
      head: [["Field", "Value"]],
      body: tenderInfo,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        font: "helvetica",
        fontStyle: "bold",
      },
      bodyStyles: { font: "helvetica" },
      margin: { left: 14, right: 14 },
    });

    // Add complete evaluation table
    const tableData = processedBids.map((bid) => {
      const submittedDate = formatDate(bid.createdAt);
      return [
        bid.vendorName,
        formatCurrencyForPDF(bid.bidAmount),
        bid.variance,
        `${bid.technicalScore}/100`,
        bid.status,
        submittedDate,
      ];
    });

    autoTable(doc, {
      startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 180,
      head: [
        [
          "Vendor",
          "Bid Amount",
          "Variance",
          "Tech Score",
          "Status",
          "Submitted",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        font: "helvetica",
        fontStyle: "bold",
      },
      bodyStyles: { font: "helvetica" },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 22 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 35 },
      },
    });

    // Save the PDF
    doc.save(
      `Complete_Report_${tender.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${new Date().getTime()}.pdf`
    );
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const excelData = processedBids.map((bid) => {
      return {
        "Vendor Name": bid.vendorName,
        "Contact Person": bid.contactPerson,
        "Bid Amount": bid.bidAmount,
        Variance: bid.variance,
        "Technical Score": bid.technicalScore,
        // "Financial Score": bid.financialScore,
        // "Overall Score": bid.overallScore,
        Status: bid.status,
        "Technical Status": bid.technicalStatus,
        "Financial Status": bid.financialStatus,
        "Submitted Date": formatDate(bid.createdAt),
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Map tender status for display
    let tenderStatus = tender.status || "N/A";
    if (tender.status === "in-progress") tenderStatus = "In Progress";
    else if (tender.status === "technical-evaluation")
      tenderStatus = "Technical Evaluation Completed";
    else if (
      tender.status === "financial-evaluation" ||
      tender.status === "completed"
    )
      tenderStatus = "Completed";
    else if (tender.status === "cancelled") tenderStatus = "Cancelled";

    // Add summary sheet
    const summaryData = [
      ["Complete Evaluation Report"],
      ["Tender Title", tender.title || "N/A"],
      ["Generated On", currentDate],
      [""],
      ["Summary Statistics"],
      ["Total Bids", summaryStats.totalBids],
      ["Technical Approved", summaryStats.technicalApproved],
      ["Financial Evaluated", summaryStats.financialEvaluated],
      ["Awarded", summaryStats.awarded],
      [""],
      ["Financial Summary"],
      ["Estimated Value", estimatedValue],
      ["Lowest Bid", lowestBid],
      [savingsPositive ? "Savings" : "Excess", savings],
      [""],
      ["Tender Information"],
      ["Tender ID", tender.tenderId || tender.id || "N/A"],
      ["Category", tender.category || "N/A"],
      ["Status", tenderStatus],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Add bid details sheet
    const bidWs = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, bidWs, "Bid Details");

    // Save the Excel file
    XLSX.writeFile(
      wb,
      `Complete_Report_${tender.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${new Date().getTime()}.xlsx`
    );
  };

  const handleViewContract = (bid) => {
    setSelectedContract(bid);
    setShowContractModal(true);
  };

  const handleCloseContractModal = () => {
    setShowContractModal(false);
    setSelectedContract(null);
  };

  const handleDownloadContract = () => {
    if (!selectedContract) return;

    const doc = new jsPDF();

    // Helper to replace rupee symbol with Rs.
    const formatCurrencyForPDF = (amount) => {
      if (!amount) return "N/A";
      return String(amount).replace(/₹/g, "Rs. ");
    };

    // Add header with logo/icon placeholder
    doc.setFillColor(34, 197, 94); // Green color
    doc.rect(0, 0, 210, 40, "F");

    // Add title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("CONTRACT AGREEMENT", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Awarded Contract Details", 105, 30, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Add contract ID and date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Contract Date: ${currentDate}`, 14, 50);
    doc.text(`Tender ID: ${tender.tenderId || tender.id || "N/A"}`, 14, 56);

    // Add awarded badge
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94);
    doc.text("✓ AWARDED CONTRACT", 150, 50);
    doc.setTextColor(0, 0, 0);

    // Section: Tender Information
    let yPos = 70;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("TENDER INFORMATION", 16, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 10;
    const tenderInfo = [
      ["Tender Title", tender.title || "N/A"],
      ["Category", tender.category || "N/A"],
      ["Estimated Value", formatCurrencyForPDF(estimatedValue)],
    ];

    autoTable(doc, {
      startY: yPos,
      body: tenderInfo,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 122 },
      },
      margin: { left: 14, right: 14 },
    });

    // Section: Vendor Information
    yPos = (doc.lastAutoTable?.finalY || yPos + 20) + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("VENDOR INFORMATION", 16, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 10;
    const vendorInfo = [
      ["Vendor Name", selectedContract.vendorName],
      [
        "Company Name",
        selectedContract.company?.name ||
          selectedContract.user?.company?.name ||
          "-",
      ],
      [
        "Company Type",
        selectedContract.company?.companyType ||
          selectedContract.user?.company?.companyType ||
          "-",
      ],
      [
        "Email",
        selectedContract.vendor?.email || selectedContract.user?.email || "N/A",
      ],
      ["Contact Person", selectedContract.contactPerson],
    ];

    autoTable(doc, {
      startY: yPos,
      body: vendorInfo,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 122 },
      },
      margin: { left: 14, right: 14 },
    });

    // Section: Contract Details
    yPos = (doc.lastAutoTable?.finalY || yPos + 35) + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(34, 197, 94);
    doc.rect(14, yPos - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("CONTRACT DETAILS", 16, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 10;
    const contractDetails = [
      [
        "Duration",
        selectedContract.contract?.duration ||
          selectedContract.duration ||
          "10 days",
      ],
      [
        "Start Date",
        selectedContract.contract?.startDate
          ? formatDate(selectedContract.contract.startDate)
          : selectedContract.startDate
          ? formatDate(selectedContract.startDate)
          : "13/11/2025",
      ],
      [
        "End Date",
        selectedContract.contract?.endDate
          ? formatDate(selectedContract.contract.endDate)
          : selectedContract.endDate
          ? formatDate(selectedContract.endDate)
          : "26/11/2025",
      ],
      [
        "Bonus",
        selectedContract.contract?.bonus || selectedContract.bonus || "5%",
      ],
    ];

    autoTable(doc, {
      startY: yPos,
      body: contractDetails,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 122 },
      },
      margin: { left: 14, right: 14 },
    });

    // Section: Financial Details
    yPos = (doc.lastAutoTable?.finalY || yPos + 30) + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("FINANCIAL DETAILS", 16, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 10;
    const financialDetails = [
      ["Contract Value", formatCurrencyForPDF(selectedContract.bidAmount)],
      ["Variance from Estimate", selectedContract.variance],
      ["Rank", `L${selectedContract.rank} (Lowest Bid)`],
    ];

    autoTable(doc, {
      startY: yPos,
      body: financialDetails,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 122 },
      },
      margin: { left: 14, right: 14 },
    });

    // Section: Evaluation Scores
    yPos = (doc.lastAutoTable?.finalY || yPos + 20) + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("EVALUATION SCORES", 16, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 10;
    const evaluationScores = [
      ["Technical Score", `${selectedContract.technicalScore}/100`],
      ["Bid Submitted Date", selectedContract.submittedDate],
    ];

    autoTable(doc, {
      startY: yPos,
      body: evaluationScores,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 122 },
      },
      margin: { left: 14, right: 14 },
    });

    // Add footer
    yPos = (doc.lastAutoTable?.finalY || yPos + 30) + 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPos, 182, 20, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94);
    doc.text("CONTRACT AWARDED", 105, yPos + 6, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `This contract has been awarded to ${selectedContract.vendorName}`,
      105,
      yPos + 12,
      { align: "center" }
    );
    doc.text(
      `Based on competitive bid and strong evaluation scores`,
      105,
      yPos + 17,
      { align: "center" }
    );

    // Save the PDF
    const fileName = `Contract_${selectedContract.vendorName.replace(
      /[^a-z0-9]/gi,
      "_"
    )}_${tender.tenderId || "Tender"}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
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
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {bid.isAwarded && (
                              <button
                                onClick={() => handleViewContract(bid)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Contract
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
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

      {/* Contract Details Modal */}
      {showContractModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Contract Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Awarded Contract Information
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseContractModal}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Contract Header */}
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">
                      Awarded Bid
                    </h3>
                  </div>
                  <p className="text-sm text-green-700">
                    This contract has been awarded to{" "}
                    {selectedContract.vendorName}
                  </p>
                </div>

                {/* Vendor Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vendor Name</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedContract.vendorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company Name</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedContract.company?.name ||
                          selectedContract.user?.company?.name ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedContract.vendor?.email ||
                          selectedContract.user?.email ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company Type</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedContract.company?.companyType ||
                          selectedContract.user?.company?.companyType ||
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Contract Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-1">
                        Duration
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedContract.contract?.duration ||
                          selectedContract.duration ||
                          "10 days"}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-1">
                        Bonus
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedContract.contract?.bonus ||
                          selectedContract.bonus ||
                          "5%"}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-1">
                        Start Date
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {selectedContract.contract?.startDate
                          ? formatDate(selectedContract.contract.startDate)
                          : selectedContract.startDate
                          ? formatDate(selectedContract.startDate)
                          : "13/11/2025"}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-1">
                        End Date
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {selectedContract.contract?.endDate
                          ? formatDate(selectedContract.contract.endDate)
                          : selectedContract.endDate
                          ? formatDate(selectedContract.endDate)
                          : "26/11/2025"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Financial Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-1">
                        Contract Value
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedContract.bidAmount}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-700 mb-1">
                        Variance from Estimate
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          selectedContract.variance.startsWith("-")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedContract.variance}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-orange-700 mb-1">Rank</p>
                      <p className="text-2xl font-bold text-orange-600">
                        L{selectedContract.rank}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evaluation Scores */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Evaluation Scores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-2">
                        Technical Score
                      </p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-blue-600">
                          {selectedContract.technicalScore}
                        </p>
                        <p className="text-lg text-blue-500 mb-1">/100</p>
                      </div>
                      <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-500"
                          style={{
                            width: `${selectedContract.technicalScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                      <p className="text-sm text-green-700 mb-2">
                        Financial Score
                      </p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-green-600">
                          {selectedContract.financialScore}
                        </p>
                        <p className="text-lg text-green-500 mb-1">/100</p>
                      </div>
                      <div className="mt-2 bg-green-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-600 h-full transition-all duration-500"
                          style={{
                            width: `${selectedContract.financialScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <p className="text-sm text-purple-700 mb-2">
                      Overall Score
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-4xl font-bold text-purple-600">
                        {selectedContract.overallScore}
                      </p>
                      <p className="text-xl text-purple-500 mb-1.5">/100</p>
                    </div>
                  </div>
                </div>

                {/* Tender Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tender Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tender Title</p>
                      <p className="text-base font-semibold text-gray-900">
                        {tender.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tender ID</p>
                      <p className="text-base font-semibold text-gray-900">
                        {tender.tenderId || tender.id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="text-base font-semibold text-gray-900">
                        {tender.category || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Bid Submitted Date
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedContract.submittedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Award Status */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Contract Awarded
                      </h3>
                      <p className="text-sm text-green-700">
                        This bid has been successfully awarded the contract. The
                        vendor{" "}
                        <span className="font-semibold">
                          {selectedContract.vendorName}
                        </span>{" "}
                        has been selected for this tender based on their
                        competitive bid and strong evaluation scores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseContractModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadContract}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullReportModal;
