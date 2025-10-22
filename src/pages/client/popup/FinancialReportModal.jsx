import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const FinancialReportModal = ({ tender, onClose }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');

  const approvedBids = [
    {
      rank: 1,
      vendorName: 'Modern Builders Ltd',
      contactPerson: 'Neha Sharma',
      bidAmount: '₹7.90 Cr',
      variance: '-7.1%',
      status: 'L1 (Lowest)'
    },
    {
      rank: 2,
      vendorName: 'Education Infrastructure Corp',
      contactPerson: 'Rajesh Kumar',
      bidAmount: '₹8.20 Cr',
      variance: '-3.5%',
      status: 'L2'
    }
  ];

  const estimatedValue = '₹8.5 Cr';
  const lowestBid = '₹7.9 Cr';
  const savings = '₹0.6 Cr';

  const handleDownloadPDF = () => {
    console.log('Downloading PDF report...');
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Financial Evaluation Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Evaluation Report</h1>
              <p className="text-lg text-gray-700 mb-1">{tender.title}</p>
              <p className="text-sm text-gray-500">Generated on {currentDate}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-1">Estimated Value</p>
                <p className="text-2xl font-bold text-blue-600">{estimatedValue}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-700 mb-1">Lowest Bid</p>
                <p className="text-2xl font-bold text-purple-600">{lowestBid}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Savings</p>
                <p className="text-2xl font-bold text-green-600">{savings}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bid Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedBids.map((bid) => (
                    <tr key={bid.rank} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">{bid.rank}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{bid.vendorName}</div>
                        <div className="text-sm text-gray-500">{bid.contactPerson}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {bid.bidAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {bid.variance}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          bid.status.includes('L1')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
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
