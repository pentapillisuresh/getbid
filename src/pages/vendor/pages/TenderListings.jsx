import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  DollarSign, 
  Building2,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  X
} from 'lucide-react';
import ViewDetailsPopup from '../popups/ViewDetailsPopup';
import QAPopup from '../popups/QAPopup';
import SubmitBidPopup from '../popups/SubmitBidPopup';
import SupportPopup from '../popups/SupportPopup';

const TenderListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activePopup, setActivePopup] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'construction', label: 'Construction' },
    { value: 'it', label: 'IT Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'supply', label: 'Supply' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'closing-soon', label: 'Closing Soon' },
    { value: 'prebid', label: 'Pre-bid Meeting' }
  ];

  const tenders = [
    {
      id: 1,
      title: 'Highway Construction Project Phase II',
      department: 'Department of Public Works',
      location: 'Mumbai, Maharashtra',
      category: 'Construction',
      estimatedValue: '₹85,50,000',
      publishedDate: '2024-04-15',
      deadline: '2024-05-15',
      status: 'Open',
      daysLeft: 15,
      description: 'Construction of 25km highway with modern infrastructure including bridges, overpasses, and drainage systems. The project involves modern road construction techniques, quality materials, and adherence to environmental standards.',
      eligibility: 'Class A contractors with minimum 5 years experience',
      documentFee: '₹5,000',
      emd: '₹1,70,000',
      statusColor: 'green',
      priority: 'high',
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'rajesh.kumar@pwd.gov.in',
      contactPhone: '+91-99988-77665'
    },
    {
      id: 2,
      title: 'Government Office IT Infrastructure',
      department: 'Ministry of Electronics & IT Services',
      location: 'Delhi, NCR',
      category: 'IT Services',
      estimatedValue: '₹65,75,000',
      publishedDate: '2024-04-10',
      deadline: '2024-05-10',
      status: 'Closing Soon',
      daysLeft: 5,
      description: 'Complete IT infrastructure setup for government building including networking, servers, workstations, and security systems.',
      eligibility: 'IT companies with government project experience',
      documentFee: '₹3,000',
      emd: '₹1,31,500',
      statusColor: 'yellow',
      priority: 'high',
      contactPerson: 'Priya Sharma',
      contactEmail: 'priya.sharma@meity.gov.in',
      contactPhone: '+91-99988-77665'
    },
    {
      id: 3,
      title: 'Medical Equipment Procurement',
      department: 'State Health Department',
      location: 'Bangalore, Karnataka',
      category: 'Healthcare',
      estimatedValue: '₹1,25,50,000',
      publishedDate: '2024-04-12',
      deadline: '2024-05-20',
      status: 'Open',
      daysLeft: 20,
      description: 'Procurement of advanced medical equipment for district hospital including MRI machine, CT scan, and ultrasound systems.',
      eligibility: 'Medical equipment suppliers with ISO certification',
      documentFee: '₹7,500',
      emd: '₹2,51,000',
      statusColor: 'green',
      priority: 'medium',
      contactPerson: 'Dr. Anitha Rao',
      contactEmail: 'anitha.rao@health.kar.gov.in',
      contactPhone: '+91-99988-55443'
    },
    {
      id: 4,
      title: 'Smart City Infrastructure Development',
      department: 'Smart City Mission',
      location: 'Pune, Maharashtra',
      category: 'Construction',
      estimatedValue: '₹2,50,00,000',
      publishedDate: '2024-04-08',
      deadline: '2024-05-25',
      status: 'Pre-bid Meeting',
      daysLeft: 25,
      description: 'Development of smart city infrastructure including IoT sensors, traffic management systems, and digital connectivity.',
      eligibility: 'Companies with smart city project experience',
      documentFee: '₹10,000',
      emd: '₹5,00,000',
      statusColor: 'blue',
      priority: 'high',
      contactPerson: 'Amit Patil',
      contactEmail: 'amit.patil@smartcity.pune.gov.in',
      contactPhone: '+91-99988-66554'
    },
    {
      id: 5,
      title: 'School Furniture Supply Contract',
      department: 'Education Department',
      location: 'Chennai, Tamil Nadu',
      category: 'Supply',
      estimatedValue: '₹45,75,000',
      publishedDate: '2024-04-14',
      deadline: '2024-05-18',
      status: 'Open',
      daysLeft: 18,
      description: 'Supply of furniture for 50 government schools including desks, chairs, blackboards, and storage units.',
      eligibility: 'Furniture manufacturers with bulk supply capability',
      documentFee: '₹2,500',
      emd: '₹91,500',
      statusColor: 'green',
      priority: 'medium',
      contactPerson: 'Kavitha Nair',
      contactEmail: 'kavitha.nair@edu.tn.gov.in',
      contactPhone: '+91-99988-33221'
    }
  ];

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tender.category.toLowerCase().includes(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || tender.status.toLowerCase().replace(' ', '-') === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status, statusColor, daysLeft) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    
    if (statusColor === 'green') {
      return `${baseClasses} bg-green-100 text-green-600`;
    } else if (statusColor === 'yellow' || daysLeft <= 7) {
      return `${baseClasses} bg-yellow-100 text-yellow-600`;
    } else if (statusColor === 'blue') {
      return `${baseClasses} bg-blue-100 text-blue-600`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const openPopup = (popupType, tender = null) => {
    setSelectedTender(tender);
    setActivePopup(popupType);
  };

  const closePopup = () => {
    setActivePopup(null);
    setSelectedTender(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tender Listings</h1>
            <p className="text-gray-600 mt-1">Browse and filter available tenders</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total: {filteredTenders.length} tenders</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tender Cards */}
        <div className="space-y-6">
          {filteredTenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tender.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {tender.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {tender.location}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                            {tender.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={getStatusBadge(tender.status, tender.statusColor, tender.daysLeft)}>
                          {tender.status}
                        </span>
                        {tender.priority === 'high' && (
                          <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                            <Star className="w-3 h-3 fill-current" />
                            High Priority
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{tender.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Estimated Value</div>
                        <div className="font-bold text-green-700 text-xl">{tender.estimatedValue}</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-sm text-red-600 font-medium">Submission Deadline</div>
                        <div className="font-bold text-red-700">{tender.deadline}</div>
                        <div className="text-sm text-red-600">{tender.daysLeft} days left</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Published Date</div>
                        <div className="font-bold text-blue-700">{tender.publishedDate}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 font-medium">Eligibility:</span>
                          <div className="font-medium text-gray-900 mt-1">{tender.eligibility}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Document Fee:</span>
                          <div className="font-bold text-blue-600 mt-1">{tender.documentFee}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">EMD:</span>
                          <div className="font-bold text-purple-600 mt-1">{tender.emd}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => openPopup('details', tender)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button 
                      onClick={() => openPopup('qa', tender)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Q&A
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={() => openPopup('support')}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      Support
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {tender.daysLeft <= 7 && (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Closing Soon
                      </span>
                    )}
                    <button 
                      onClick={() => openPopup('submit', tender)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                      Submit Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTenders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Popups */}
      {activePopup === 'details' && selectedTender && (
        <ViewDetailsPopup tender={selectedTender} onClose={closePopup} />
      )}
      
      {activePopup === 'qa' && selectedTender && (
        <QAPopup tender={selectedTender} onClose={closePopup} />
      )}
      
      {activePopup === 'submit' && selectedTender && (
        <SubmitBidPopup tender={selectedTender} onClose={closePopup} />
      )}
      
      {activePopup === 'support' && (
        <SupportPopup onClose={closePopup} />
      )}
    </div>
  );
};

export default TenderListings;