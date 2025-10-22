import React, { useState } from 'react';
import { X, FileText, Download, Eye, ChevronDown, Check, Award } from 'lucide-react';

const EvaluationModal = ({ tender, evaluationType = 'technical', onClose }) => {
  const [selectedBid, setSelectedBid] = useState(tender.bids[0]);
  const [technicalScores, setTechnicalScores] = useState({
    experience: 0,
    expertise: 0,
    resources: 0,
    timeline: 0,
    quality: 0
  });
  const [financialScores, setFinancialScores] = useState({
    costBreakdown: 0,
    paymentTerms: 0,
    financialStability: 0,
    valueForMoney: 0
  });
  const [notes, setNotes] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [currentEvaluationType, setCurrentEvaluationType] = useState(evaluationType);

  const technicalCriteria = [
    { key: 'experience', label: 'Experience', maxScore: 25, description: 'Relevant experience in highway construction' },
    { key: 'expertise', label: 'Expertise', maxScore: 25, description: 'Technical expertise and methodology' },
    { key: 'resources', label: 'Resources', maxScore: 20, description: 'Available resources and equipment' },
    { key: 'timeline', label: 'Timeline', maxScore: 15, description: 'Project timeline and milestones' },
    { key: 'quality', label: 'Quality', maxScore: 15, description: 'Quality assurance and safety measures' }
  ];

  const financialCriteria = [
    { key: 'costBreakdown', label: 'Cost Breakdown', maxScore: 30, description: 'Detailed cost analysis and breakdown' },
    { key: 'paymentTerms', label: 'Payment Terms', maxScore: 20, description: 'Payment schedule and terms' },
    { key: 'financialStability', label: 'Financial Stability', maxScore: 25, description: 'Financial standing and stability' },
    { key: 'valueForMoney', label: 'Value for Money', maxScore: 25, description: 'Overall value proposition' }
  ];

  // Approved bidders for financial evaluation
  const approvedBidders = [
    {
      rank: 1,
      vendorName: 'Modern Builders Ltd',
      contactPerson: 'Neha Sharma',
      technicalScore: '78/100',
      bidAmount: '¥7.90 Cr',
      variance: '-7.1%',
      status: 'L1 (Lowest)'
    },
    {
      rank: 2,
      vendorName: 'Education Infrastructure Corp',
      contactPerson: 'Rajesh Kumar',
      technicalScore: '85/100',
      bidAmount: '¥8.20 Cr',
      variance: '-3.5%',
      status: 'L2'
    }
  ];

  const currentCriteria = currentEvaluationType === 'technical' ? technicalCriteria : financialCriteria;
  const currentScores = currentEvaluationType === 'technical' ? technicalScores : financialScores;
  const setCurrentScores = currentEvaluationType === 'technical' ? setTechnicalScores : setFinancialScores;

  const handleScoreChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    const criterion = currentCriteria.find(c => c.key === key);
    const maxScore = criterion ? criterion.maxScore : 100;

    if (numValue >= 0 && numValue <= maxScore) {
      setCurrentScores(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const calculateTotalScore = () => {
    return Object.values(currentScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateMaxScore = () => {
    return currentCriteria.reduce((sum, criterion) => sum + criterion.maxScore, 0);
  };

  const handleSubmit = () => {
    console.log('Submitting evaluation:', {
      tender: tender.id,
      bid: selectedBid.id,
      type: currentEvaluationType,
      scores: currentScores,
      notes,
      status: isApproved ? 'approved' : isDisqualified ? 'disqualified' : 'pending'
    });
    onClose();
  };

  const handleApprove = () => {
    setIsApproved(true);
    setIsDisqualified(false);
  };

  const handleDisqualify = () => {
    setIsDisqualified(true);
    setIsApproved(false);
  };

  const handleAwardBid = (bidder) => {
    console.log('Awarding bid to:', bidder);
    // Handle award logic here
  };

  // Dynamic logic for enabling/disabling evaluation types
  const canAccessTechnical = currentEvaluationType === 'technical' || tender.financialStatus !== 'in-progress';
  const canAccessFinancial = currentEvaluationType === 'financial' || tender.technicalStatus === 'completed';

  const submittedDocuments = [
    { name: 'Technical Proposal', size: '5.2 MB', checked: false },
    { name: 'Company Profile', size: '8.5 MB', checked: true },
    { name: 'Financial Proposal', size: '2.1 MB', checked: false },
    { name: 'Experience Certificates', size: '12.3 MB', checked: true }
  ];

  // Render financial evaluation table
  const renderFinancialEvaluation = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-sm text-blue-800">
            Only approved bidders are shown for financial evaluation.
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Amount (¥)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance from Est.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvedBidders.map((bidder) => (
              <tr key={bidder.rank} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bidder.rank}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{bidder.vendorName}</div>
                  <div className="text-sm text-gray-500">{bidder.contactPerson}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bidder.technicalScore}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bidder.bidAmount}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bidder.variance}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    bidder.status.includes('L1') 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {bidder.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAwardBid(bidder)}
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      Award
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-blue-600 hover:text-blue-900 font-medium">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render technical evaluation form
  const renderTechnicalEvaluation = () => (
    <div className="space-y-6">
      {/* Bid Selection & Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Bid Evaluation</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="font-medium">{selectedBid.vendorName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {tender.bids.map((bid, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedBid(bid);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {bid.vendorName}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedBid.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : selectedBid.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedBid.status === 'pending' ? 'Pending' : selectedBid.status === 'approved' ? 'Approved' : 'Disqualified'}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Contact: {selectedBid.contactPerson || 'N/A'}</p>
          <p>Submitted: {selectedBid.submittedDate}</p>
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Evaluation Criteria</h4>
        
        <div className="space-y-4">
          {currentCriteria.map((criterion) => {
            const score = currentScores[criterion.key];
            const percentage = (score / criterion.maxScore) * 100;

            return (
              <div key={criterion.key} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{criterion.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <input
                      type="number"
                      min="0"
                      max={criterion.maxScore}
                      value={score}
                      onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500 text-sm">/ {criterion.maxScore}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Score */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Technical Score</h4>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {calculateTotalScore()}/{calculateMaxScore()}
            </div>
            <button className="text-blue-600 text-sm mt-1 hover:underline">View Details</button>
          </div>
        </div>
      </div>

      {/* Manager Q&A */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Manager Q&A</h4>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="text-gray-500 text-sm">No questions yet</p>
        </div>
      </div>

      {/* Submitted Documents */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Submitted Documents</h4>
        <div className="space-y-3">
          {submittedDocuments.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center">
                  {doc.checked ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border border-gray-300 rounded"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Notes */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Evaluation Notes</h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your evaluation notes and comments here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleApprove}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isApproved 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isApproved && <Check className="w-4 h-4" />}
            Approve Bid
          </button>
          <button 
            onClick={handleDisqualify}
            className={`px-4 py-2 rounded-lg font-medium ${
              isDisqualified 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disqualify Bid
          </button>
        </div>
        
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Generate Technical Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            {/* <h2 className="text-xl font-bold text-gray-900">Client Portal</h2> */}
            {/* <p className="text-sm text-gray-600 mt-1">
              {currentEvaluationType === 'technical' ? 'Header Management & Procurement System' : 'Tender Management & Procurement System'}
            </p> */}
            <h3 className="text-lg font-semibold text-gray-800 mt-2">{tender.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Bid Evaluation - {currentEvaluationType === 'technical' ? 'Technical Assessment' : 'Financial Assessment'}
            </p>
            <div className="flex mt-2">
              <button
                onClick={() => canAccessTechnical && setCurrentEvaluationType('technical')}
                disabled={!canAccessTechnical}
                className={`mr-4 font-medium ${
                  currentEvaluationType === 'technical'
                    ? 'text-blue-600'
                    : canAccessTechnical
                    ? 'text-gray-400 hover:text-gray-600'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                Technical Evaluation
              </button>
              <button
                onClick={() => canAccessFinancial && setCurrentEvaluationType('financial')}
                disabled={!canAccessFinancial}
                className={`font-medium ${
                  currentEvaluationType === 'financial'
                    ? 'text-blue-600'
                    : canAccessFinancial
                    ? 'text-gray-400 hover:text-gray-600'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                Financial Evaluation
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentEvaluationType === 'financial' ? renderFinancialEvaluation() : renderTechnicalEvaluation()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              {currentEvaluationType === 'technical' ? 'Complete Technical Evaluation' : 'Generate Financial Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;