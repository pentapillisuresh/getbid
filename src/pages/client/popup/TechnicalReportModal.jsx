import React from "react";
import { X, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const TechnicalReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

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
    const doc = new jsPDF();

    // Helper to replace rupee symbol with Rs.
    const formatCurrencyForPDF = (amount) => {
      if (!amount) return "N/A";
      return String(amount).replace(/₹/g, "Rs. ");
    };

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Evaluation Report", 105, 20, { align: "center" });

    // Add tender title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(tender.title, 105, 30, { align: "center" });

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 105, 37, { align: "center" });

    // Add summary statistics
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 14, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Bids: ${reportData.totalBids}`, 14, 58);
    doc.text(`Approved: ${reportData.approved}`, 14, 65);
    doc.text(`Disqualified: ${reportData.disqualified}`, 14, 72);
    doc.text(`Pending: ${reportData.pending}`, 14, 79);

    // Add tender details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Tender Information", 14, 92);

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
      startY: 95,
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

    // Add bid evaluation table
    const tableData = tender.bids.map((bid, index) => {
      const vendorName =
        bid.vendor?.name ||
        bid.vendorName ||
        bid.user?.name ||
        `Vendor ${index + 1}`;
      const amount = formatCurrencyForPDF(bid.amount) || "N/A";
      const technicalScore = bid.technicalEvaluation?.totalRating
        ? `${bid.technicalEvaluation.totalRating}/100`
        : bid.technicalScore > 0
        ? `${bid.technicalScore}/100`
        : "Not Evaluated";

      let status = "Pending";
      if (bid.status === "awarded") status = "Awarded";
      else if (
        bid.technicalEvaluation?.status === "completed" ||
        bid.status === "technical-approved" ||
        bid.status === "approved"
      )
        status = "Approved";
      else if (
        bid.status === "disqualified" ||
        bid.technicalEvaluation?.status === "disqualified"
      )
        status = "Disqualified";

      const remarks = bid.technicalEvaluation?.remarks || bid.remarks || "-";
      const submittedDate = formatDate(bid.createdAt);

      return [
        vendorName,
        amount,
        technicalScore,
        status,
        remarks,
        submittedDate,
      ];
    });

    autoTable(doc, {
      startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 140,
      head: [
        [
          "Vendor",
          "Bid Amount",
          "Technical Score",
          "Status",
          "Remarks",
          "Submitted Date",
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
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 50 },
        5: { cellWidth: 35 },
      },
    });

    // Save the PDF
    doc.save(
      `Technical_Report_${tender.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${new Date().getTime()}.pdf`
    );
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const excelData = tender.bids.map((bid, index) => {
      const vendorName =
        bid.vendor?.name ||
        bid.vendorName ||
        bid.user?.name ||
        `Vendor ${index + 1}`;
      const contactPerson =
        bid.vendor?.contactPerson ||
        bid.contactPerson ||
        bid.user?.contactPerson ||
        "N/A";
      const email = bid.vendor?.email || bid.email || bid.user?.email || "N/A";
      const phone = bid.vendor?.phone || bid.phone || bid.user?.phone || "N/A";
      const technicalScore = bid.technicalEvaluation?.totalRating
        ? `${bid.technicalEvaluation.totalRating}/100`
        : bid.technicalScore > 0
        ? `${bid.technicalScore}/100`
        : "Not Evaluated";

      let status = "Pending";
      if (bid.status === "awarded") status = "Awarded";
      else if (
        bid.technicalEvaluation?.status === "completed" ||
        bid.status === "technical-approved" ||
        bid.status === "approved"
      )
        status = "Approved";
      else if (
        bid.status === "disqualified" ||
        bid.technicalEvaluation?.status === "disqualified"
      )
        status = "Disqualified";

      const remarks = bid.technicalEvaluation?.remarks || bid.remarks || "-";

      return {
        "Vendor Name": vendorName,
        // "Contact Person": contactPerson,
        Email: email,
        // Phone: phone,
        "Technical Score": technicalScore,
        Status: status,
        Remarks: remarks,
        "Bid Amount": bid.amount || "N/A",
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
      ["Technical Evaluation Report"],
      ["Tender Title", tender.title],
      ["Generated On", currentDate],
      [""],
      ["Summary Statistics"],
      ["Total Bids", reportData.totalBids],
      ["Approved", reportData.approved],
      ["Disqualified", reportData.disqualified],
      ["Pending", reportData.pending],
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
      `Technical_Report_${tender.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${new Date().getTime()}.xlsx`
    );
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
                          {bid.vendor?.email ||
                            bid.email ||
                            bid.user?.email ||
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
