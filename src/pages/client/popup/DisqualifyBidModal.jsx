import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const DisqualifyBidModal = ({ bid, tender, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const commonReasons = [
    'Insufficient technical experience',
    'Missing required certifications',
    'Incomplete documentation',
    'Does not meet eligibility criteria',
    'Technical proposal does not comply with specifications',
    'Financial capacity inadequate',
    'Past performance issues'
  ];

  const handleReasonClick = (selectedReason) => {
    setReason(selectedReason);
  };

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Disqualify Bid</h2>
            <p className="text-sm text-gray-600 mt-1">
              Provide reason for disqualifying this bid
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
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Disqualification Notice</p>
                  <p className="text-sm text-red-700">This action will disqualify the bid from further evaluation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm text-red-700 font-medium mb-1">Vendor Name</p>
                  <p className="text-red-900 font-semibold">{bid.vendorName}</p>
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium mb-1">Contact Person</p>
                  <p className="text-red-900 font-semibold">{bid.contactPerson || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium mb-1">Bid Amount</p>
                  <p className="text-red-900 font-semibold">{bid.bidAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium mb-1">Submission Date</p>
                  <p className="text-red-900 font-semibold">{bid.submittedDate}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Disqualification <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please provide detailed reason for disqualifying this bid..."
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Common Reasons (Click to use)</p>
              <div className="space-y-2">
                {commonReasons.map((commonReason, index) => (
                  <button
                    key={index}
                    onClick={() => handleReasonClick(commonReason)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
                  >
                    {commonReason}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Disqualification
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisqualifyBidModal;
