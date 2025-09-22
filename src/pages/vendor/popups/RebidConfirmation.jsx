import React from 'react';
import { X, AlertTriangle, RotateCcw, Clock, Info } from 'lucide-react';

const RebidConfirmation = ({ tender, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Re-Bid</h2>
              <p className="text-gray-600 text-sm">Are you sure you want to modify your existing bid?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Bid Details */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-orange-900 mb-3">Current Bid Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-700">Tender:</span>
                <span className="font-medium text-orange-900">{tender.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Current Bid:</span>
                <span className="font-medium text-orange-900">{tender.bidAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Time Remaining:</span>
                <span className="font-medium text-orange-900">15 days 6 hours</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Important Notice</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Re-bidding will overwrite your current submission.</li>
                  <li>• Make sure you have all updated documents and information ready before proceeding.</li>
                  <li>• You can modify your bid amount, technical details, and supporting documents.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Re-bid Process */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">1</div>
                <span className="text-sm text-gray-700">You'll be redirected to the bid submission form</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">2</div>
                <span className="text-sm text-gray-700">Update your bid details and upload new documents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">3</div>
                <span className="text-sm text-gray-700">Review and submit your updated bid</span>
              </div>
            </div>
          </div>

          {/* Time Remaining Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Deadline Reminder</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  You have 15 days and 6 hours remaining before the tender closes. Ensure you submit your final bid well before the deadline.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Proceed to Re-Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebidConfirmation;