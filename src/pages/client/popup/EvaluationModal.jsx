import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Eye, 
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';

const EvaluationModal = ({ bid, onClose }) => {
  const [activeTab, setActiveTab] = useState('technical');
  const [scores, setScores] = useState(bid.evaluationCriteria);
  const [notes, setNotes] = useState('');

  const handleScoreChange = (category, criterion, value) => {
    setScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [criterion]: {
          ...prev[category][criterion],
          score: parseInt(value) || 0
        }
      }
    }));
  };

  const calculateTotalScore = (category) => {
    const categoryScores = scores[category];
    const totalScore = Object.values(categoryScores).reduce((sum, item) => sum + item.score, 0);
    const maxScore = Object.values(categoryScores).reduce((sum, item) => sum + item.maxScore, 0);
    return { totalScore, maxScore };
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', { bid: bid.id, scores, notes });
    // Add save logic here
  };

  const handleCompleteEvaluation = () => {
    console.log('Completing evaluation...', { bid: bid.id, scores, notes });
    // Add completion logic here
    onClose();
  };

  const renderDocuments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {bid.documents.map((doc, index) => (
        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 text-sm truncate">{doc.name}</div>
              <div className="text-xs text-gray-500">({doc.size})</div>
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
  );

  const renderEvaluationCriteria = (category) => {
    const criteria = scores[category];
    const { totalScore, maxScore } = calculateTotalScore(category);

    const criteriaLabels = {
      technical: {
        experience: { label: 'Experience', description: 'Relevant experience in highway construction' },
        expertise: { label: 'Expertise', description: 'Technical expertise and methodology' },
        resources: { label: 'Resources', description: 'Available resources and equipment' },
        timeline: { label: 'Timeline', description: 'Project timeline and milestones' },
        quality: { label: 'Quality', description: 'Quality assurance and safety measures' }
      },
      financial: {
        costEffectiveness: { label: 'Cost Effectiveness', description: 'Overall cost effectiveness of the proposal' },
        paymentTerms: { label: 'Payment Terms', description: 'Flexibility and reasonableness of payment terms' },
        totalCost: { label: 'Total Cost', description: 'Competitiveness of total project cost' },
        valueForMoney: { label: 'Value for Money', description: 'Overall value proposition offered' }
      }
    };

    return (
      <div className="space-y-6">
        {/* Header with Total Score */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {category === 'technical' ? 'Technical Bid Evaluation' : 'Financial Bid Evaluation'}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalScore}/{maxScore}</div>
            <div className="text-sm text-gray-500">Total Score</div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-4">
          {Object.entries(criteria).map(([key, criterion]) => {
            const criterionInfo = criteriaLabels[category][key];
            const percentage = criterion.maxScore > 0 ? (criterion.score / criterion.maxScore) * 100 : 0;
            
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-base">{criterionInfo.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{criterionInfo.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="number"
                      min="0"
                      max={criterion.maxScore}
                      value={criterion.score}
                      onChange={(e) => handleScoreChange(category, key, e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="text-gray-500 text-sm">/ {criterion.maxScore}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                {/* Score Percentage */}
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Evaluation Notes */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-base">Evaluation Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your evaluation notes and comments here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        {/* Submitted Documents */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-base">Submitted Documents</h4>
          {renderDocuments()}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 truncate">{bid.tenderTitle}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Bid Evaluation - {activeTab === 'technical' ? 'Technical Assessment' : 'Financial Assessment'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Vendor Info - Fixed */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Vendor</span>
              <div className="font-semibold text-gray-900 truncate">{bid.vendorName}</div>
              <div className="text-sm text-gray-600 truncate">Contact: {bid.contactPerson}</div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Tender ID</span>
              <div className="font-semibold text-gray-900">{bid.tenderId}</div>
              <div className="text-sm text-gray-600">Submitted: {bid.submissionDate.split(' ')[0]}</div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Bid Amount</span>
              <div className="font-semibold text-green-600 text-lg">{bid.bidAmount}</div>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-gray-500 block">Status</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="font-medium text-orange-600">Under Evaluation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('technical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center gap-2 ${
                activeTab === 'technical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Technical Evaluation
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'financial'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💰 Financial Evaluation
            </button>
          </nav>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderEvaluationCriteria(activeTab)}
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 gap-3">
          <button
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Save Draft
          </button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteEvaluation}
              className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Complete {activeTab === 'technical' ? 'Technical' : 'Financial'} Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;