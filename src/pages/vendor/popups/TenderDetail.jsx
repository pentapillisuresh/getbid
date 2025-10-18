import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  IndianRupee,
  Award,
  Calendar,
} from "lucide-react";

const TenderDetail = ({ tender, onBack, onShowParticipants, onShowRebid }) => {
  const [activeSection, setActiveSection] = useState("overview");

  // Create evaluation steps based on bid data
  const createEvaluationSteps = () => {
    const steps = [
      {
        id: 1,
        title: "Submitted",
        date:
          tender.submittedDate ||
          new Date(tender.raw?.createdAt).toLocaleDateString(),
        status: "completed",
      },
      {
        id: 2,
        title: "Acknowledged",
        date:
          tender.submittedDate ||
          new Date(tender.raw?.createdAt).toLocaleDateString(),
        status: "completed",
      },
    ];

    // Add evaluation steps based on current status
    if (tender.status !== "submitted" && tender.status !== "draft") {
      steps.push({
        id: 3,
        title: "Under Review",
        date: "In Progress",
        status: "completed",
      });
    }

    if (tender.technicalEvaluation) {
      steps.push({
        id: 4,
        title: "Technical Evaluation",
        date: `Score: ${tender.technicalEvaluation.totalRating}/100`,
        status: "completed",
      });
    } else if (tender.status === "technical") {
      steps.push({
        id: 4,
        title: "Technical Evaluation",
        date: "In Progress",
        status: "current",
      });
    } else if (
      ["financial", "completed", "awarded", "rejected"].includes(tender.status)
    ) {
      steps.push({
        id: 4,
        title: "Technical Evaluation",
        date: "Pending",
        status: "pending",
      });
    }

    if (tender.financialEvaluation) {
      steps.push({
        id: 5,
        title: "Financial Evaluation",
        date: `Score: ${tender.financialEvaluation.totalRating}/100`,
        status: "completed",
      });
    } else if (tender.status === "financial") {
      steps.push({
        id: 5,
        title: "Financial Evaluation",
        date: "In Progress",
        status: "current",
      });
    } else {
      steps.push({
        id: 5,
        title: "Financial Evaluation",
        date: "Pending",
        status: "pending",
      });
    }

    steps.push({
      id: 6,
      title: "Decision",
      date:
        tender.status === "awarded"
          ? "Awarded"
          : tender.status === "rejected"
          ? "Rejected"
          : "Pending",
      status: ["awarded", "rejected"].includes(tender.status)
        ? "completed"
        : "pending",
    });

    return steps;
  };

  const evaluationSteps = createEvaluationSteps();

  // Create evaluation scores from actual data
  const evaluationScores = [];
  if (tender.technicalEvaluation) {
    evaluationScores.push({
      criteria: "Technical",
      score: tender.technicalEvaluation.totalRating,
      maxScore: 100,
      color: "bg-primary",
    });
  }
  if (tender.financialEvaluation) {
    evaluationScores.push({
      criteria: "Financial",
      score: tender.financialEvaluation.totalRating,
      maxScore: 100,
      color: "bg-green-500",
    });
  }

  // Map documents from actual data
  const documents =
    tender.documents?.map((doc) => ({
      name: doc.name || doc.file?.fileName || "Document",
      size: "Unknown size",
      uploaded: tender.submittedDate,
      category: doc.category,
      description: doc.description,
    })) || [];

  const getStepIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "current":
        return <Clock className="w-6 h-6 text-orange-500" />;
      case "pending":
        return <Clock className="w-6 h-6 text-gray-300" />;
      default:
        return <Clock className="w-6 h-6 text-gray-300" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bid Submissions
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tender.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>Bid ID: {tender.id}</span>
              <span>•</span>
              <span>Tender ID: {tender.tenderId}</span>
              <span>•</span>
              <span>Category: {tender.department}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {tender.statusText}
              </span>
              {tender.technicalEvaluation && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Technical: {tender.technicalEvaluation.totalRating}/100
                </span>
              )}
              {tender.financialEvaluation && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Financial: {tender.financialEvaluation.totalRating}/100
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Download Snapshot
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-blue-600 mb-2">
            Your Bid Amount
          </h3>
          <p className="text-2xl font-bold text-blue-900">{tender.bidAmount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-green-600 mb-2">Timeline</h3>
          <p className="text-2xl font-bold text-green-900">{tender.timeline}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-purple-600 mb-2">
            Tender Value
          </h3>
          <p className="text-2xl font-bold text-purple-900">
            {tender.tenderValue
              ? `₹${(tender.tenderValue / 100000).toFixed(1)}L`
              : "Not disclosed"}
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-orange-600 mb-2">Deadline</h3>
          <p className="text-2xl font-bold text-orange-900">
            {tender.deadline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Evaluation Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Evaluation Timeline
            </h2>
            <div className="space-y-4">
              {evaluationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                      {step.id}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium ${
                          step.status === "current"
                            ? "text-orange-600"
                            : step.status === "completed"
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <span
                        className={`text-sm ${
                          step.status === "current"
                            ? "text-orange-600"
                            : step.status === "completed"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.date}
                      </span>
                    </div>
                    {step.status === "current" && (
                      <p className="text-sm text-orange-600 mt-1">
                        (In Progress)
                      </p>
                    )}
                  </div>
                  {getStepIcon(step.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Scores */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Evaluation Scores
            </h2>
            <div className="space-y-4">
              {evaluationScores.map((score, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {score.criteria}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {score.score}/{score.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${score.color}`}
                      style={{
                        width: `${(score.score / score.maxScore) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Market Analysis
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Lowest Bid</span>
                <span className="font-semibold text-green-600">$132,000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Your Position</span>
                <span className="font-semibold text-blue-600">
                  {tender.bidAmount}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Highest Bid</span>
                <span className="font-semibold text-red-600">$165,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Project Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Project Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Technical Proposal
                </h3>
                <p className="text-sm text-gray-600">
                  We propose a comprehensive office furniture solution featuring
                  ergonomic designs, sustainable materials, and modern
                  aesthetics. Our furniture meets all GSA standards and includes
                  5-year warranty.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Financial Breakdown
                </h3>
                <p className="text-sm text-gray-600">
                  Executive desks: $35,000, Office chairs: $28,000, Conference
                  tables: $22,000, Storage units: $25,000, Workstations: $35,000
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Company Experience
                </h3>
                <p className="text-sm text-gray-600">
                  15+ years in government furniture supply with projects worth
                  over $50M. ISO 9001:2015 certified with GREENGUARD Gold
                  certification.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Team Composition
                </h3>
                <p className="text-sm text-gray-600">
                  Project Manager: John Smith (10 years exp), Quality Inspector:
                  Sarah Johnson (8 years exp), Installation Team: 6 certified
                  technicians
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Quality Assurance Plan
                </h3>
                <p className="text-sm text-gray-600">
                  Pre-delivery inspection, installation supervision,
                  post-installation quality check, and 5-year comprehensive
                  warranty coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Submitted Documents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Submitted Documents
            </h2>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.size} • {doc.uploaded}
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
