import React from "react";
import {
  X,
  Calendar,
  Clock,
  IndianRupee,
  FileText,
  Award,
  Info,
  Download,
  CheckCircle,
} from "lucide-react";

const ContractDetailsModal = ({ bid, onClose }) => {
  if (!bid || !bid.contractTerms) {
    return null;
  }

  // Debug logging
  console.log("ContractDetailsModal - bid data:", bid);
  console.log("ContractDetailsModal - tender data:", bid.tender);

  // Get tender data from the most reliable source
  const tenderData = bid.tender || bid.raw?.tender || {};
  const { contractTerms } = bid;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return `₹${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Contract Details
            </h2>
            <p className="text-gray-600 mt-1">
              {tenderData?.title || "Contract"} • {tenderData?.tenderId || "-"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Award Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Contract Awarded
                </h3>
                <p className="text-green-700 text-sm">
                  Congratulations! Your bid has been awarded for this tender.
                </p>
              </div>
            </div>
          </div>

          {/* Contract Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Contract Value
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {bid.bidAmount || formatCurrency(bid.raw?.amount || bid.amount)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">
                  Duration
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {contractTerms.duration || "-"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Bonus</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {contractTerms.bonus || "-"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
              </div>
              <div className="text-xl font-bold text-green-600">Active</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Project Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Commencement Date
                </label>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(contractTerms.commencementDate)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Completion Date
                </label>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(contractTerms.completionDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Terms & Conditions */}
          {(contractTerms.conditions || contractTerms.remarks) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Terms & Conditions
              </h3>

              {contractTerms.conditions && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600">
                    Conditions
                  </label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{contractTerms.conditions}</p>
                  </div>
                </div>
              )}

              {contractTerms.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Remarks
                  </label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{contractTerms.remarks}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tender Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Tender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>
                <div className="mt-1 text-gray-900">
                  {tenderData?.category || "-"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tender Value
                </label>
                <div className="mt-1 text-gray-900">
                  {formatCurrency(tenderData?.value)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Location
                </label>
                <div className="mt-1 text-gray-900">
                  {tenderData?.district && tenderData?.state
                    ? `${tenderData.district}, ${tenderData.state}`
                    : "-"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Contact Person
                </label>
                <div className="mt-1 text-gray-900">
                  {tenderData?.contactPerson || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Scores (if available) */}
          {bid.technicalEvaluation && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evaluation Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Technical Score
                  </label>
                  <div className="mt-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {bid.technicalEvaluation.totalRating}/100
                    </div>
                    {bid.technicalEvaluation.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {bid.technicalEvaluation.notes}
                      </p>
                    )}
                  </div>
                </div>
                {bid.financialEvaluation && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Financial Score
                    </label>
                    <div className="mt-1">
                      <div className="text-2xl font-bold text-green-600">
                        {bid.financialEvaluation.totalRating}/100
                      </div>
                      {bid.financialEvaluation.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {bid.financialEvaluation.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Contract updated on {formatDate(contractTerms.updatedAt)}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Download Contract
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsModal;
