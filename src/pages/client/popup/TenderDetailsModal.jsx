import React from "react";
import { X, Download, CheckCircle } from "lucide-react";

const TenderDetailsModal = ({ show, onClose, tender }) => {
  if (!show || !tender) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {tender.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tender ID</p>
              <p className="font-semibold">{tender.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="inline-flex items-center gap-2 font-semibold text-green-600">
                <CheckCircle className="w-4 h-4" />
                {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="font-semibold text-green-600">
                {tender.estimatedValue}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bids Received</p>
              <p className="font-semibold text-purple-600">
                {tender.bidsReceived}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-800">{tender.description}</p>
          </div>

          {/* Eligibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Eligibility Criteria
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Minimum 10 years experience
              </li>
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Annual turnover ₹100+ Cr
              </li>
            </ul>
          </div>

          {/* Tender Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tender Documents
            </h3>
            <div className="space-y-3">
              {["BOQ.pdf", "Technical_Specs.pdf", "Drawings.zip"].map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700 font-medium">{file}</span>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-bid Meeting */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pre-bid Meeting
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="font-medium text-blue-700">25/03/2024</p>
              <p className="text-sm text-blue-600">
                PWD Office, Conference Hall A
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">
              View Bids
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetailsModal;
