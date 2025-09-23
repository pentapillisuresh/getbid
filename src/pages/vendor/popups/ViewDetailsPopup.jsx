import React from 'react';
import { X, Building2, MapPin, Calendar, DollarSign, Download, FileText } from 'lucide-react';

const ViewDetailsPopup = ({ tender, onClose }) => {
  const eligibilityItems = [
    'Cisco networking equipment',
    'Dell PowerEdge servers',
    'Firewall and Security appliances',
    'Network monitoring tools',
    'Minimum 3 years experience in government IT projects'
  ];

  const requiredDocs = [
    'Technical Requirements.pdf',
    'Network Diagram.pdf',
    'Security Compliance.pdf',
    'Installation Guidelines.pdf'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{tender.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{tender.department}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Organization Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Organization:</span>
                    <div className="font-medium text-gray-900">{tender.department}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Category:</span>
                    <div className="font-medium text-gray-900">{tender.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Published Date:</span>
                    <div className="font-medium text-gray-900">{tender.publishedDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Location:</span>
                    <div className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tender.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
                <div className="space-y-2">
                  {eligibilityItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Contact Person:</span>
                    <div className="font-medium text-gray-900">{tender.contactPerson}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Email:</span>
                    <div className="font-medium text-blue-600">
                      <a href={`mailto:${tender.contactEmail}`} className="hover:underline">
                        {tender.contactEmail}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Phone:</span>
                    <div className="font-medium text-gray-900">{tender.contactPhone}</div>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {requiredDocs.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="text-gray-900">{doc}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h3>
            <p className="text-gray-700 leading-relaxed">{tender.description}</p>
          </div>

          {/* Financial Information */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Estimated Value</div>
                <div className="font-bold text-green-700 text-xl">{tender.estimatedValue}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Document Fee</div>
                <div className="font-bold text-blue-700 text-xl">{tender.documentFee}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">EMD</div>
                <div className="font-bold text-purple-700 text-xl">{tender.emd}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button className="bg-primary-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Download All Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPopup;