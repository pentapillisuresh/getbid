import React from "react";
import {
  X,
  TriangleAlert as AlertTriangle,
  RotateCcw,
  Clock,
  Info,
} from "lucide-react";

const RebidConfirmation = ({ tender, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Confirm Re-Bid
              </h2>
              <p className="text-gray-600 text-sm">Modify your existing bid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Current Bid Details */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-900 mb-2">Current Bid</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Tender:</span>
                <span className="font-medium text-orange-900 text-right flex-1 ml-2">
                  {tender.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Amount:</span>
                <span className="font-medium text-orange-900">
                  {tender.bidAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Time Left:</span>
                <span className="font-medium text-orange-900">15d 6h</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Important</h3>
                <div className="text-sm text-blue-700">
                  <p>• Re-bidding overwrites your current submission</p>
                  <p>• You can update bid amount and documents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          {/* <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Process</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">1</div>
                <span className="text-gray-700">Update bid form</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">2</div>
                <span className="text-gray-700">Upload documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">3</div>
                <span className="text-gray-700">Submit updated bid</span>
              </div>
            </div>
          </div> */}

          {/* Deadline Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <div>
                <span className="font-medium text-yellow-900 text-sm">
                  Deadline: 15d 6h remaining
                </span>
                <p className="text-xs text-yellow-700 mt-1">
                  Submit well before deadline
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Proceed to Re-Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default RebidConfirmation;
