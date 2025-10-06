import React from 'react';
import { CheckCircle, FileText, Upload } from 'lucide-react';

const DocumentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Documents & Verification</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">GST Certificate</h3>
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">22AAAAA0000A1Z5</p>
            <p className="text-xs text-green-600">Verified on March 15, 2024</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Email Verification</h3>
              <span className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">rajesh@techbuild.com</p>
            <p className="text-xs text-blue-600">Verified on March 15, 2024</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Phone Verification</h3>
              <span className="flex items-center gap-1 text-sm text-purple-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">+91 98765 43210</p>
            <p className="text-xs text-purple-600">Verified on March 15, 2024</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Documents</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Company Registration Certificate</p>
                <p className="text-sm text-gray-600">Uploaded on March 10, 2024</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Uploaded
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Audited Financial Statements</p>
                <p className="text-sm text-gray-600">Uploaded on March 12, 2024</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Uploaded
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Experience Certificates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                Pending
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bank Statement</p>
                <p className="text-sm text-gray-600">Uploaded on March 14, 2024</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Uploaded
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
