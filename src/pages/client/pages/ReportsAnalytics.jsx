import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  Users,
  FileText,
  Award,
  Clock,
  Target,
  Filter,
  RefreshCw,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../services/apiService";
import toastService from "../../../services/toastService";
import clientStatsService from "../../../services/clientStatsService";

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
  const [tenderPerformanceData, setTenderPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const periods = [
    { value: "last-7-days", label: "Last 7 Days" },
    { value: "last-30-days", label: "Last 30 Days" },
    { value: "last-90-days", label: "Last 90 Days" },
    { value: "this-year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  // Helper function to calculate date range based on selected period
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case "last-7-days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "last-30-days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "last-90-days":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "this-year":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          return {
            startDate: customStartDate,
            endDate: customEndDate,
          };
        }
        return null;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  // Helper function to format currency in Indian format
  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    } else {
      return `₹${value.toLocaleString("en-IN")}`;
    }
  };

  // Helper function to format currency for PDF (without rupee symbol)
  const formatCurrencyForPDF = (value) => {
    if (value >= 10000000) {
      return `Rs. ${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)} L`;
    } else {
      return `Rs. ${value.toLocaleString("en-IN")}`;
    }
  };

  const kpiCards = [
    {
      title: "Total Tender Value",
      value: statsData?.totalTenderValue
        ? formatCurrency(statsData.totalTenderValue)
        : "₹0",
      icon: <IndianRupee className="w-8 h-8 text-green-600" />,
      description: "Total value of all published tenders",
    },
    {
      title: "Active Tenders",
      value: statsData?.activeTenders?.toString() || "0",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      description: "Currently open for bidding",
    },
    {
      title: "Vendor Participation",
      value: statsData?.vendorParticipation
        ? `${statsData.vendorParticipation.toFixed(1)}%`
        : "0%",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      description: "Average response rate",
    },
    {
      title: "Avg Processing Time",
      value: statsData?.avgProcessingTime
        ? `${statsData.avgProcessingTime} days`
        : "0 days",
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      description: "From publication to award",
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const dateRange = getDateRange();
    if (dateRange) {
      fetchClientStats(dateRange);
      fetchTenderPerformanceData(dateRange);
    }
  }, [selectedPeriod, customStartDate, customEndDate]);

  // Handle period change
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    setShowCustomDatePicker(value === "custom");
  };

  // Export report function
  const handleExportReport = () => {
    try {
      // Prepare stats data
      const statsRows = [
        ["Metric", "Value"],
        [
          "Total Tender Value",
          statsData?.totalTenderValue
            ? formatCurrencyForPDF(statsData.totalTenderValue)
            : "Rs. 0",
        ],
        ["Active Tenders", statsData?.activeTenders?.toString() || "0"],
        [
          "Vendor Participation",
          statsData?.vendorParticipation
            ? `${statsData.vendorParticipation.toFixed(1)}%`
            : "0%",
        ],
        [
          "Avg Processing Time",
          statsData?.avgProcessingTime
            ? `${statsData.avgProcessingTime} days`
            : "0 days",
        ],
      ];

      // Prepare tender performance data
      const performanceRows = [
        [],
        ["Tender Performance by Category"],
        ["Category", "Published", "Awarded", "Total Value", "Avg Bids"],
        ...tenderPerformanceData.map((item) => [
          item.category,
          item.published,
          item.awarded,
          formatCurrencyForPDF(item.rawValue || 0),
          item.avgBids,
        ]),
      ];

      // Combine all data
      const dateRange = getDateRange();
      const reportHeader = [
        ["Reports & Analytics"],
        [
          `Period: ${
            periods.find((p) => p.value === selectedPeriod)?.label ||
            selectedPeriod
          }`,
        ],
        dateRange
          ? [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`]
          : [],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Key Performance Indicators"],
      ];

      const allRows = [...reportHeader, ...statsRows, ...performanceRows];

      // Convert to CSV
      const csvContent = allRows
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reports-analytics-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toastService.showSuccess("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toastService.showError("Failed to export report");
    }
  };

  // Export PDF report function
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const dateRange = getDateRange();

      // Add title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Reports & Analytics", pageWidth / 2, 20, { align: "center" });

      // Add period info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const periodLabel =
        periods.find((p) => p.value === selectedPeriod)?.label ||
        selectedPeriod;
      doc.text(`Period: ${periodLabel}`, pageWidth / 2, 28, {
        align: "center",
      });

      if (dateRange) {
        doc.text(
          `Date Range: ${dateRange.startDate} to ${dateRange.endDate}`,
          pageWidth / 2,
          34,
          { align: "center" }
        );
      }

      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 40, {
        align: "center",
      });

      // Add KPI section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Key Performance Indicators", 14, 52);

      autoTable(doc, {
        startY: 56,
        head: [["Metric", "Value"]],
        body: [
          [
            "Total Tender Value",
            statsData?.totalTenderValue
              ? formatCurrencyForPDF(statsData.totalTenderValue)
              : "Rs. 0",
          ],
          ["Active Tenders", statsData?.activeTenders?.toString() || "0"],
          [
            "Vendor Participation",
            statsData?.vendorParticipation
              ? `${statsData.vendorParticipation.toFixed(1)}%`
              : "0%",
          ],
          [
            "Avg Processing Time",
            statsData?.avgProcessingTime
              ? `${statsData.avgProcessingTime} days`
              : "0 days",
          ],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [79, 70, 229],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 14, right: 14 },
      });

      // Add Tender Performance section
      const finalY = doc.lastAutoTable.finalY || 56;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Tender Performance by Category", 14, finalY + 15);

      if (tenderPerformanceData.length > 0) {
        autoTable(doc, {
          startY: finalY + 20,
          head: [
            ["Category", "Published", "Awarded", "Total Value", "Avg Bids"],
          ],
          body: tenderPerformanceData.map((item) => [
            item.category,
            item.published.toString(),
            item.awarded.toString(),
            formatCurrencyForPDF(item.rawValue || 0),
            item.avgBids.toString(),
          ]),
          theme: "grid",
          headStyles: {
            fillColor: [79, 70, 229],
            fontSize: 9,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 25, halign: "center" },
            2: { cellWidth: 25, halign: "center" },
            3: { cellWidth: 40, halign: "right" },
            4: { cellWidth: 25, halign: "center" },
          },
        });
      } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("No tender performance data available", 14, finalY + 25);
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save(
        `reports-analytics-${new Date().toISOString().split("T")[0]}.pdf`
      );
      toastService.showSuccess("PDF report generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toastService.showError("Failed to generate PDF report");
    }
  };

  const fetchClientStats = async (dateRange) => {
    try {
      let url = "/v1/reports/client/stats?startDate=" + dateRange.startDate;
      if (selectedPeriod === "custom" && dateRange.endDate) {
        url += "&endDate=" + dateRange.endDate;
      }

      const response = await api.get(url);
      if (response && response.data) {
        setStatsData(response.data);
      } else {
        toastService.showError("Failed to load statistics");
      }
    } catch (error) {
      console.error("Error fetching client stats:", error);
      toastService.showError("Failed to load statistics");
    }
  };

  const fetchTenderPerformanceData = async (dateRange) => {
    setIsLoading(true);
    try {
      let url =
        "/v1/reports/client/tenders-category?startDate=" + dateRange.startDate;
      if (selectedPeriod === "custom" && dateRange.endDate) {
        url += "&endDate=" + dateRange.endDate;
      }

      const response = await api.get(url);

      if (response.data) {
        // Transform API data to match component format
        const formattedData = response.data.map((item) => ({
          category: item.category,
          published: item.totalTenders,
          awarded: item.completedTenders,
          value: formatCurrency(item.totalValue),
          rawValue: item.totalValue, // Store raw value for PDF export
          avgBids: item.averageBids,
        }));
        setTenderPerformanceData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching tender performance data:", error);
      toastService.showError("Failed to load tender performance data");
    } finally {
      setIsLoading(false);
    }
  };

  const vendorAnalytics = [
    {
      metric: "Total Registered Vendors",
      value: "248",
      trend: "+12 this month",
    },
    { metric: "Verified Vendors", value: "186", trend: "75% of total" },
    {
      metric: "Active Vendors (30 days)",
      value: "142",
      trend: "57% participation",
    },
    {
      metric: "Top Performing Vendors",
      value: "24",
      trend: "90%+ success rate",
    },
    { metric: "New Registrations", value: "18", trend: "This month" },
    { metric: "Blacklisted Vendors", value: "3", trend: "1.2% of total" },
  ];

  const complianceMetrics = [
    { metric: "Document Verification Rate", value: "94%", status: "excellent" },
    { metric: "Tender Process Compliance", value: "98%", status: "excellent" },
    { metric: "Vendor KYC Completion", value: "89%", status: "good" },
    { metric: "Audit Trail Completeness", value: "100%", status: "excellent" },
    { metric: "Regulatory Compliance", value: "96%", status: "excellent" },
    { metric: "Data Security Score", value: "92%", status: "excellent" },
  ];

  const recentTrends = [
    {
      title: "Tender Publication Trend",
      description: "Monthly tender publications showing 15% increase",
      trend: "up",
      data: "8 → 12 → 15 → 18 (last 4 months)",
    },
    {
      title: "Vendor Response Rate",
      description: "Average bids per tender improving consistently",
      trend: "up",
      data: "18 → 22 → 24 → 26 (avg bids per tender)",
    },
    {
      title: "Processing Efficiency",
      description: "Time from publication to award decreasing",
      trend: "up",
      data: "18 → 15 → 14 → 12 days (average)",
    },
    {
      title: "Cost Savings",
      description: "Competitive bidding resulting in cost optimization",
      trend: "up",
      data: "8% → 12% → 15% → 18% (savings vs estimate)",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "average":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const dateRange = getDateRange();
              if (dateRange) {
                fetchClientStats(dateRange);
                fetchTenderPerformanceData(dateRange);
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline-block mr-1" />
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {showCustomDatePicker && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={customEndDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={customStartDate}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {kpi.icon}
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </div>
                  <div className="text-sm text-gray-600">{kpi.title}</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tender Performance */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Tender Performance by Category
              </h2>
              {/* <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Details →
              </button> */}
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">
                      Loading tender performance data...
                    </p>
                  </div>
                </div>
              ) : tenderPerformanceData.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No tender performance data available
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Published
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Awarded
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Total Value
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Avg Bids
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenderPerformanceData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-blue-600 font-medium">
                          {item.published}
                        </td>
                        <td className="py-4 px-4 text-green-600 font-medium">
                          {item.awarded}
                        </td>
                        <td className="py-4 px-4 text-purple-600 font-medium">
                          {item.value}
                        </td>
                        <td className="py-4 px-4 text-gray-900">
                          {item.avgBids}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        {/* <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Trends
            </h3>
            <div className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {trend.title}
                    </h4>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {trend.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {trend.data}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>

      {/* Vendor Analytics & Compliance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendor Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Vendor Analytics
          </h2>
          <div className="space-y-4">
            {vendorAnalytics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{item.metric}</div>
                  <div className="text-sm text-gray-500">{item.trend}</div>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Compliance Metrics
          </h2>
          <div className="space-y-4">
            {complianceMetrics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{item.metric}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      {/* <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Tender Activity Timeline
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Daily
            </button>
          </div>
        </div>

        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              Interactive chart showing tender activity over time
            </p>
            <p className="text-sm text-gray-400">
              Chart visualization would be implemented here
            </p>
          </div>
        </div>
      </div> */}

      {/* Export Options */}
      {/* <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Export Reports</h3>
            <p className="text-sm text-blue-700">
              Download detailed reports in various formats
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
              PDF Report
            </button>
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
              Excel Export
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-blue-700">
              Custom Report
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ReportsAnalytics;
