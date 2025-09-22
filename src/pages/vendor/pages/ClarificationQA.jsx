import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Send,
  Eye
} from 'lucide-react';

const ClarificationQA = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewQuestion, setShowNewQuestion] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Questions', count: 12 },
    { id: 'open', label: 'Open', count: 5 },
    { id: 'answered', label: 'Answered', count: 6 },
    { id: 'closed', label: 'Closed', count: 1 }
  ];

  const clarifications = [
    {
      id: 1,
      tenderTitle: 'Highway Construction Project Phase II',
      question: 'What are the specific environmental compliance requirements for the highway construction project?',
      questionDate: '2024-04-12 10:30',
      status: 'answered',
      answer: 'All contractors must obtain environmental clearance from the State Pollution Control Board. Additionally, compliance with EIA (Environmental Impact Assessment) guidelines is mandatory. Detailed requirements are provided in Annexure C of the tender document.',
      answeredBy: 'Project Manager - Dept. of Public Works',
      answeredDate: '2024-04-13 14:20',
      priority: 'high',
      category: 'Environmental'
    },
    {
      id: 2,
      tenderTitle: 'Government Office IT Infrastructure',
      question: 'Can we propose alternative server configurations that exceed the minimum specifications mentioned in the RFP?',
      questionDate: '2024-04-10 15:45',
      status: 'answered',
      answer: 'Yes, you may propose alternative configurations that exceed minimum specifications. However, ensure that your proposal clearly highlights the additional benefits and cost implications. The evaluation will consider value for money.',
      answeredBy: 'Technical Lead - Ministry of IT',
      answeredDate: '2024-04-11 09:15',
      priority: 'medium',
      category: 'Technical'
    },
    {
      id: 3,
      tenderTitle: 'Medical Equipment Procurement',
      question: 'What is the warranty period requirement for MRI machines, and does it include on-site maintenance?',
      questionDate: '2024-04-08 11:20',
      status: 'open',
      answer: null,
      answeredBy: null,
      answeredDate: null,
      priority: 'high',
      category: 'Commercial'
    },
    {
      id: 4,
      tenderTitle: 'Smart City Infrastructure Development',
      question: 'Are there any restrictions on the choice of IoT sensors and communication protocols for the smart city project?',
      questionDate: '2024-04-07 16:30',
      status: 'open',
      answer: null,
      answeredBy: null,
      answeredDate: null,
      priority: 'medium',
      category: 'Technical'
    },
    {
      id: 5,
      tenderTitle: 'School Furniture Supply Contract',
      question: 'Can the delivery schedule be staggered over multiple phases instead of a single bulk delivery?',
      questionDate: '2024-04-06 09:45',
      status: 'answered',
      answer: 'Yes, phased delivery is acceptable. Please provide a detailed delivery schedule in your proposal. Ensure that priority schools receive furniture first as per the list provided in Annexure B.',
      answeredBy: 'Procurement Officer - Education Dept.',
      answeredDate: '2024-04-07 11:30',
      priority: 'medium',
      category: 'Logistics'
    },
    {
      id: 6,
      tenderTitle: 'Highway Construction Project Phase II',
      question: 'What are the payment terms and advance payment provisions for this project?',
      questionDate: '2024-04-05 14:15',
      status: 'closed',
      answer: 'Payment will be made based on work completion milestones. 10% advance payment is available against bank guarantee. Detailed payment schedule is mentioned in the contract terms (Section 7).',
      answeredBy: 'Finance Manager - Dept. of Public Works',
      answeredDate: '2024-04-05 16:45',
      priority: 'high',
      category: 'Financial'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'open':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'closed':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'answered':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'open':
        return `${baseClasses} bg-orange-100 text-orange-600`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-600`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "inline-block px-2 py-1 rounded-full text-xs font-medium";
    
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-600`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const filteredClarifications = clarifications.filter(item => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    { label: 'Total Questions', value: '12', icon: <MessageSquare className="w-6 h-6 text-blue-600" /> },
    { label: 'Response Rate', value: '83%', icon: <CheckCircle className="w-6 h-6 text-green-600" /> },
    { label: 'Avg. Response Time', value: '18h', icon: <Clock className="w-6 h-6 text-orange-600" /> },
    { label: 'Open Questions', value: '5', icon: <AlertCircle className="w-6 h-6 text-purple-600" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clarifications & Q&A</h1>
          <p className="text-gray-600">Ask questions and get clarifications from tender authorities</p>
        </div>
        <button 
          onClick={() => setShowNewQuestion(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
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

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
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

      {/* New Question Modal */}
      {showNewQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Ask New Question</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Tender</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Highway Construction Project Phase II</option>
                  <option>Government Office IT Infrastructure</option>
                  <option>Medical Equipment Procurement</option>
                  <option>Smart City Infrastructure Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Technical</option>
                  <option>Commercial</option>
                  <option>Financial</option>
                  <option>Environmental</option>
                  <option>Logistics</option>
                  <option>Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <textarea
                  rows="4"
                  placeholder="Enter your question here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button
                onClick={() => setShowNewQuestion(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewQuestion(false)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredClarifications.map((item) => (
          <div key={item.id} className="card border-l-4 border-primary-500 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-full bg-gray-50">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.tenderTitle}</h3>
                    <span className={getPriorityBadge(item.priority)}>
                      {item.priority}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Question:</h4>
                    <p className="text-gray-800">{item.question}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>Asked on {item.questionDate}</span>
                    </div>
                  </div>

                  {item.answer && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Answer:
                      </h4>
                      <p className="text-green-700 mb-3">{item.answer}</p>
                      <div className="flex items-center gap-4 text-sm text-green-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.answeredBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Answered on {item.answeredDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.status === 'open' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-orange-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Awaiting Response</span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Your question has been forwarded to the relevant authority. You will be notified once a response is available.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className={getStatusBadge(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  <Eye className="w-4 h-4" />
                  View Full Discussion
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                {item.status === 'open' && (
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Follow Up
                  </button>
                )}
                {item.status === 'answered' && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Mark as Helpful
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClarifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : "You haven't asked any questions yet"}
          </p>
          <button 
            onClick={() => setShowNewQuestion(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ask Your First Question
          </button>
        </div>
      )}
    </div>
  );
};

export default ClarificationQA;