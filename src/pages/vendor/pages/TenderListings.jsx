import React, { useState } from 'react';
import {
  Search,
  Download,
  Eye,
  Building2,
  MapPin,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import ViewDetailsPopup from '../popups/ViewDetailsPopup';
import QAPopup from '../popups/QAPopup';
import SubmitBidPopup from '../popups/SubmitBidPopup';
import SupportPopup from '../popups/SupportPopup';

const TenderListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [activePopup, setActivePopup] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  // -------------------- Filter Options --------------------
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'construction', label: 'Construction' },
    { value: 'it', label: 'IT Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'supply', label: 'Supply' },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'closing-soon', label: 'Closing Soon' },
    { value: 'prebid', label: 'Pre-bid Meeting' },
  ];

  const statesAndDistricts = {
    all: ['All Districts'],
    Maharashtra: ['All Districts', 'Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    Karnataka: ['All Districts', 'Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
    Delhi: ['All Districts', 'New Delhi', 'Central Delhi', 'East Delhi'],
    TamilNadu: ['All Districts', 'Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  };

  // -------------------- Tenders Data --------------------
  const tenders = [
    {
      id: 1,
      title: 'Highway Construction Project Phase II',
      department: 'Department of Public Works',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      district: 'Mumbai',
      category: 'Construction',
      estimatedValue: '₹85,50,000',
      publishedDate: '2024-04-15',
      deadline: '2024-05-15',
      status: 'Open',
      daysLeft: 15,
      description:
        'Construction of 25km highway with modern infrastructure including bridges, overpasses, and drainage systems.',
      eligibility: 'Class A contractors with minimum 5 years experience',
      documentFee: '₹5,000',
      emd: '₹1,70,000',
      statusColor: 'green',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Government Office IT Infrastructure',
      department: 'Ministry of Electronics & IT Services',
      location: 'Delhi, NCR',
      state: 'Delhi',
      district: 'New Delhi',
      category: 'IT Services',
      estimatedValue: '₹65,75,000',
      publishedDate: '2024-04-10',
      deadline: '2024-05-10',
      status: 'Closing Soon',
      daysLeft: 5,
      description:
        'Complete IT infrastructure setup for government building including networking, servers, workstations, and security systems.',
      eligibility: 'IT companies with government project experience',
      documentFee: '₹3,000',
      emd: '₹1,31,500',
      statusColor: 'yellow',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Medical Equipment Procurement',
      department: 'State Health Department',
      location: 'Bangalore, Karnataka',
      state: 'Karnataka',
      district: 'Bangalore',
      category: 'Healthcare',
      estimatedValue: '₹1,25,50,000',
      publishedDate: '2024-04-12',
      deadline: '2024-05-20',
      status: 'Open',
      daysLeft: 20,
      description:
        'Procurement of advanced medical equipment for district hospital including MRI machine, CT scan, and ultrasound systems.',
      eligibility: 'Medical equipment suppliers with ISO certification',
      documentFee: '₹7,500',
      emd: '₹2,51,000',
      statusColor: 'green',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Smart City Infrastructure Development',
      department: 'Smart City Mission',
      location: 'Pune, Maharashtra',
      state: 'Maharashtra',
      district: 'Pune',
      category: 'Construction',
      estimatedValue: '₹2,50,00,000',
      publishedDate: '2024-04-08',
      deadline: '2024-05-25',
      status: 'Pre-bid Meeting',
      daysLeft: 25,
      description:
        'Development of smart city infrastructure including IoT sensors, traffic management systems, and digital connectivity.',
      eligibility: 'Companies with smart city project experience',
      documentFee: '₹10,000',
      emd: '₹5,00,000',
      statusColor: 'blue',
      priority: 'high',
    },
    {
      id: 5,
      title: 'School Furniture Supply Contract',
      department: 'Education Department',
      location: 'Chennai, Tamil Nadu',
      state: 'TamilNadu',
      district: 'Chennai',
      category: 'Supply',
      estimatedValue: '₹45,75,000',
      publishedDate: '2024-04-14',
      deadline: '2024-05-18',
      status: 'Open',
      daysLeft: 18,
      description:
        'Supply of furniture for 50 government schools including desks, chairs, blackboards, and storage units.',
      eligibility: 'Furniture manufacturers with bulk supply capability',
      documentFee: '₹2,500',
      emd: '₹91,500',
      statusColor: 'green',
      priority: 'medium',
    },
  ];

  // -------------------- Filter Logic --------------------
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      tender.category.toLowerCase().includes(selectedCategory);
    const matchesStatus =
      selectedStatus === 'all' ||
      tender.status.toLowerCase().replace(' ', '-') === selectedStatus;
    const matchesState =
      selectedState === 'all' || tender.state === selectedState;
    const matchesDistrict =
      selectedDistrict === 'all' || tender.district === selectedDistrict;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesState &&
      matchesDistrict
    );
  });

  // -------------------- Badge Style --------------------
  const getStatusBadge = (status, statusColor, daysLeft) => {
    const baseClasses =
      'inline-block px-3 py-1 rounded-full text-xs font-medium';
    if (statusColor === 'green') return `${baseClasses} bg-green-100 text-green-600`;
    if (statusColor === 'yellow' || daysLeft <= 7)
      return `${baseClasses} bg-yellow-100 text-yellow-600`;
    if (statusColor === 'blue') return `${baseClasses} bg-blue-100 text-blue-600`;
    return `${baseClasses} bg-gray-100 text-gray-600`;
  };

  // -------------------- Popup Handlers --------------------
  const openPopup = (popupType, tender = null) => {
    setSelectedTender(tender);
    setActivePopup(popupType);
  };
  const closePopup = () => {
    setActivePopup(null);
    setSelectedTender(null);
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tender Listings</h1>
            <p className="text-gray-600 mt-1">Browse and filter available tenders</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredTenders.length} tenders
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('all');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All States</option>
              {Object.keys(statesAndDistricts)
                .filter((s) => s !== 'all')
                .map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statesAndDistricts[selectedState].map((d) => (
                <option key={d} value={d === 'All Districts' ? 'all' : d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tender Cards */}
        <div className="space-y-6">
          {filteredTenders.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {t.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {t.location}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {t.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={getStatusBadge(t.status, t.statusColor, t.daysLeft)}>
                      {t.status}
                    </span>
                    {t.priority === 'high' && (
                      <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                        <Star className="w-3 h-3 fill-current" /> High Priority
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{t.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">
                      Estimated Value
                    </div>
                    <div className="font-bold text-green-700 text-xl">
                      {t.estimatedValue}
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">
                      Submission Deadline
                    </div>
                    <div className="font-bold text-red-700">{t.deadline}</div>
                    <div className="text-sm text-red-600">{t.daysLeft} days left</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">
                      Published Date
                    </div>
                    <div className="font-bold text-blue-700">{t.publishedDate}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => openPopup('details', t)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => openPopup('qa', t)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" /> View Q&A
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                      onClick={() => openPopup('support')}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <Building2 className="w-4 h-4" /> Support
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.daysLeft <= 7 && (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <Clock className="w-4 h-4" /> Closing Soon
                      </span>
                    )}
                    <button
                      onClick={() => openPopup('submit', t)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tenders found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
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
      {activePopup === 'support' && <SupportPopup onClose={closePopup} />}
    </div>
  );
};

export default TenderListings;
