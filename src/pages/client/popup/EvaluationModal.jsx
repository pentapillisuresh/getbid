import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Download,
  Eye,
  ChevronDown,
  Check,
  Award,
  CheckCircle,
} from "lucide-react";
import AwardContractModal from "./AwardContractModal";
import DisqualifyBidModal from "./DisqualifyBidModal";
import TechnicalReportModal from "./TechnicalReportModal";
import FinancialReportModal from "./FinancialReportModal";
import {
  submitTechnicalEvaluation,
  submitFinancialEvaluation,
  getTenderBids,
  completeTechnicalEvaluation,
  completeFinancialEvaluation,
  awardContract,
} from "../../../services/tenderApiService";
import toast from "../../../services/toastService";

const EvaluationModal = ({ tender, evaluationType = "technical", onClose }) => {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [technicalScores, setTechnicalScores] = useState({
    experience: 0,
    expertise: 0,
    resources: 0,
    timeline: 0,
    quality: 0,
  });
  const [financialScores, setFinancialScores] = useState({
    costBreakdown: 0,
    paymentTerms: 0,
    financialStability: 0,
    valueForMoney: 0,
  });
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [currentEvaluationType, setCurrentEvaluationType] =
    useState(evaluationType);

  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [disqualifyModalOpen, setDisqualifyModalOpen] = useState(false);
  const [technicalReportModalOpen, setTechnicalReportModalOpen] =
    useState(false);
  const [financialReportModalOpen, setFinancialReportModalOpen] =
    useState(false);
  const [completeTechnicalModalOpen, setCompleteTechnicalModalOpen] =
    useState(false);
  const [completeFinancialModalOpen, setCompleteFinancialModalOpen] =
    useState(false);
  const [bidDetailsModalOpen, setBidDetailsModalOpen] = useState(false);
  const [selectedBidForDetails, setSelectedBidForDetails] = useState(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [technicalEvaluationCompleted, setTechnicalEvaluationCompleted] =
    useState(false);

  // Fetch bids function that can be reused
  const fetchBids = async (preserveSelection = true) => {
    if (!tender._id) return;

    try {
      const currentlySelectedBidId = selectedBid?._id;
      setLoading(true);
      const response = await getTenderBids({
        tender: tender._id,
        page: 1,
        limit: 100,
      });

      if (response.success) {
        setBids(response.data);

        // Set first bid as selected if available and no bid is currently selected
        if (response.data.length > 0) {
          let bidToSelect;

          if (preserveSelection && currentlySelectedBidId) {
            // Try to find the previously selected bid in the new data
            bidToSelect = response.data.find(
              (bid) => bid._id === currentlySelectedBidId
            );
          }

          // If not found or not preserving selection, use first bid
          if (!bidToSelect) {
            bidToSelect = response.data[0];
          }

          setSelectedBid(bidToSelect);
        }
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.showError("Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bids when modal opens
  useEffect(() => {
    fetchBids(false); // Don't preserve selection on initial load
  }, [tender._id]);

  // Load evaluation data when selected bid changes
  useEffect(() => {
    if (selectedBid && selectedBid.technicalEvaluation) {
      const techEval = selectedBid.technicalEvaluation;
      setTechnicalScores({
        experience: techEval.experience || 0,
        expertise: techEval.expertise || 0,
        resources: techEval.resources || 0,
        timeline: techEval.timeline || 0,
        quality: techEval.quality || 0,
      });
      setNotes(techEval.notes || "");

      // Set approval status based on bid status and evaluation
      if (selectedBid.status === "approved" && !techEval.isDraft) {
        setIsApproved(true);
        setIsDisqualified(false);
      } else if (
        selectedBid.status === "rejected" ||
        selectedBid.status === "disqualified"
      ) {
        setIsDisqualified(true);
        setIsApproved(false);
      } else {
        setIsApproved(false);
        setIsDisqualified(false);
      }
    } else {
      // Reset scores and status if no evaluation exists
      setTechnicalScores({
        experience: 0,
        expertise: 0,
        resources: 0,
        timeline: 0,
        quality: 0,
      });
      setNotes("");

      // Check if bid is disqualified even without technical evaluation
      if (
        selectedBid &&
        (selectedBid.status === "rejected" ||
          selectedBid.status === "disqualified")
      ) {
        setIsDisqualified(true);
        setIsApproved(false);
      } else {
        setIsApproved(false);
        setIsDisqualified(false);
      }
    }
  }, [selectedBid]);

  const technicalCriteria = [
    {
      key: "experience",
      label: "Experience",
      maxScore: 25,
      description: "Relevant experience in highway construction",
    },
    {
      key: "expertise",
      label: "Expertise",
      maxScore: 25,
      description: "Technical expertise and methodology",
    },
    {
      key: "resources",
      label: "Resources",
      maxScore: 20,
      description: "Available resources and equipment",
    },
    {
      key: "timeline",
      label: "Timeline",
      maxScore: 15,
      description: "Project timeline and milestones",
    },
    {
      key: "quality",
      label: "Quality",
      maxScore: 15,
      description: "Quality assurance and safety measures",
    },
  ];

  const financialCriteria = [
    {
      key: "costBreakdown",
      label: "Cost Breakdown",
      maxScore: 30,
      description: "Detailed cost analysis and breakdown",
    },
    {
      key: "paymentTerms",
      label: "Payment Terms",
      maxScore: 20,
      description: "Payment schedule and terms",
    },
    {
      key: "financialStability",
      label: "Financial Stability",
      maxScore: 25,
      description: "Financial standing and stability",
    },
    {
      key: "valueForMoney",
      label: "Value for Money",
      maxScore: 25,
      description: "Overall value proposition",
    },
  ];

  const approvedBidders = [
    {
      rank: 1,
      vendorName: "Modern Builders Ltd",
      contactPerson: "Neha Sharma",
      technicalScore: "78/100",
      bidAmount: "₹7.90 Cr",
      variance: "-7.1%",
      status: "L1 (Lowest)",
    },
    {
      rank: 2,
      vendorName: "Education Infrastructure Corp",
      contactPerson: "Rajesh Kumar",
      technicalScore: "85/100",
      bidAmount: "₹8.20 Cr",
      variance: "-3.5%",
      status: "L2",
    },
  ];

  const currentCriteria =
    currentEvaluationType === "technical"
      ? technicalCriteria
      : financialCriteria;
  const currentScores =
    currentEvaluationType === "technical" ? technicalScores : financialScores;
  const setCurrentScores =
    currentEvaluationType === "technical"
      ? setTechnicalScores
      : setFinancialScores;

  const handleScoreChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    const criterion = currentCriteria.find((c) => c.key === key);
    const maxScore = criterion ? criterion.maxScore : 100;

    if (numValue >= 0 && numValue <= maxScore) {
      setCurrentScores((prev) => ({
        ...prev,
        [key]: numValue,
      }));
    }
  };

  const calculateTotalScore = () => {
    return Object.values(currentScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateMaxScore = () => {
    return currentCriteria.reduce(
      (sum, criterion) => sum + criterion.maxScore,
      0
    );
  };

  const handleCompleteTechnicalEvaluation = () => {
    // Check if there are any approved bids
    const approvedBids = bids.filter((bid) => bid.status === "approved");

    if (approvedBids.length === 0) {
      toast.showError(
        "At least 1 bid should be approved to complete technical evaluation"
      );
      return;
    }

    // If there are approved bids, show the completion modal
    setCompleteTechnicalModalOpen(true);
  };

  const handleFinalizeTechnicalEvaluation = async () => {
    if (!confirmationChecked) {
      toast.showError(
        "Please confirm that all technical evaluations have been completed accurately"
      );
      return;
    }

    setSubmitting(true);

    try {
      // Call the API to complete technical evaluation
      await completeTechnicalEvaluation(tender._id);

      // Show success message
      toast.showSuccess("Technical evaluation completed successfully");

      // Mark technical evaluation as completed
      setTechnicalEvaluationCompleted(true);

      // Switch to Financial Evaluation tab
      setCurrentEvaluationType("financial");

      // Close only the completion modal (not the parent modal)
      setCompleteTechnicalModalOpen(false);
    } catch (error) {
      console.error("Error completing technical evaluation:", error);
      toast.showError(
        "Failed to complete technical evaluation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteFinancialEvaluation = () => {
    // Check if there are any awarded bids
    const awardedBids = bids.filter((bid) => bid.status === "awarded");

    if (awardedBids.length === 0) {
      toast.showError(
        "At least 1 bid should be awarded to complete financial evaluation"
      );
      return;
    }

    // Reset confirmation checkbox and show the financial completion modal
    setConfirmationChecked(false);
    setCompleteFinancialModalOpen(true);
  };

  const handleFinalizeFinancialEvaluation = async () => {
    if (!confirmationChecked) {
      toast.showError(
        "Please confirm that the financial evaluation is complete and all contract awards have been finalized"
      );
      return;
    }

    setSubmitting(true);

    try {
      // Call the API to complete financial evaluation
      await completeFinancialEvaluation(tender._id);

      // Show success message
      toast.showSuccess("Financial evaluation completed successfully");

      // Close the completion modal and parent modal
      setCompleteFinancialModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error completing financial evaluation:", error);
      toast.showError(
        "Failed to complete financial evaluation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!selectedBid) {
      toast.showError("No bid selected for evaluation");
      return;
    }

    setSubmitting(true);

    try {
      const totalScore = calculateTotalScore();

      if (currentEvaluationType === "technical") {
        const evaluationData = {
          experience: technicalScores.experience,
          expertise: technicalScores.expertise,
          resources: technicalScores.resources,
          timeline: technicalScores.timeline,
          quality: technicalScores.quality,
          totalRating: totalScore,
          notes: notes,
          isDraft: isDraft,
        };

        await submitTechnicalEvaluation(selectedBid._id, evaluationData);
        toast.showSuccess(
          isDraft
            ? "Technical evaluation saved as draft"
            : "Technical evaluation submitted successfully"
        );

        // Refresh the bid data to get updated status
        await fetchBids();
      } else if (currentEvaluationType === "financial") {
        const evaluationData = {
          costBreakdown: financialScores.costBreakdown,
          paymentTerms: financialScores.paymentTerms,
          financialStability: financialScores.financialStability,
          valueForMoney: financialScores.valueForMoney,
          totalRating: totalScore,
          notes: notes,
          isDraft: isDraft,
        };

        await submitFinancialEvaluation(selectedBid._id, evaluationData);
        toast.showSuccess(
          isDraft
            ? "Financial evaluation saved as draft"
            : "Financial evaluation submitted successfully"
        );
      }

      // Refresh the bid data to get updated status
      await fetchBids();

      onClose();
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.showError("Failed to submit evaluation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedBid) {
      toast.showError("No bid selected for evaluation");
      return;
    }

    // Validate that scores have been entered
    const totalScore = calculateTotalScore();
    if (totalScore === 0) {
      toast.showError(
        "Please enter evaluation scores before approving the bid"
      );
      return;
    }

    setSubmitting(true);

    try {
      // Submit technical evaluation when approving
      const evaluationData = {
        experience: technicalScores.experience,
        expertise: technicalScores.expertise,
        resources: technicalScores.resources,
        timeline: technicalScores.timeline,
        quality: technicalScores.quality,
        totalRating: totalScore,
        notes: notes,
        isDraft: false, // Final submission when approving
      };

      await submitTechnicalEvaluation(selectedBid._id, evaluationData);

      // Refresh the bid data to get updated status
      await fetchBids();

      setIsApproved(true);
      setIsDisqualified(false);

      toast.showSuccess("Bid approved successfully");
      // setAwardModalOpen(true);
    } catch (error) {
      console.error("Error approving bid:", error);
      toast.showError("Failed to approve bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisqualify = () => {
    setIsDisqualified(true);
    setIsApproved(false);
    setDisqualifyModalOpen(true);
  };

  const handleAwardConfirm = async (formData) => {
    try {
      console.log("Award confirmed:", formData);

      if (!selectedBid?._id) {
        toast.showError("No bid selected for award");
        return;
      }

      setSubmitting(true);

      const response = await awardContract(selectedBid._id, formData);

      if (response.success) {
        toast.showSuccess("Contract awarded successfully");

        // Refresh the bid data to get updated status
        await fetchBids();

        // Close the award modal
        setAwardModalOpen(false);
      }
    } catch (error) {
      console.error("Error awarding contract:", error);
      toast.showError("Failed to award contract. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisqualifyConfirm = async (reason) => {
    console.log("Disqualify confirmed:", reason);

    // Refresh the bid data to get updated status
    await fetchBids();

    // Update local state
    setIsDisqualified(true);
    setIsApproved(false);
  };

  const handleAwardBid = (bidder) => {
    console.log("Awarding bid to:", bidder);
    setSelectedBid(bidder);
    setAwardModalOpen(true);
  };

  const handleShowBidDetails = (bid) => {
    setSelectedBidForDetails(bid);
    setBidDetailsModalOpen(true);
  };

  const handleGenerateTechnicalReport = () => {
    setTechnicalReportModalOpen(true);
  };

  const handleGenerateFinancialReport = () => {
    setFinancialReportModalOpen(true);
  };

  // Check tender status to determine tab accessibility
  const canAccessTechnical =
    tender.status !== "technical-evaluation" && !technicalEvaluationCompleted;
  const canAccessFinancial = true;

  // If tender status is "technical-evaluation", automatically switch to Financial Evaluation
  useEffect(() => {
    if (tender.status === "technical-evaluation") {
      setCurrentEvaluationType("financial");
    }
  }, [tender.status]);

  const submittedDocuments = [
    { name: "Technical Proposal", size: "5.2 MB", checked: false },
    { name: "Company Profile", size: "8.5 MB", checked: true },
    { name: "Financial Proposal", size: "2.1 MB", checked: false },
    { name: "Experience Certificates", size: "12.3 MB", checked: true },
  ];

  const renderFinancialEvaluation = () => {
    // Get approved and awarded bids and sort by amount (lowest first)
    const eligibleBids = bids
      .filter((bid) => bid.status === "approved" || bid.status === "awarded")
      .sort((a, b) => (a.amount || 0) - (b.amount || 0));

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">
              Approved and awarded bidders are shown for financial evaluation.
            </p>
          </div>
        </div>

        {eligibleBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Eligible Bids
            </h3>
            <p className="text-gray-600 text-center">
              There are no approved or awarded bids available for financial
              evaluation.
              <br />
              Please complete the technical evaluation first.
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technical Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bid Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eligibleBids.map((bid, index) => {
                  const totalScore = bid.technicalEvaluation
                    ? Object.values({
                        experience: bid.technicalEvaluation.experience || 0,
                        expertise: bid.technicalEvaluation.expertise || 0,
                        resources: bid.technicalEvaluation.resources || 0,
                        timeline: bid.technicalEvaluation.timeline || 0,
                        quality: bid.technicalEvaluation.quality || 0,
                      }).reduce((sum, score) => sum + score, 0)
                    : 0;

                  return (
                    <tr key={bid._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {bid.user?.company?.name || bid.user?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bid.user?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalScore}/100
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{bid.amount ? bid.amount.toLocaleString() : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              index === 0
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {index === 0 ? "L1 (Lowest)" : `L${index + 1}`}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              bid.status === "awarded"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {bid.status === "awarded" ? "Awarded" : "Approved"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {bid.status === "awarded" ? (
                            <span className="text-purple-600 font-medium">
                              Contract Awarded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAwardBid(bid)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Award
                            </button>
                          )}
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleShowBidDetails(bid)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTechnicalEvaluation = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Technical Bid Evaluation
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="font-medium">
                {selectedBid
                  ? selectedBid.user?.name || `Bid #${selectedBid._id}`
                  : "No bid selected"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && bids && bids.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {bids.map((bid, index) => (
                  <button
                    key={bid._id || index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedBid(bid);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {bid.user?.name || `Bid #${bid._id}` || `Bid ${index + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedBid?.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : selectedBid?.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : selectedBid?.status === "rejected" ||
                    selectedBid?.status === "disqualified"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {selectedBid?.status === "pending"
                ? "Pending"
                : selectedBid?.status === "approved"
                ? "Approved"
                : selectedBid?.status === "rejected" ||
                  selectedBid?.status === "disqualified"
                ? "Disqualified"
                : "Unknown"}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Vendor: {selectedBid?.user?.name || "N/A"}</p>
          <p>Company: {selectedBid?.user?.company?.name || "N/A"}</p>
          <p>
            Amount:{" "}
            {selectedBid?.amount
              ? `₹${selectedBid.amount.toLocaleString()}`
              : "N/A"}
          </p>
          <p>Timeline: {selectedBid?.timeline || "N/A"}</p>
          <p>Summary: {selectedBid?.summary || "N/A"}</p>
          <p>
            Submitted:{" "}
            {selectedBid?.createdAt
              ? new Date(selectedBid.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Evaluation Criteria</h4>

        <div className="space-y-4">
          {currentCriteria.map((criterion) => {
            const score = currentScores[criterion.key];
            const percentage = (score / criterion.maxScore) * 100;

            return (
              <div
                key={criterion.key}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {criterion.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <input
                      type="number"
                      min="0"
                      max={criterion.maxScore}
                      value={score}
                      onChange={(e) =>
                        handleScoreChange(criterion.key, e.target.value)
                      }
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500 text-sm">
                      / {criterion.maxScore}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Technical Score</h4>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {calculateTotalScore()}/{calculateMaxScore()}
            </div>
            <button className="text-blue-600 text-sm mt-1 hover:underline">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Manager Q&A</h4>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="text-gray-500 text-sm">No questions yet</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Submitted Documents</h4>
        <div className="space-y-3">
          {selectedBid?.documents && selectedBid.documents.length > 0 ? (
            selectedBid.documents.map((doc, index) => (
              <div
                key={doc._id || index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {doc.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc.category} • {doc.description || "No description"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {doc.expiryDate &&
                        `Expires: ${new Date(
                          doc.expiryDate
                        ).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No documents submitted</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Evaluation Notes</h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your evaluation notes and comments here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={!selectedBid || submitting || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isApproved
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Approving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Approve Bid
              </>
            )}
          </button>
          <button
            onClick={handleDisqualify}
            disabled={submitting || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isDisqualified
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
            }`}
          >
            <X className="w-4 h-4" />
            Disqualify Bid
          </button>
        </div>

        <button
          onClick={handleGenerateTechnicalReport}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Generate Technical Report
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                {tender.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Bid Evaluation -{" "}
                {currentEvaluationType === "technical"
                  ? "Technical Assessment"
                  : "Financial Assessment"}
              </p>
              <div className="flex mt-2">
                <button
                  onClick={() =>
                    canAccessTechnical && setCurrentEvaluationType("technical")
                  }
                  disabled={!canAccessTechnical}
                  className={`mr-4 font-medium ${
                    currentEvaluationType === "technical"
                      ? "text-blue-600"
                      : canAccessTechnical
                      ? "text-gray-400 hover:text-gray-600"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Technical Evaluation
                </button>
                <button
                  onClick={() =>
                    canAccessFinancial && setCurrentEvaluationType("financial")
                  }
                  disabled={!canAccessFinancial}
                  className={`font-medium ${
                    currentEvaluationType === "financial"
                      ? "text-blue-600"
                      : canAccessFinancial
                      ? "text-gray-400 hover:text-gray-600"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Financial Evaluation
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Loading Bids...
                </h3>
                <p className="text-gray-600 text-center">
                  Please wait while we fetch the bid information.
                </p>
              </div>
            ) : bids.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Bids Available
                </h3>
                <p className="text-gray-600 text-center">
                  There are no bids submitted for this tender yet.
                  <br />
                  Please wait for vendors to submit their bids.
                </p>
              </div>
            ) : currentEvaluationType === "financial" ? (
              renderFinancialEvaluation()
            ) : (
              renderTechnicalEvaluation()
            )}
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit(true)}
                disabled={!selectedBid || submitting || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => {
                  if (currentEvaluationType === "financial") {
                    // Check if tender is already in final stages
                    if (
                      tender.status === "financial-evaluation" ||
                      tender.status === "completed"
                    ) {
                      // Do nothing or show info message
                      return;
                    }
                    handleCompleteFinancialEvaluation();
                  } else {
                    // For technical evaluation, check for approved bids instead of API call
                    handleCompleteTechnicalEvaluation();
                  }
                }}
                disabled={
                  !selectedBid ||
                  submitting ||
                  loading ||
                  (currentEvaluationType === "financial" &&
                    (tender.status === "financial-evaluation" ||
                      tender.status === "completed"))
                }
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Submitting..."
                  : currentEvaluationType === "technical"
                  ? "Complete Technical Evaluation"
                  : tender.status === "financial-evaluation" ||
                    tender.status === "completed"
                  ? "Evaluation Complete"
                  : "Complete Financial Evaluation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {awardModalOpen && (
        <AwardContractModal
          bid={selectedBid}
          tender={tender}
          onClose={() => setAwardModalOpen(false)}
          onConfirm={handleAwardConfirm}
        />
      )}

      {disqualifyModalOpen && (
        <DisqualifyBidModal
          bid={selectedBid}
          tender={tender}
          onClose={() => setDisqualifyModalOpen(false)}
          onConfirm={handleDisqualifyConfirm}
        />
      )}

      {technicalReportModalOpen && (
        <TechnicalReportModal
          tender={tender}
          onClose={() => setTechnicalReportModalOpen(false)}
        />
      )}

      {financialReportModalOpen && (
        <FinancialReportModal
          tender={tender}
          onClose={() => setFinancialReportModalOpen(false)}
        />
      )}

      {bidDetailsModalOpen && selectedBidForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Bid Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Complete information for{" "}
                  {selectedBidForDetails.user?.company?.name ||
                    selectedBidForDetails.user?.name ||
                    "N/A"}
                </p>
              </div>
              <button
                onClick={() => setBidDetailsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Bid Overview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Bid Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Vendor Name
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedBidForDetails.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="text-sm text-gray-900">
                      {selectedBidForDetails.user?.company?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Bid Amount
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {selectedBidForDetails.amount
                        ? `₹${selectedBidForDetails.amount.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedBidForDetails.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedBidForDetails.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedBidForDetails.status === "rejected" ||
                            selectedBidForDetails.status === "disqualified"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedBidForDetails.status === "pending"
                        ? "Pending"
                        : selectedBidForDetails.status === "approved"
                        ? "Approved"
                        : selectedBidForDetails.status === "rejected" ||
                          selectedBidForDetails.status === "disqualified"
                        ? "Disqualified"
                        : "Unknown"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Timeline
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedBidForDetails.timeline || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Submitted Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedBidForDetails.createdAt
                        ? new Date(
                            selectedBidForDetails.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bid Summary */}
              {selectedBidForDetails.summary && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Bid Summary
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedBidForDetails.summary}
                  </p>
                </div>
              )}

              {/* Technical Evaluation */}
              {selectedBidForDetails.technicalEvaluation && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Technical Evaluation
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Experience
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.technicalEvaluation.experience ||
                          0}
                        /25
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Expertise
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.technicalEvaluation.expertise ||
                          0}
                        /25
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Resources
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.technicalEvaluation.resources ||
                          0}
                        /20
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Timeline
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.technicalEvaluation.timeline ||
                          0}
                        /15
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Quality
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.technicalEvaluation.quality || 0}
                        /15
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Score
                      </p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {Object.values({
                          experience:
                            selectedBidForDetails.technicalEvaluation
                              .experience || 0,
                          expertise:
                            selectedBidForDetails.technicalEvaluation
                              .expertise || 0,
                          resources:
                            selectedBidForDetails.technicalEvaluation
                              .resources || 0,
                          timeline:
                            selectedBidForDetails.technicalEvaluation
                              .timeline || 0,
                          quality:
                            selectedBidForDetails.technicalEvaluation.quality ||
                            0,
                        }).reduce((sum, score) => sum + score, 0)}
                        /100
                      </p>
                    </div>
                  </div>
                  {selectedBidForDetails.technicalEvaluation.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Evaluation Notes
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedBidForDetails.technicalEvaluation.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              {selectedBidForDetails.user && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.user.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">
                        {selectedBidForDetails.user.phone || "N/A"}
                      </p>
                    </div>
                    {selectedBidForDetails.user.company && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Company Address
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedBidForDetails.user.company.address ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Registration Number
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedBidForDetails.user.company
                              .registrationNumber || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedBidForDetails.documents &&
                selectedBidForDetails.documents.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Submitted Documents
                    </h4>
                    <div className="space-y-2">
                      {selectedBidForDetails.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {doc.name || `Document ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.type || "Unknown type"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setBidDetailsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {completeTechnicalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Complete Technical Evaluation
              </h3>
              <button
                onClick={() => setCompleteTechnicalModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Evaluation Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Technical Evaluation Summary
                    </h4>
                    <p className="text-sm text-blue-700">
                      Review and confirm technical evaluation completion
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Tender:</p>
                    <p className="text-sm text-blue-700">{tender.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Total Bids:
                    </p>
                    <p className="text-sm text-blue-700">{bids.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Approved Bids:
                    </p>
                    <p className="text-sm text-blue-700">
                      {bids.filter((bid) => bid.status === "approved").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Disqualified Bids:
                    </p>
                    <p className="text-sm text-blue-700">
                      {
                        bids.filter(
                          (bid) =>
                            bid.status === "rejected" ||
                            bid.status === "disqualified"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Scores Summary */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Technical Scores Summary
                </h4>
                <div className="space-y-3">
                  {bids
                    .filter((bid) => bid.status === "approved")
                    .map((bid, index) => {
                      const totalScore = bid.technicalEvaluation
                        ? Object.values({
                            experience: bid.technicalEvaluation.experience || 0,
                            expertise: bid.technicalEvaluation.expertise || 0,
                            resources: bid.technicalEvaluation.resources || 0,
                            timeline: bid.technicalEvaluation.timeline || 0,
                            quality: bid.technicalEvaluation.quality || 0,
                          }).reduce((sum, score) => sum + score, 0)
                        : 0;
                      const percentage = ((totalScore / 100) * 100).toFixed(1);

                      return (
                        <div
                          key={bid._id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {bid.user?.company?.name ||
                                bid.user?.name ||
                                `Bidder ${index + 1}`}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {bid.user?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {totalScore}/100
                            </div>
                            <div className="text-sm text-gray-600">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">
                      Next Steps:
                    </h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>
                        • Technical evaluation will be marked as completed
                      </li>
                      <li>
                        • System will automatically move to financial evaluation
                        phase
                      </li>
                      <li>
                        • Only approved bidders will be considered for financial
                        evaluation
                      </li>
                      <li>
                        • Technical scores will be finalized and cannot be
                        modified
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-yellow-900">
                      Confirmation Required:
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                      I confirm that all technical evaluations have been
                      completed accurately and I have the authority to finalize
                      this evaluation phase. This action cannot be reversed once
                      submitted.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setCompleteTechnicalModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Review Again
              </button>
              <button
                onClick={handleFinalizeTechnicalEvaluation}
                disabled={!confirmationChecked || submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Technical Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {completeFinancialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Complete Financial Evaluation
              </h3>
              <button
                onClick={() => setCompleteFinancialModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Financial Evaluation Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">
                      Complete Evaluation Process
                    </h4>
                    <p className="text-sm text-green-700">
                      Finalize the entire tender evaluation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Tender:
                    </p>
                    <p className="text-sm text-green-700">{tender.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Awards Made:
                    </p>
                    <p className="text-sm text-green-700">
                      {bids.filter((bid) => bid.status === "awarded").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-yellow-900">
                      Final Confirmation:
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                      I confirm that the financial evaluation is complete and
                      all contract awards have been finalized. This will close
                      the evaluation process.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setCompleteFinancialModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalizeFinancialEvaluation}
                disabled={!confirmationChecked || submitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationModal;
