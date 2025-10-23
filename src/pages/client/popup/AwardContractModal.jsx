import React, { useState } from "react";
import { X, Award } from "lucide-react";

const AwardContractModal = ({ bid, tender, onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contractDuration: bid?.timeline || "18 months",
    performanceBond: "5%",
    workCommencementDate: "",
    expectedCompletionDate: "",
    specialConditions: "",
    remarks: "",
    confirmed: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = () => {
    if (formData.confirmed) {
      onConfirm(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Award Contract</h2>
            <p className="text-sm text-gray-600 mt-1">
              Award contract to{" "}
              {bid?.user?.company?.name || bid?.user?.name || "N/A"}
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
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Contract Award
                    </h3>
                    <p className="text-sm text-green-700">
                      Selected bidder for contract award
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Vendor Name
                    </p>
                    <p className="text-green-900 font-semibold">
                      {bid?.user?.company?.name || bid?.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Contact Person
                    </p>
                    <p className="text-green-900 font-semibold">
                      {bid?.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Bid Amount
                    </p>
                    <p className="text-green-900 font-semibold">
                      {bid?.amount ? `₹${bid.amount.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Technical Score
                    </p>
                    <p className="text-green-900 font-semibold">
                      {bid?.technicalEvaluation
                        ? `${Object.values({
                            experience: bid.technicalEvaluation.experience || 0,
                            expertise: bid.technicalEvaluation.expertise || 0,
                            resources: bid.technicalEvaluation.resources || 0,
                            timeline: bid.technicalEvaluation.timeline || 0,
                            quality: bid.technicalEvaluation.quality || 0,
                          }).reduce((sum, score) => sum + score, 0)}/100`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Vendor Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">
                      {bid?.user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">
                      {bid?.user?.phone || "N/A"}
                    </p>
                  </div>
                  {bid?.user?.company?.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Company Address
                      </p>
                      <p className="font-medium text-gray-900">
                        {bid.user.company.address}
                      </p>
                    </div>
                  )}
                  {bid?.user?.company?.registrationNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Registration Number
                      </p>
                      <p className="font-medium text-gray-900">
                        {bid.user.company.registrationNumber}
                      </p>
                    </div>
                  )}
                  {bid?.timeline && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Proposed Timeline
                      </p>
                      <p className="font-medium text-gray-900">
                        {bid.timeline}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Tender Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tender ID</p>
                    <p className="font-medium text-gray-900">
                      {tender?._id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tender Title</p>
                    <p className="font-medium text-gray-900">
                      {tender?.title || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Value
                    </p>
                    <p className="font-medium text-gray-900">
                      {tender?.estimatedValue
                        ? `₹${tender.estimatedValue.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tender Status</p>
                    <p className="font-medium text-gray-900">
                      {tender?.status || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Contract Terms & Conditions
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contract Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contractDuration}
                      onChange={(e) =>
                        handleInputChange("contractDuration", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={bid?.timeline || "18 months"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Bond (%)
                    </label>
                    <input
                      type="text"
                      value={formData.performanceBond}
                      onChange={(e) =>
                        handleInputChange("performanceBond", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5%"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Commencement Date
                    </label>
                    <input
                      type="date"
                      value={formData.workCommencementDate}
                      onChange={(e) =>
                        handleInputChange(
                          "workCommencementDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Completion Date
                    </label>
                    <input
                      type="date"
                      value={formData.expectedCompletionDate}
                      onChange={(e) =>
                        handleInputChange(
                          "expectedCompletionDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Conditions
                  </label>
                  <textarea
                    value={formData.specialConditions}
                    onChange={(e) =>
                      handleInputChange("specialConditions", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter any special conditions or requirements..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Additional remarks or notes..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmed}
                      onChange={(e) =>
                        handleInputChange("confirmed", e.target.checked)
                      }
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">
                        Confirmation Required:
                      </span>{" "}
                      I confirm that I have the authority to award this contract
                      and all evaluation criteria have been met.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Continue
              </button>
            )}
            {currentStep === 2 && (
              <button
                onClick={handleSubmit}
                disabled={!formData.confirmed}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Award
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardContractModal;
