import React, { useState } from 'react';
import { X, Search, HelpCircle, MessageCircle, Phone, FileText, Settings, Users, DollarSign } from 'lucide-react';

const SupportPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: 'Bidding Guide',
      description: 'Step-by-step bidding process',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Settings className="w-8 h-8 text-green-600" />,
      title: 'Document Upload',
      description: 'File requirements and formats',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Account Setup',
      description: 'Complete your vendor profile',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-orange-600" />,
      title: 'Tender Q&A',
      description: 'Ask questions about tenders',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const tickets = [
    {
      id: 'TK-001',
      subject: 'Unable to upload document',
      status: 'Open',
      date: '2024-01-25',
      priority: 'High'
    },
    {
      id: 'TK-002',
      subject: 'Payment status inquiry',
      status: 'Resolved',
      date: '2024-01-23',
      priority: 'Medium'
    },
    {
      id: 'TK-003',
      subject: 'Tender clarification needed',
      status: 'In Progress',
      date: '2024-01-22',
      priority: 'Low'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Support & Help Center</h2>
            <p className="text-gray-600 text-sm mt-1">Get assistance with technical issues and general queries</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'help'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'tickets'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Tickets (3)
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'contact'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Us
            </div>
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'help' && (
            <>
              {/* Search */}
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">How can we help you?</h3>
                  <p className="text-gray-600">Search our knowledge base or browse by category</p>
                </div>
                <div className="max-w-2xl mx-auto flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search help articles, guides, and FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>All</option>
                    <option>Bidding</option>
                    <option>Documents</option>
                    <option>Account</option>
                    <option>Technical</option>
                  </select>
                </div>
              </div>

              {/* Quick Help Categories */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Help</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpCategories.map((category, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-lg border-2 ${category.bgColor} ${category.borderColor} hover:shadow-md transition-all cursor-pointer group`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">{category.title}</h5>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h4>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <h5 className="font-medium text-gray-900">How to submit a successful bid?</h5>
                    <p className="text-sm text-gray-600 mt-1">Complete guide to preparing and submitting competitive bids</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <h5 className="font-medium text-gray-900">Document requirements and formats</h5>
                    <p className="text-sm text-gray-600 mt-1">What documents are required and in what format</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <h5 className="font-medium text-gray-900">Understanding tender evaluation criteria</h5>
                    <p className="text-sm text-gray-600 mt-1">How bids are evaluated and scored</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tickets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Support Tickets</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Create New Ticket
                </button>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Created: {ticket.date}</span>
                      <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                        Priority: {ticket.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
                  <p className="text-gray-600 text-sm mb-3">Mon-Fri, 9 AM - 6 PM IST</p>
                  <p className="font-semibold text-blue-600">+91-1800-123-4567</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                  <p className="text-gray-600 text-sm mb-3">Response within 24 hours</p>
                  <p className="font-semibold text-green-600">support@etenderportal.gov.in</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Send us a message</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <textarea
                    rows="4"
                    placeholder="Your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  ></textarea>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPopup;