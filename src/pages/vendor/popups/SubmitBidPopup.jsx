import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
  IndianRupee,
  Calendar,
} from "lucide-react";
import VerifyBidPopup from "./VerifyBidPopup";
import api, { createApiClient } from "../../../services/apiService";
import toastService from "../../../services/toastService";

const SubmitBidPopup = ({ tender, onClose, onSubmitted }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bidAmountError, setBidAmountError] = useState("");
  const [deliveryTimeline, setDeliveryTimeline] = useState("");
  const [techProposal, setTechProposal] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [quotationFile, setQuotationFile] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedFinancial, setAgreedFinancial] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const quotationFileRef = useRef(null);

  // Helper function to parse currency string to number
  const parseEstimatedValue = (estimatedValue) => {
    if (!estimatedValue) return 0;
    // Remove currency symbols, commas, and spaces, then parse
    const cleanValue = String(estimatedValue)
      .replace(/[₹,\s]/g, "")
      .replace(/[^\d.]/g, "");
    return parseFloat(cleanValue) || 0;
  };

  // Helper function to parse bid amount
  const parseBidAmount = (amount) => {
    if (!amount) return 0;
    const cleanAmount = String(amount)
      .replace(/[₹,\s]/g, "")
      .replace(/[^\d.]/g, "");
    return parseFloat(cleanAmount) || 0;
  };

  // Validate bid amount
  const validateBidAmount = (amount) => {
    const bidValue = parseBidAmount(amount);
    const estimatedValue = parseEstimatedValue(tender?.estimatedValue);

    if (!amount || amount.trim() === "") {
      return "Bid amount is required";
    }

    if (bidValue <= 0) {
      return "Bid amount must be greater than zero";
    }

    if (estimatedValue > 0 && bidValue >= estimatedValue) {
      return `Bid amount must be below the estimated value of ${tender?.estimatedValue}`;
    }

    return "";
  };

  // Helper function to format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");
    // Split by decimal point
    const parts = numericValue.split(".");
    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join back with decimal point if there was one
    return parts.length > 1 ? parts.join(".") : parts[0];
  };

  // Handle bid amount change with validation
  const handleBidAmountChange = (e) => {
    const rawValue = e.target.value;
    // Allow only numbers, decimal point, and commas
    const filteredValue = rawValue.replace(/[^\d.,]/g, "");
    // Format with commas
    const formattedValue = formatNumberWithCommas(filteredValue);

    setBidAmount(formattedValue);

    // Validate on change
    const error = validateBidAmount(formattedValue);
    setBidAmountError(error);
  };

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's documents to allow selection in the bid form
  useEffect(() => {
    (async () => {
      try {
        setDocsLoading(true);
        const resp = await api.get("/v1/documents");
        const items = (resp && resp.data) || [];
        const mapped = items.map((d) => ({
          id: d._id,
          name:
            d.name || (d.file && d.file.fileName) || d.fileName || "Untitled",
          selected: true,
          fileId: d.file && d.file._id ? d.file._id : d.file || null,
        }));
        setDocuments(mapped);
      } catch (err) {
        console.error("Failed to load documents for bid form", err);
        toastService.showError(
          (err && err.message) || "Failed to load documents"
        );
      } finally {
        setDocsLoading(false);
      }
    })();
  }, []);

  const toggleDocument = (id) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  const handleFileUpload = (file) => {
    setQuotationFile(file);
  };

  const handleQuotationFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF or Excel files");
        return;
      }

      handleFileUpload(file);
    }
  };

  const triggerQuotationUpload = () => {
    quotationFileRef.current?.click();
  };

  const handleProceedToVerify = async () => {
    try {
      // Get user info for email and userId
      let storedUser = {};
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem("user");
          if (raw) storedUser = JSON.parse(raw) || {};
        }
      } catch (e) {
        storedUser = {};
      }

      const email = storedUser.email;
      const userId = storedUser._id || storedUser.id;

      if (!email) {
        toastService.showError("Email not found in user profile");
        return;
      }

      if (!userId) {
        toastService.showError("User ID not found in user profile");
        return;
      }

      // Make API call to send OTP
      const body = {
        type: "email",
        contact: email,
        userId: userId,
      };

      const data = await api.post("/auth/send-otp", {
        body,
        showToasts: false,
      });

      if (data && data.success) {
        toastService.showSuccess("OTP sent successfully to your email");
        setShowVerifyPopup(true);
      } else {
        throw new Error(data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toastService.showError(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyClose = () => {
    setShowVerifyPopup(false);
  };

  const handleVerifySubmit = async (otp) => {
    try {
      setSubmitting(true);

      // Get user info for OTP verification
      let storedUser = {};
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem("user");
          if (raw) storedUser = JSON.parse(raw) || {};
        }
      } catch (e) {
        storedUser = {};
      }

      const email = storedUser.email;

      if (!email) {
        toastService.showError("Email not found in user profile");
        return;
      }

      // 1) First verify OTP
      const otpVerificationBody = {
        type: "email",
        contact: email,
        otp: otp,
        deviceDetails: {
          deviceType: "web",
          deviceName: "Browser",
          deviceToken: "web-browser-token",
        },
      };

      const otpVerificationResult = await api.post("/auth/verify-otp", {
        body: otpVerificationBody,
        showToasts: false,
      });

      if (!otpVerificationResult || !otpVerificationResult.success) {
        throw new Error(
          otpVerificationResult?.message ||
            "Invalid OTP. Please check and try again."
        );
      }

      toastService.showSuccess("OTP verified successfully");

      // 2) If OTP verification is successful, proceed with bid submission
      // Upload quotation file (multipart) if present
      let quotationFileId = null;
      if (quotationFile) {
        const fd = new FormData();
        fd.append("image", quotationFile, quotationFile.name);

        const multipartClient = createApiClient({
          baseURL: api.defaults.baseURL,
          headers: {},
          getAuthToken: api.defaults.getAuthToken,
        });

        const uploadResp = await multipartClient.post("/v1/File/upload", {
          body: fd,
        });

        const uploaded =
          uploadResp && (uploadResp.file || uploadResp.data || uploadResp);
        // uploaded could be the file object or an object containing file
        const fileObj = uploaded && uploaded.file ? uploaded.file : uploaded;
        if (fileObj && fileObj._id) quotationFileId = fileObj._id;
      }

      // 3) Prepare bid payload
      const selectedDocIds = documents
        .filter((d) => d.selected)
        .map((d) => d.id);

      const bidBody = {
        tender: tender?._id || tender?.id || tender?.title || "unknown",
        amount: Number(String(bidAmount).replace(/,/g, "")) || 0,
        timeline: deliveryTimeline,
        summary: techProposal,
        quotation: quotationFileId || "",
        documents: selectedDocIds,
      };

      const resp = await api.post("/v1/bids", {
        body: bidBody,
        showToasts: true,
      });

      // Close verification popup and main popup
      setShowVerifyPopup(false);

      // Notify parent to refresh data
      if (typeof onSubmitted === "function") {
        try {
          await onSubmitted();
        } catch (e) {
          console.error("onSubmitted callback failed", e);
        }
      } else {
        onClose && onClose(true);
      }
    } catch (err) {
      console.error("Verification or bid submission failed", err);

      // Extract meaningful error message
      let errorMessage = "Failed to verify OTP or submit bid";

      if (err && err.message) {
        // If it's our custom error message, use it
        if (
          err.message.includes("Invalid OTP") ||
          err.message.includes("OTP")
        ) {
          errorMessage = err.message;
        } else if (err.message.includes("HTTP error")) {
          // For HTTP errors, show a user-friendly message
          errorMessage = "Invalid OTP. Please check the code and try again.";
        } else {
          errorMessage = err.message;
        }
      }

      toastService.showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDocCount = documents.filter((doc) => doc.selected).length;
  const isFormValid =
    bidAmount &&
    !bidAmountError &&
    deliveryTimeline &&
    techProposal &&
    quotationFile &&
    agreedTerms &&
    agreedFinancial;

  // Create bid data for verification popup
  // read stored user info for auto-filled fields
  let storedUser = {};
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem("user");
      if (raw) storedUser = JSON.parse(raw) || {};
    }
  } catch (e) {
    storedUser = {};
  }

  const bidData = {
    tender: tender?.title || "Highway Construction Project Phase II",
    bidAmount: bidAmount,
    timeline: deliveryTimeline,
    email: storedUser.email || "",
    companyName: storedUser.companyName || storedUser.name || "Your Company",
    contactPerson: storedUser.contactPerson || storedUser.name || "",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[97vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Submit Bid
              </h2>
              <p className="text-gray-600 text-sm mt-1">{tender?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[80vh]">
            <div className="p-6 space-y-8">
              {/* Company Information */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Company Information (Auto-filled from Profile)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <div className="font-semibold text-gray-900">
                      {storedUser.companyName ||
                        storedUser.name ||
                        "Your Company"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Registration:</span>
                    <div className="font-semibold text-gray-900">
                      TC-2019-001
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact Person:</span>
                    <div className="font-semibold text-gray-900">
                      John Smith
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-semibold text-blue-600">
                      {storedUser.email || ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Contract Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">
                      Estimated Contract Value:
                    </span>
                    <div className="font-bold text-green-600 text-xl">
                      {tender?.estimatedValue}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tender Category:</span>
                    <div className="font-semibold text-gray-900">
                      {tender?.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid Form */}
              <div className="space-y-6">
                {/* Bid Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Bid Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      Note: Your bid amount must be below the estimated contract
                      value of {tender?.estimatedValue}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={handleBidAmountChange}
                    placeholder="Enter your competitive bid amount"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      bidAmountError
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {bidAmountError && (
                    <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {bidAmountError}
                    </div>
                  )}
                </div>

                {/* Delivery Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Timeline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={deliveryTimeline}
                      onChange={(e) => setDeliveryTimeline(e.target.value)}
                      placeholder="e.g., 30 days, 3 months, etc."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Technical Proposal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Proposal Summary{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={techProposal}
                    onChange={(e) => setTechProposal(e.target.value)}
                    placeholder="Brief description of your technical approach and solution..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{techProposal.length}/500 characters</span>
                  </div>
                </div>

                {/* Quotation Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Quotation <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload your detailed quotation file (visible to client)
                  </p>
                  <div
                    onClick={triggerQuotationUpload}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Choose Quotation File
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: PDF, Excel (.xls, .xlsx) • Max 10MB
                    </p>
                    {quotationFile && (
                      <div className="mt-2 text-xs text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {quotationFile.name}
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={quotationFileRef}
                    onChange={handleQuotationFileChange}
                    accept=".pdf,.xls,.xlsx"
                    className="hidden"
                  />
                </div>

                {/* Document Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Documents from Your Profile{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                        >
                          <input
                            type="checkbox"
                            id={`doc-${doc.id}`}
                            checked={doc.selected}
                            onChange={() => toggleDocument(doc.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <FileText className="w-4 h-4 text-blue-600" />
                          <label
                            htmlFor={`doc-${doc.id}`}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {doc.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-green-600 mt-3 font-medium">
                      Selected: {selectedDocCount} documents
                    </p>
                  </div>
                </div>

                {/* File Requirements */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-3">
                    File Upload Requirements
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span>
                        • Quotation: Detailed pricing breakdown with line items
                      </span>
                      {!quotationFile && (
                        <span className="text-red-600 text-xs">
                          ❌ Required
                        </span>
                      )}
                      {quotationFile && (
                        <span className="text-green-600 text-xs">
                          ✅ Uploaded
                        </span>
                      )}
                    </li>
                    <li>
                      • Format: PDF or Excel files only (.pdf, .xls, .xlsx)
                    </li>
                    <li>• Size Limit: Maximum 10MB per file</li>
                    <li>
                      • Visibility: Quotation file will be visible to the client
                      during evaluation
                    </li>
                    <li>
                      • Important: Files will be verified for completeness
                      during evaluation
                    </li>
                  </ul>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="financial-agreement"
                      checked={agreedFinancial}
                      onChange={(e) => setAgreedFinancial(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-1"
                    />
                    <div>
                      <label
                        htmlFor="financial-agreement"
                        className="text-sm font-medium text-red-800 cursor-pointer"
                      >
                        Financial Responsibility Agreement:
                      </label>
                      <p className="text-xs text-red-700 mt-1">
                        I acknowledge that this bidding portal is not
                        responsible for any financial disputes, payment delays,
                        or contractual issues between client and vendor. All
                        financial matters are to be resolved directly between
                        the contracting parties.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-agreement"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                    />
                    <label
                      htmlFor="terms-agreement"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      I accept all terms and conditions of the tender document
                      and confirm that our company meets all eligibility
                      criteria. I understand that false information may lead to
                      disqualification. I also confirm that the uploaded
                      quotation file is accurate and complete.
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                {!isFormValid && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Please complete all required fields
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!isFormValid}
                  onClick={handleProceedToVerify}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    isFormValid
                      ? "bg-primary hover:bg-blue-700 text-white transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Proceed to Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVerifyPopup && (
        <VerifyBidPopup
          bidData={bidData}
          onClose={handleVerifyClose}
          onSubmit={handleVerifySubmit}
        />
      )}
    </>
  );
};

export default SubmitBidPopup;
