import React from 'react';

const BusinessDetailsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Business Details</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization Name</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              TechBuild Construction Pvt Ltd
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              Company Vendor
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              15 Years
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              150+ Employees
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
              2008
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsTab;
