import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import TenderFormModal from "../popup/TenderFormModal";
import TenderDetailsModal from "../popup/TenderDetailsModal";
import api from '../../../services/apiService';
import toastService from '../../../services/toastService';


const TenderManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  // modal mode: 'create' | 'edit' | 'duplicate'
  const [modalMode, setModalMode] = useState('create');
  const [modalInitialData, setModalInitialData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // server-driven tenders state
  const [tendersData, setTendersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const handleTenderSaved = (data, mode = 'create') => {
    // mode === 'create' or 'duplicate' -> prepend
    // mode === 'edit' -> replace existing item in list
    if (!data) return;
    if (mode === 'edit') {
      setTendersData((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } else {
      setTendersData((prev) => [data, ...prev]);
      setTotalCount((c) => (typeof c === 'number' ? c + 1 : 1));
    }
  };

  const fetchTenders = async (pg = page, lim = limit) => {
    setLoading(true);
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const opts = { queryParams: { page: pg, limit: lim } };
      if (token) opts.headers = { Authorization: `Bearer ${token}` };

      const resp = await api.get('/v1/tenders', opts);
      if (resp && resp.success) {
        setTendersData(resp.data || []);
        setTotalCount(resp.totalCount || 0);
        setPage(resp.currentPage || pg);
        setTotalPages(resp.totalPages || 1);
      } else {
        toastService.showError((resp && resp.message) || 'Failed to load tenders');
      }
    } catch (err) {
      const msg = (err && err.data && err.data.message) || err.message || 'Failed to load tenders';
      toastService.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: 'all', label: 'All Tenders', count: 25 },
    { id: 'draft', label: 'Draft', count: 3 },
    { id: 'published', label: 'Published', count: 12 },
    { id: 'evaluation', label: 'Under Evaluation', count: 8 },
    { id: 'awarded', label: 'Awarded', count: 2 }
  ];

  const tenders = [
    {
      id: 'TNR-2024-001',
      title: 'Highway Construction Project Phase II',
      department: 'Department of Public Works',
      category: 'Construction',
      estimatedValue: '₹8,50,00,000',
      publishedDate: '2024-04-10',
      submissionDeadline: '2024-05-15',
      status: 'published',
      bidsReceived: 24,
      daysLeft: 15,
      priority: 'high',
      description: 'Construction of 25km highway with modern infrastructure and safety measures.'
    },
    {
      id: 'TNR-2024-002',
      title: 'Government Office IT Infrastructure',
      department: 'Ministry of Electronics & IT',
      category: 'IT Services',
      estimatedValue: '₹6,50,00,000',
      publishedDate: '2024-04-08',
      submissionDeadline: '2024-05-10',
      status: 'evaluation',
      bidsReceived: 18,
      daysLeft: -2,
      priority: 'high',
      description: 'Complete IT infrastructure setup including networking, servers, and security systems.'
    },
    {
      id: 'TNR-2024-003',
      title: 'Medical Equipment Procurement',
      department: 'State Health Department',
      category: 'Healthcare',
      estimatedValue: '₹12,50,00,000',
      publishedDate: '2024-04-05',
      submissionDeadline: '2024-05-20',
      status: 'published',
      bidsReceived: 31,
      daysLeft: 20,
      priority: 'medium',
      description: 'Procurement of advanced medical equipment for district hospitals.'
    },
    {
      id: 'TNR-2024-004',
      title: 'Smart City Infrastructure Development',
      department: 'Smart City Mission',
      category: 'Infrastructure',
      estimatedValue: '₹25,00,00,000',
      publishedDate: '2024-04-01',
      submissionDeadline: '2024-05-25',
      status: 'published',
      bidsReceived: 42,
      daysLeft: 25,
      priority: 'high',
      description: 'Development of smart city infrastructure with IoT integration.'
    },
    {
      id: 'TNR-2024-005',
      title: 'School Building Construction',
      department: 'Education Department',
      category: 'Construction',
      estimatedValue: '₹4,25,00,000',
      publishedDate: '2024-03-28',
      submissionDeadline: '2024-04-30',
      status: 'awarded',
      bidsReceived: 15,
      daysLeft: -15,
      priority: 'medium',
      description: 'Construction of new school buildings in rural areas.'
    },
    {
      id: 'TNR-2024-006',
      title: 'Water Treatment Plant Upgrade',
      department: 'Water Resources Department',
      category: 'Infrastructure',
      estimatedValue: '₹15,75,00,000',
      publishedDate: null,
      submissionDeadline: '2024-06-15',
      status: 'draft',
      bidsReceived: 0,
      daysLeft: 65,
      priority: 'high',
      description: 'Upgrading existing water treatment facilities with modern technology.'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'evaluation':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'awarded':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 'draft':
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'evaluation':
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case 'awarded':
        return `${baseClasses} bg-purple-100 text-purple-600`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-orange-100 text-orange-600`;
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

  const filteredTenders = tendersData.filter((tender) => {
    // adapt server tender fields to local UI expectations where possible
    const status = tender.status || tender.isActive ? 'published' : 'draft';
    const title = tender.title || '';
    const category = tender.category || '';
    const department = tender.postedBy?.name || '';

    const matchesTab = activeTab === 'all' || status === activeTab;
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    // attach derived fields used in UI for convenience
    tender.title = title;
    tender.category = category;
    tender.department = department;
    tender.estimatedValue = tender.value ? `₹${Number(tender.value).toLocaleString()}` : '—';
    tender.publishedDate = tender.createdAt ? tender.createdAt.split('T')[0] : null;
    tender.submissionDeadline = tender.bidDeadline ? tender.bidDeadline.split('T')[0] : '';
    tender.bidsReceived = tender.bidsReceived || 0;
    tender.daysLeft = tender.bidDeadline ? Math.ceil((new Date(tender.bidDeadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    tender.status = status;

    return matchesTab && matchesSearch;
  });

  const stats = [
    { label: 'Total Tenders', value: '25', icon: <FileText className="w-6 h-6 text-blue-600" /> },
    { label: 'Active Tenders', value: '12', icon: <CheckCircle className="w-6 h-6 text-green-600" /> },
    { label: 'Total Value', value: '₹72.5Cr', icon: <IndianRupee className="w-6 h-6 text-purple-600" /> },
    { label: 'Avg Response Rate', value: '78%', icon: <Users className="w-6 h-6 text-orange-600" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tender Management</h1>
          <p className="text-gray-600">Create, manage, and track your tender publications</p>
        </div>
        <button onClick={() => { setModalMode('create'); setModalInitialData(null); setShowModal(true); }} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Tender
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
                placeholder="Search tenders..."
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
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

      {/* Tender Cards */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => (
          <div key={tender.id} className="card border-l-4 border-primary-500 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-gray-50">
                  {getStatusIcon(tender.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tender.title}</h3>
                    <span className={getPriorityBadge(tender.priority)}>
                      {tender.priority}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {tender.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>ID: {tender.id}</span>
                    <span>•</span>
                    <span>{tender.department}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{tender.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Estimated Value</span>
                      <div className="font-semibold text-green-600">{tender.estimatedValue}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        {tender.publishedDate ? 'Published Date' : 'Draft Created'}
                      </span>
                      <div className="font-semibold text-gray-900">
                        {tender.publishedDate || 'Not Published'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Submission Deadline</span>
                      <div className="font-semibold text-gray-900">{tender.submissionDeadline}</div>
                      {tender.daysLeft > 0 ? (
                        <div className="text-sm text-blue-600">{tender.daysLeft} days left</div>
                      ) : tender.daysLeft === 0 ? (
                        <div className="text-sm text-red-600">Due today</div>
                      ) : (
                        <div className="text-sm text-red-600">Overdue by {Math.abs(tender.daysLeft)} days</div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Bids Received</span>
                      <div className="font-semibold text-purple-600">{tender.bidsReceived}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={getStatusBadge(tender.status)}>
                  {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedTender(tender);
                    setShowDetails(true);
                  }}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                {tender.status === 'draft' ? (
                  <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm">
                    <Edit className="w-4 h-4" />
                    Continue Editing
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // open modal in edit mode with this tender's data
                      setModalMode('edit');
                      setModalInitialData(tender);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Tender
                  </button>
                )}
                <button
                  onClick={() => {
                    // open modal in duplicate mode with this tender's data
                    setModalMode('duplicate');
                    // for duplication we remove id so the modal creates a new tender
                    const dup = { ...tender };
                    delete dup.id;
                    setModalInitialData(dup);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="flex items-center gap-2">
                {tender.status === 'draft' && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    Publish Tender
                  </button>
                )}
                {tender.status === 'published' && tender.bidsReceived > 0 && (
                  <button className="bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    View Bids ({tender.bidsReceived})
                  </button>
                )}
                {tender.status === 'evaluation' && (
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    Continue Evaluation
                  </button>
                )}
                {tender.status === 'awarded' && (
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    View Contract
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTenders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : activeTab === 'all'
                ? "You haven't created any tenders yet"
                : `No tenders found in ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} status`
            }
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create Your First Tender
          </button>
        </div>
      )}

      <TenderFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          // reset modal mode/data
          setModalMode('create');
          setModalInitialData(null);
        }}
        onSubmit={(data, mode) => {
          handleTenderSaved(data, mode);
        }}
        mode={modalMode}
        initialData={modalInitialData}
      />
      <TenderDetailsModal
        show={showDetails}
        onClose={() => setShowDetails(false)}
        tender={selectedTender}
      />


    </div>
  );
};

export default TenderManagement;