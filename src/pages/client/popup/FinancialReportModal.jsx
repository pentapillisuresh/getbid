import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const FinancialReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  const financialData = {
    project: tender.title,
    generatedDate: currentDate,
    bidders: [
      {
        rank: 1,
        vendorName: 'Modern Builders Ltd',
        bidAmount: '¥7.90 Cr',
        variance: '-7.1%'
      },
      {
        rank: 2,
        vendorName: 'Education Infrastructure Corp',
        bidAmount: '¥8.20 Cr',
        variance: '-3.5%'
      },
      {
        rank: 3,
        vendorName: 'Rajesh Kumar',
        bidAmount: '¥8.50 Cr',
        variance: '0%'
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Financial Evaluation Report</h2>
            <p className="text-sm text-gray-600 mt-1">{financialData.project}</p>
            <p className="text-sm text-gray-500">Generated on {financialData.generatedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Report Content */}
          <div className="space-y-6">
            {/* Main Report Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance from Est.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.bidders.map((bidder) => (
                    <tr key={bidder.rank} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {bidder.rank}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bidder.vendorName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bidder.bidAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bidder.variance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium text-blue-800">Financial Bid Evaluation</p>
              </div>
              <p className="text-sm text-blue-700">
                Only technically approved bidders are considered for financial evaluation.
                The ranking is based on the lowest bid amount with L1 being the lowest.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FileText className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportModal;