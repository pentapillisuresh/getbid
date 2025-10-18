import React, { useState, useEffect } from "react";
import { X, FileText, Eye, Download, CheckCircle, Clock } from "lucide-react";
import api from "../../../services/apiService";

const EvaluationModal = ({ bid, onClose, onEvaluationUpdate }) => {
  // Set initial tab based on bid status
  const [activeTab, setActiveTab] = useState(() => {
    if (bid.status === "financial") return "financial";
    if (bid.status === "completed")
      return bid.financialEvaluation ? "financial" : "technical";
    return "technical";
  });

  // Initialize with default evaluation criteria if not provided
  const getDefaultEvaluationCriteria = () => ({
    technical: {
      experience: { score: 0, maxScore: 20 },
      expertise: { score: 0, maxScore: 25 },
      resources: { score: 0, maxScore: 20 },
      timeline: { score: 0, maxScore: 15 },
      quality: { score: 0, maxScore: 20 },
    },
    financial: {
      costEffectiveness: { score: 0, maxScore: 30 },
      paymentTerms: { score: 0, maxScore: 20 },
      totalCost: { score: 0, maxScore: 30 },
      valueForMoney: { score: 0, maxScore: 20 },
    },
  });

  const [scores, setScores] = useState(() => {
    const defaultCriteria = getDefaultEvaluationCriteria();

    // If we have existing evaluation data, populate it
    if (bid.technicalEvaluation) {
      defaultCriteria.technical = {
        experience: {
          score: bid.technicalEvaluation.experience || 0,
          maxScore: 20,
        },
        expertise: {
          score: bid.technicalEvaluation.expertise || 0,
          maxScore: 25,
        },
        resources: {
          score: bid.technicalEvaluation.resources || 0,
          maxScore: 20,
        },
        timeline: {
          score: bid.technicalEvaluation.timeline || 0,
          maxScore: 15,
        },
        quality: { score: bid.technicalEvaluation.quality || 0, maxScore: 20 },
      };
    }

    if (bid.financialEvaluation) {
      defaultCriteria.financial = {
        costEffectiveness: {
          score: bid.financialEvaluation.costEffectiveness || 0,
          maxScore: 30,
        },
        paymentTerms: {
          score: bid.financialEvaluation.paymentTerms || 0,
          maxScore: 20,
        },
        totalCost: {
          score: bid.financialEvaluation.totalCost || 0,
          maxScore: 30,
        },
        valueForMoney: {
          score: bid.financialEvaluation.valueForMoney || 0,
          maxScore: 20,
        },
      };
    }

    return defaultCriteria;
  });

  const [notes, setNotes] = useState(() => {
    // Initialize notes based on current evaluation stage
    if (activeTab === "technical" && bid.technicalEvaluation?.notes) {
      return bid.technicalEvaluation.notes;
    }
    if (activeTab === "financial" && bid.financialEvaluation?.notes) {
      return bid.financialEvaluation.notes;
    }
    return "";
  });

  // Update notes when tab changes
  useEffect(() => {
    if (activeTab === "technical" && bid.technicalEvaluation?.notes) {
      setNotes(bid.technicalEvaluation.notes);
    } else if (activeTab === "financial" && bid.financialEvaluation?.notes) {
      setNotes(bid.financialEvaluation.notes);
    } else {
      setNotes("");
    }
  }, [activeTab, bid.technicalEvaluation, bid.financialEvaluation]);

  const handleScoreChange = (category, criterion, value) => {
    setScores((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [criterion]: {
          ...(prev[category]?.[criterion] || {}),
          score: parseInt(value) || 0,
        },
      },
    }));
  };

  const calculateTotalScore = (category) => {
    const categoryScores = scores[category];

    // Handle case where categoryScores is undefined or null
    if (!categoryScores || typeof categoryScores !== "object") {
      return { totalScore: 0, maxScore: 0 };
    }

    const scoreValues = Object.values(categoryScores);

    // Handle case where there are no criteria in the category
    if (scoreValues.length === 0) {
      return { totalScore: 0, maxScore: 0 };
    }

    const totalScore = scoreValues.reduce((sum, item) => {
      return sum + (item && typeof item.score === "number" ? item.score : 0);
    }, 0);

    const maxScore = scoreValues.reduce((sum, item) => {
      return (
        sum + (item && typeof item.maxScore === "number" ? item.maxScore : 0)
      );
    }, 0);

    return { totalScore, maxScore };
  };

  const handleSaveDraft = async () => {
    try {
      if (activeTab === "technical") {
        // Prepare technical evaluation draft data
        const technicalData = scores.technical;
        const { totalScore } = calculateTotalScore("technical");

        const draftPayload = {
          experience: technicalData.experience?.score || 0,
          expertise: technicalData.expertise?.score || 0,
          resources: technicalData.resources?.score || 0,
          timeline: technicalData.timeline?.score || 0,
          quality: technicalData.quality?.score || 0,
          totalRating: totalScore,
          notes: notes || "",
          isDraft: true,
        };

        console.log("Saving technical evaluation draft:", draftPayload);

        // Make API call to save technical evaluation draft
        const response = await api.patch(
          `/v1/bids/${bid.id}/technical-evaluation`,
          {
            body: draftPayload,
            showToasts: true,
            successMessageKey: "message",
          }
        );

        console.log("Technical evaluation draft saved:", response);

        // Update the bid with the new draft technical evaluation data
        if (onEvaluationUpdate && response.data) {
          const updatedBid = {
            ...bid.raw,
            technicalEvaluation: response.data.technicalEvaluation || {
              experience: draftPayload.experience,
              expertise: draftPayload.expertise,
              resources: draftPayload.resources,
              timeline: draftPayload.timeline,
              quality: draftPayload.quality,
              totalRating: draftPayload.totalRating,
              notes: draftPayload.notes,
              isDraft: draftPayload.isDraft,
            },
            status: response.data.status || bid.raw.status,
          };
          onEvaluationUpdate({ ...bid, raw: updatedBid });
        }
      } else if (activeTab === "financial") {
        // Prepare financial evaluation draft data
        const financialData = scores.financial;
        const { totalScore } = calculateTotalScore("financial");

        const draftPayload = {
          costEffectiveness: financialData.costEffectiveness?.score || 0,
          paymentTerms: financialData.paymentTerms?.score || 0,
          totalCost: financialData.totalCost?.score || 0,
          valueForMoney: financialData.valueForMoney?.score || 0,
          totalRating: totalScore,
          notes: notes || "",
          isDraft: true,
        };

        console.log("Saving financial evaluation draft:", draftPayload);

        // Make API call to save financial evaluation draft
        const response = await api.patch(
          `/v1/bids/${bid.id}/financial-evaluation`,
          {
            body: draftPayload,
            showToasts: true,
            successMessageKey: "message",
          }
        );

        console.log("Financial evaluation draft saved:", response);

        // Update the bid with the new draft financial evaluation data
        if (onEvaluationUpdate && response.data) {
          const updatedBid = {
            ...bid.raw,
            financialEvaluation: response.data.financialEvaluation || {
              costEffectiveness: draftPayload.costEffectiveness,
              paymentTerms: draftPayload.paymentTerms,
              totalCost: draftPayload.totalCost,
              valueForMoney: draftPayload.valueForMoney,
              totalRating: draftPayload.totalRating,
              notes: draftPayload.notes,
              isDraft: draftPayload.isDraft,
            },
            status: response.data.status || bid.raw.status,
          };
          onEvaluationUpdate({ ...bid, raw: updatedBid });
        }
      }
    } catch (error) {
      console.error("Error saving evaluation draft:", error);
      // Error toast will be shown automatically by the API service
    }
  };

  const handleCompleteEvaluation = async () => {
    try {
      if (activeTab === "technical") {
        // Prepare technical evaluation data
        const technicalData = scores.technical;
        const { totalScore } = calculateTotalScore("technical");

        const evaluationPayload = {
          experience: technicalData.experience?.score || 0,
          expertise: technicalData.expertise?.score || 0,
          resources: technicalData.resources?.score || 0,
          timeline: technicalData.timeline?.score || 0,
          quality: technicalData.quality?.score || 0,
          totalRating: totalScore,
          notes: notes || "",
        };

        console.log("Submitting technical evaluation:", evaluationPayload);

        // Make API call to complete technical evaluation
        const response = await api.patch(
          `/v1/bids/${bid.id}/technical-evaluation`,
          {
            body: evaluationPayload,
            showToasts: true,
            successMessageKey: "message",
          }
        );

        console.log("Technical evaluation completed successfully:", response);

        // Update the bid with the new technical evaluation data
        if (onEvaluationUpdate && response.data) {
          const updatedBid = {
            ...bid.raw,
            technicalEvaluation: response.data.technicalEvaluation || {
              experience: evaluationPayload.experience,
              expertise: evaluationPayload.expertise,
              resources: evaluationPayload.resources,
              timeline: evaluationPayload.timeline,
              quality: evaluationPayload.quality,
              totalRating: evaluationPayload.totalRating,
              notes: evaluationPayload.notes,
            },
            status: response.data.status || "technical",
          };
          onEvaluationUpdate({ ...bid, raw: updatedBid });
        }

        onClose();
      } else if (activeTab === "financial") {
        // Prepare financial evaluation data
        const financialData = scores.financial;
        const { totalScore } = calculateTotalScore("financial");

        const evaluationPayload = {
          costEffectiveness: financialData.costEffectiveness?.score || 0,
          paymentTerms: financialData.paymentTerms?.score || 0,
          totalCost: financialData.totalCost?.score || 0,
          valueForMoney: financialData.valueForMoney?.score || 0,
          totalRating: totalScore,
          notes: notes || "",
          isDraft: false,
        };

        console.log("Submitting financial evaluation:", evaluationPayload);

        // Make API call to complete financial evaluation
        const response = await api.patch(
          `/v1/bids/${bid.id}/financial-evaluation`,
          {
            body: evaluationPayload,
            showToasts: true,
            successMessageKey: "message",
          }
        );

        console.log("Financial evaluation completed successfully:", response);

        // Update the bid with the new financial evaluation data
        if (onEvaluationUpdate && response.data) {
          const updatedBid = {
            ...bid.raw,
            financialEvaluation: response.data.financialEvaluation || {
              costEffectiveness: evaluationPayload.costEffectiveness,
              paymentTerms: evaluationPayload.paymentTerms,
              totalCost: evaluationPayload.totalCost,
              valueForMoney: evaluationPayload.valueForMoney,
              totalRating: evaluationPayload.totalRating,
              notes: evaluationPayload.notes,
              isDraft: evaluationPayload.isDraft,
            },
            status: response.data.status || "financial",
          };
          onEvaluationUpdate({ ...bid, raw: updatedBid });
        }

        onClose();
      }
    } catch (error) {
      console.error("Error completing evaluation:", error);
      // Error toast will be shown automatically by the API service
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      // If the document has a direct URL, use it for download
      if (doc.file && doc.file.url) {
        const link = document.createElement("a");
        link.href = doc.file.url;
        link.download = doc.name || "document";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const renderDocuments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(bid.documents || []).map((doc, index) => (
        <div
          key={doc._id || index}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 text-sm truncate">
                {doc.name || doc.file?.fileName || `Document ${index + 1}`}
              </div>
              <div className="text-xs text-gray-500">
                {doc.category && (
                  <span className="capitalize">{doc.category} • </span>
                )}
                {doc.file?.mimeType && <span>{doc.file.mimeType}</span>}
              </div>
              {doc.description && (
                <div
                  className="text-xs text-gray-600 truncate mt-1"
                  title={doc.description}
                >
                  {doc.description}
                </div>
              )}
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-blue-100 text-blue-600 px-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{doc.tags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => handleDownloadDocument(doc)}
              className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
              title={`Download ${doc.name || doc.file?.fileName || "document"}`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      {bid.quotation && (
        <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-green-900 text-sm">
                Quotation Document
              </div>
              <div className="text-xs text-green-700">Financial proposal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() =>
                handleDownloadDocument({
                  _id: bid.quotation,
                  name: "Quotation",
                  file: { url: `/api/documents/${bid.quotation}` },
                })
              }
              className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-100"
              title="Download Quotation"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderEvaluationCriteria = (category) => {
    const criteria = scores[category];
    const { totalScore, maxScore } = calculateTotalScore(category);

    // Handle case where criteria is undefined or null
    if (!criteria || typeof criteria !== "object") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {category === "technical"
                ? "Technical Bid Evaluation"
                : "Financial Bid Evaluation"}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">0/0</div>
              <div className="text-sm text-gray-500">Total Score</div>
            </div>
          </div>
          <div className="text-center text-gray-500 py-8">
            No evaluation criteria available for this category.
          </div>
        </div>
      );
    }

    const criteriaLabels = {
      technical: {
        experience: {
          label: "Experience",
          description: "Relevant experience in highway construction",
        },
        expertise: {
          label: "Expertise",
          description: "Technical expertise and methodology",
        },
        resources: {
          label: "Resources",
          description: "Available resources and equipment",
        },
        timeline: {
          label: "Timeline",
          description: "Project timeline and milestones",
        },
        quality: {
          label: "Quality",
          description: "Quality assurance and safety measures",
        },
      },
      financial: {
        costEffectiveness: {
          label: "Cost Effectiveness",
          description: "Overall cost effectiveness of the proposal",
        },
        paymentTerms: {
          label: "Payment Terms",
          description: "Flexibility and reasonableness of payment terms",
        },
        totalCost: {
          label: "Total Cost",
          description: "Competitiveness of total project cost",
        },
        valueForMoney: {
          label: "Value for Money",
          description: "Overall value proposition offered",
        },
      },
    };

    return (
      <div className="space-y-6">
        {/* Header with Total Score */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {category === "technical"
              ? "Technical Bid Evaluation"
              : "Financial Bid Evaluation"}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {totalScore}/{maxScore}
            </div>
            <div className="text-sm text-gray-500">Total Score</div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-4">
          {Object.entries(criteria).map(([key, criterion]) => {
            const criterionInfo = criteriaLabels[category]?.[key];

            // Handle case where criterionInfo doesn't exist
            if (!criterionInfo) {
              return null;
            }

            // Handle case where criterion is invalid
            if (!criterion || typeof criterion !== "object") {
              return null;
            }

            const score =
              typeof criterion.score === "number" ? criterion.score : 0;
            const maxScore =
              typeof criterion.maxScore === "number" ? criterion.maxScore : 0;
            const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

            return (
              <div
                key={key}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-base">
                      {criterionInfo.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {criterionInfo.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="number"
                      min="0"
                      max={maxScore}
                      value={score}
                      onChange={(e) =>
                        handleScoreChange(category, key, e.target.value)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="text-gray-500 text-sm">/ {maxScore}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Score Percentage */}
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Evaluation Notes */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-base">
            Evaluation Notes
          </h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your evaluation notes and comments here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        {/* Submitted Documents */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-base">
            Submitted Documents
          </h4>
          {renderDocuments()}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {bid.tenderTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Bid Evaluation -{" "}
              {activeTab === "technical"
                ? "Technical Assessment"
                : "Financial Assessment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Vendor Info - Fixed */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Vendor</span>
              <div className="font-semibold text-gray-900 truncate">
                {bid.vendorName}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {bid.vendorEmail}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {bid.vendorPhone}
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Tender</span>
              <div className="font-semibold text-gray-900 truncate">
                {bid.tenderTitle}
              </div>
              <div className="text-sm text-gray-600">ID: {bid.tenderId}</div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Bid Amount</span>
              <div className="font-semibold text-green-600 text-lg">
                {bid.bidAmount}
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Timeline</span>
              <div className="font-semibold text-gray-900">{bid.timeline}</div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Status</span>
              <div className="flex items-center gap-2">
                {bid.status === "completed" ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                )}
                <span
                  className={`font-medium ${
                    bid.status === "completed"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {bid.status === "pending"
                    ? "Pending Evaluation"
                    : bid.status === "technical"
                    ? "Technical Review"
                    : bid.status === "financial"
                    ? "Financial Review"
                    : bid.status === "completed"
                    ? "Evaluation Complete"
                    : "Under Evaluation"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Submitted: {bid.submissionDate.split(" ")[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab("technical")}
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center gap-2 ${
                activeTab === "technical"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Technical Evaluation
              {bid.technicalEvaluation && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "financial"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              💰 Financial Evaluation
              {bid.financialEvaluation && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </button>
          </nav>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Bid Summary Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Bid Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500 block">
                    Proposed Amount
                  </span>
                  <div className="font-semibold text-green-600 text-lg">
                    {bid.bidAmount}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Completion Timeline
                  </span>
                  <div className="font-semibold text-gray-900">
                    {bid.timeline}
                  </div>
                </div>
              </div>
              {bid.notes && (
                <div>
                  <span className="text-sm text-gray-500 block mb-2">
                    Vendor Summary
                  </span>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                    {bid.notes}
                  </p>
                </div>
              )}

              {/* Documents Section */}
              <div className="mt-4">
                <span className="text-sm text-gray-500 block mb-3">
                  Submitted Documents
                </span>
                {renderDocuments()}
              </div>
            </div>

            {/* Evaluation Criteria */}
            {renderEvaluationCriteria(activeTab)}
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 gap-3">
          <button
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Save Draft
          </button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteEvaluation}
              className="flex-1 sm:flex-none px-6 py-2 bg-primary-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {(() => {
                const isCompleted =
                  activeTab === "technical"
                    ? bid.technicalEvaluation
                    : bid.financialEvaluation;
                const action = isCompleted ? "Update" : "Complete";
                const type =
                  activeTab === "technical" ? "Technical" : "Financial";
                return `${action} ${type} Evaluation`;
              })()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
