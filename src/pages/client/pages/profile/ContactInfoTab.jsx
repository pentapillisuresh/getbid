import React from 'react';
import { CheckCircle } from 'lucide-react';

const ContactInfoTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              Rajesh Kumar Sharma
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-gray-900">rajesh@techbuild.com</span>
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-gray-900">+91 98765 43210</span>
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <a href="https://www.techbuild.com" className="text-blue-600 hover:underline">
                www.techbuild.com
              </a>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
            Office 12A, Business Park, Electronic City Phase 1
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              Karnataka
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              Bangalore Urban
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              560100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoTab;
