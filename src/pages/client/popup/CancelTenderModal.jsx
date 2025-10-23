import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const CancelTenderModal = ({ show, onClose, tender }) => {
  const [cancellationNote, setCancellationNote] = useState("");

  if (!show || !tender) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle tender cancellation logic
    console.log("Cancelling tender:", tender.id, "Reason:", cancellationNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Tender Cancellation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium text-center">
                Are you sure you want to cancel this tender? This action cannot
                be undone.
              </p>
            </div>

            {/* Tender Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tender ID:</span>
                <span className="font-semibold">{tender.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-semibold">{tender.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bids Received:</span>
                <span className="font-semibold">{tender.bidsReceived}</span>
              </div>
            </div>

            {/* Cancellation Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Note *
              </label>
              <textarea
                value={cancellationNote}
                onChange={(e) => setCancellationNote(e.target.value)}
                placeholder="Please provide a reason for cancelling this tender..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Important Notice:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All submitted bids will be invalidated</li>
                <li>• Vendors will be notified automatically</li>
                <li>• This action requires OTP verification</li>
                <li>• Cancellation will be recorded in audit trail</li>
              </ul>
            </div>

            {/* Action Buttons */}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors min-w-[100px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cancellationNote.trim()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors min-w-[140px]"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelTenderModal;
