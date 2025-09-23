import React, { useState } from 'react';
import {
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  User,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';
import EvaluationModal from '../popup/EvaluationModal';

const BidEvaluation = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTender, setSelectedTender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  const tabs = [
    { id: 'pending', label: 'Pending Evaluation', count: 8 },
    { id: 'technical', label: 'Technical Review', count: 5 },
    { id: 'financial', label: 'Financial Review', count: 3 },
    { id: 'completed', label: 'Completed', count: 12 }
  ];

  const tenders = [
    'All Tenders',
    'Highway Construction Project Phase II',
    'Government Office IT Infrastructure',
    'Medical Equipment Procurement',
    'Smart City Infrastructure Development'
  ];

  const bids = [
    {
      id: 'BID-2024-001',
      tenderTitle: 'Highway Construction Project Phase II',
      tenderId: 'TND2024001',
      vendorName: 'TechCorp Ltd.',
      contactPerson: 'Amit Patel',
      vendorRating: 4.8,
      bidAmount: '₹8,25,00,000',
      technicalScore: 85,
      financialScore: 92,
      submissionDate: '2024-04-12 14:30',
      status: 'pending',
      evaluationStage: 'technical',
      completionPercentage: 35,
      documents: [
        { name: 'Technical Proposal', size: '5.2 MB', type: 'technical' },
        { name: 'Financial Proposal', size: '2.1 MB', type: 'financial' },
        { name: 'Company Profile', size: '8.5 MB', type: 'company' },
        { name: 'Experience Certificates', size: '12.3 MB', type: 'experience' }
      ],
      experience: '15+ years',
      previousProjects: 42,
      complianceStatus: 'compliant',
      notes: 'Strong technical proposal with innovative approach. Good financial standing.',
      evaluationCriteria: {
        technical: {
          experience: { score: 0, maxScore: 20 },
          expertise: { score: 0, maxScore: 25 },
          resources: { score: 0, maxScore: 20 },
          timeline: { score: 0, maxScore: 15 },
          quality: { score: 0, maxScore: 20 }
        },
        financial: {
          costEffectiveness: { score: 0, maxScore: 30 },
          paymentTerms: { score: 0, maxScore: 20 },
          totalCost: { score: 0, maxScore: 25 },
          valueForMoney: { score: 0, maxScore: 25 }
        }
      }
    },
    {
      id: 'BID-2024-002',
      tenderTitle: 'Government Office IT Infrastructure',
      tenderId: 'TND2024002',
      vendorName: 'InfoTech Solutions',
      contactPerson: 'Priya Singh',
      vendorRating: 4.6,
      bidAmount: '₹6,15,00,000',
      technicalScore: 78,
      financialScore: 88,
      submissionDate: '2024-04-10 16:45',
      status: 'technical',
      evaluationStage: 'technical',
      completionPercentage: 65,
      documents: [
        { name: 'Technical Specs', size: '6.8 MB', type: 'technical' },
        { name: 'Implementation Plan', size: '1.9 MB', type: 'technical' },
        { name: 'Support Structure', size: '7.2 MB', type: 'company' },
        { name: 'Financial Proposal', size: '1.5 MB', type: 'financial' }
      ],
      experience: '12+ years',
      previousProjects: 28,
      complianceStatus: 'compliant',
      notes: 'Comprehensive technical solution. Competitive pricing with good value proposition.',
      evaluationCriteria: {
        technical: {
          experience: { score: 0, maxScore: 20 },
          expertise: { score: 0, maxScore: 25 },
          resources: { score: 0, maxScore: 20 },
          timeline: { score: 0, maxScore: 15 },
          quality: { score: 0, maxScore: 20 }
        },
        financial: {
          costEffectiveness: { score: 0, maxScore: 30 },
          paymentTerms: { score: 0, maxScore: 20 },
          totalCost: { score: 0, maxScore: 25 },
          valueForMoney: { score: 0, maxScore: 25 }
        }
      }
    },
    {
      id: 'BID-2024-003',
      tenderTitle: 'Medical Equipment Procurement',
      tenderId: 'TND2024003',
      vendorName: 'MedEquip Industries',
      contactPerson: 'Dr. Rajesh Kumar',
      vendorRating: 4.9,
      bidAmount: '₹11,75,00,000',
      technicalScore: 94,
      financialScore: 85,
      submissionDate: '2024-04-08 11:20',
      status: 'financial',
      evaluationStage: 'financial',
      completionPercentage: 85,
      documents: [
        { name: 'Equipment Specifications', size: '12.4 MB', type: 'technical' },
        { name: 'Warranty Terms', size: '2.8 MB', type: 'technical' },
        { name: 'Training Program', size: '5.1 MB', type: 'company' },
        { name: 'Financial Proposal', size: '3.2 MB', type: 'financial' }
      ],
      experience: '20+ years',
      previousProjects: 156,
      complianceStatus: 'compliant',
      notes: 'Excellent technical specifications. Premium equipment with extended warranty.',
      evaluationCriteria: {
        technical: {
          experience: { score: 0, maxScore: 20 },
          expertise: { score: 0, maxScore: 25 },
          resources: { score: 0, maxScore: 20 },
          timeline: { score: 0, maxScore: 15 },
          quality: { score: 0, maxScore: 20 }
        },
        financial: {
          costEffectiveness: { score: 0, maxScore: 30 },
          paymentTerms: { score: 0, maxScore: 20 },
          totalCost: { score: 0, maxScore: 25 },
          valueForMoney: { score: 0, maxScore: 25 }
        }
      }
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'technical':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'financial':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case 'pending':
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case 'technical':
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case 'financial':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'completed':
        return `${baseClasses} bg-purple-100 text-purple-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'under-review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  const handleEvaluateBid = (bid) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const filteredBids = bids.filter(bid => {
    const matchesTab = activeTab === 'all' || bid.status === activeTab;
    const matchesTender = selectedTender === 'all' || selectedTender === 'All Tenders' || bid.tenderTitle === selectedTender;
    const matchesSearch = bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesTender && matchesSearch;
  });

  const stats = [
    { label: 'Total Bids', value: '28', icon: <FileText className="w-6 h-6 text-blue-600" /> },
    { label: 'Pending Review', value: '8', icon: <Clock className="w-6 h-6 text-orange-600" /> },
    { label: 'Avg. Evaluation Time', value: '4.2 days', icon: <Calendar className="w-6 h-6 text-purple-600" /> },
    { label: 'Completion Rate', value: '89%', icon: <CheckCircle className="w-6 h-6 text-green-600" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bid Evaluation</h1>
          <p className="text-gray-600">Review and evaluate submitted bids</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTender}
            onChange={(e) => setSelectedTender(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {tenders.map(tender => (
              <option key={tender} value={tender}>{tender}</option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bid Cards */}
      <div className="space-y-4">
        {filteredBids.map((bid) => (
          <div key={bid.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-full bg-gray-50">
                  {getStatusIcon(bid.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bid.tenderTitle}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      ID: {bid.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{bid.vendorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getRatingStars(bid.vendorRating)}
                      <span className="text-sm text-gray-600 ml-1">({bid.vendorRating})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getComplianceIcon(bid.complianceStatus)}
                      <span className="text-sm text-gray-600 capitalize">{bid.complianceStatus.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Bid Amount</span>
                      <div className="font-semibold text-green-600 text-lg">{bid.bidAmount}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Technical Score</span>
                      <div className={`font-semibold text-lg ${getScoreColor(bid.technicalScore)}`}>
                        {bid.technicalScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Financial Score</span>
                      <div className={`font-semibold text-lg ${getScoreColor(bid.financialScore)}`}>
                        {bid.financialScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience</span>
                      <div className="font-semibold text-gray-900">{bid.experience}</div>
                      <div className="text-sm text-gray-500">{bid.previousProjects} projects</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Evaluation Progress</span>
                      <span className="font-medium">{bid.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${bid.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 block mb-2">Documents:</span>
                    <div className="flex flex-wrap gap-2">
                      {bid.documents.map((doc, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                          {doc.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Evaluation Notes:</h4>
                    <p className="text-sm text-gray-700">{bid.notes}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={getStatusBadge(bid.status)}>
                  {bid.evaluationStage.charAt(0).toUpperCase() + bid.evaluationStage.slice(1)}
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  {bid.submissionDate}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <Eye className="w-4 h-4" />
                  View Full Proposal
                </button>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <Download className="w-4 h-4" />
                  Download Documents
                </button>
              </div>

              <div className="flex items-center gap-2">
                {bid.status === 'completed' && bid.evaluationStage === 'awarded' ? (
                  <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                    <Award className="w-4 h-4" />
                    Awarded
                  </span>
                ) : (
                  <>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Reject
                    </button>
                    <button
                      onClick={() => handleEvaluateBid(bid)}
                      className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      {bid.status === 'pending' ? 'Start Evaluation' :
                        bid.status === 'technical' ? 'Continue Technical' :
                          bid.status === 'financial' ? 'Continue Financial' :
                            'Review Completed'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBids.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedTender !== 'All Tenders'
              ? 'Try adjusting your search criteria or filters'
              : 'No bids available for evaluation at this time'}
          </p>
        </div>
      )}

      {/* Evaluation Modal */}
      {isModalOpen && selectedBid && (
        <EvaluationModal
          bid={selectedBid}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BidEvaluation;