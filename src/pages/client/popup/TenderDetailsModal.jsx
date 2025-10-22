import React from "react";
import { X, Download, CheckCircle, Calendar, Users, IndianRupee, Clock, MessageCircle, Link, Award } from "lucide-react";

const TenderDetailsModal = ({ show, onClose, tender, onCancelTender }) => {
  if (!show || !tender) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                tender.status === 'published' ? 'bg-green-100' :
                tender.status === 'evaluation' ? 'bg-blue-100' :
                tender.status === 'awarded' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                {tender.status === 'published' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                 tender.status === 'evaluation' ? <Clock className="w-5 h-5 text-blue-600" /> :
                 tender.status === 'awarded' ? <Award className="w-5 h-5 text-purple-600" /> :
                 <CheckCircle className="w-5 h-5 text-gray-600" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900 capitalize">{tender.status}</p>
                <p className="text-sm text-gray-600">{tender.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Days Left</p>
              <p className={`font-semibold ${tender.daysLeft > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                {tender.daysLeft > 0 ? `${tender.daysLeft} days` : `${Math.abs(tender.daysLeft)} days ago`}
              </p>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Tender ID</p>
              <p className="font-semibold text-gray-900">{tender.id}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="font-semibold text-green-600">{tender.estimatedValue}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Bids Received</p>
              <p className="font-semibold text-purple-600">{tender.bidsReceived}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Published Date</p>
              <p className="font-semibold text-gray-900">{tender.publishedDate}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{tender.description}</p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Submission Deadline</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Calendar className="w-4 h-4" />
                {tender.submissionDeadline}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Clarifications</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <MessageCircle className="w-4 h-4" />
                {tender.clarifications} clarifications
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Created By</p>
              <p className="text-gray-900 font-semibold">{tender.createdBy}</p>
            </div>
            {tender.linkedAccount && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Account Link</p>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Link className="w-4 h-4" />
                  Linked to main account
                </div>
              </div>
            )}
          </div>

          {/* Pre-bid Meeting */}
          {tender.preBidMeeting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Pre-bid Meeting Scheduled</h3>
              </div>
              <p className="text-sm text-blue-700">Meeting details will be shared with qualified bidders</p>
            </div>
          )}

          {/* Award Information */}
          {tender.awardedTo && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Tender Awarded</h3>
              </div>
              <p className="text-sm text-purple-700">Awarded to: {tender.awardedTo}</p>
            </div>
          )}

          {/* Tender Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Tender Documents
            </h3>
            <div className="space-y-3">
              {["BOQ.pdf", "Technical_Specs.pdf", "Drawings.zip", "Terms_and_Conditions.pdf"].map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700 font-medium">{file}</span>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <Download className="w-4 h-4" />
                Download All Documents
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Close
              </button>
              
              {tender.status === 'published' && tender.bidsReceived > 0 && (
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                  View Bids ({tender.bidsReceived})
                </button>
              )}
              
              {tender.status === 'evaluation' && (
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                  Continue Evaluation
                </button>
              )}

              {/* Cancel Tender Button - Only show for published tenders that are not awarded */}
              {tender.status === 'published' && !tender.awardedTo && (
                <button
                  onClick={onCancelTender}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel Tender
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetailsModal;