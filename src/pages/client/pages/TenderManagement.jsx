import React, { useState } from "react";
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
  Download,
  MessageCircle,
  Link,
  Award,
} from "lucide-react";
import TenderFormModal from "../popup/TenderFormModal";
import TenderDetailsModal from "../popup/TenderDetailsModal";
import CancelTenderModal from "../popup/CancelTenderModal";
import EditTenderModal from "../popup/EditTenderModal";

const TenderManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleNewTender = (data) => {
    console.log("New Tender Data:", data);
    // TODO: Save to backend
  };

  const handleEditTender = (data) => {
    console.log("Updated Tender Data:", data);
    // TODO: Update tender in backend
  };

  const tabs = [
    { id: "all", label: "All Tenders", count: 25 },
    { id: "draft", label: "Draft", count: 3 },
    { id: "published", label: "Published", count: 12 },
    { id: "evaluation", label: "Under Evaluation", count: 8 },
    { id: "awarded", label: "Awarded", count: 2 },
  ];

  const tenders = [
    {
      id: "TND2024001",
      title: "Highway Construction Project Phase 2",
      department: "Active Infrastructure",
      category: "Infrastructure",
      estimatedValue: "₹25.0 Cr",
      publishedDate: "15/03/2024",
      submissionDeadline: "15/04/2024",
      status: "published",
      bidsReceived: 12,
      daysLeft: -554,
      priority: "high",
      description: "Construction of 4-lane highway connecting major cities",
      createdBy: "Dr. Rajesh Kumar",
      clarifications: 5,
      preBidMeeting: true,
      linkedAccount: false,
      awardedTo: "",
    },
    {
      id: "TND2024002",
      title: "School Building Construction",
      department: "Building",
      category: "Construction",
      estimatedValue: "₹8.5 Cr",
      publishedDate: "20/02/2024",
      submissionDeadline: "20/03/2024",
      status: "evaluation",
      bidsReceived: 8,
      daysLeft: -15,
      priority: "medium",
      description: "Construction of modern educational facility",
      createdBy: "Priya Sharma",
      clarifications: 3,
      preBidMeeting: true,
      linkedAccount: true,
      awardedTo: "",
    },
    {
      id: "TND2024003",
      title: "Water Treatment Plant Upgrade",
      department: "Water Supply",
      category: "Infrastructure",
      estimatedValue: "₹12.0 Cr",
      publishedDate: "10/01/2024",
      submissionDeadline: "10/02/2024",
      status: "awarded",
      bidsReceived: 6,
      daysLeft: -45,
      priority: "high",
      description: "Modernization of existing water treatment facility",
      createdBy: "Amit Patel",
      clarifications: 2,
      preBidMeeting: false,
      linkedAccount: true,
      awardedTo: "AquaTech Solutions Pvt Ltd",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "evaluation":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "awarded":
        return <Award className="w-5 h-5 text-purple-600" />;
      case "draft":
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "published":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "evaluation":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "awarded":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-orange-100 text-orange-800`;
    }
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesTab = activeTab === "all" || tender.status === activeTab;
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    {
      label: "Total Tenders",
      value: "25",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Active Tenders",
      value: "12",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Total Value",
      value: "₹72.5Cr",
      icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
    },
    {
      label: "Avg Response Rate",
      value: "78%",
      icon: <Users className="w-6 h-6 text-orange-600" />,
    },
  ];

  const handleViewDetails = (tender) => {
    setSelectedTender(tender);
    setShowDetails(true);
  };

  const handleEditTenderClick = (tender) => {
    setSelectedTender(tender);
    setShowEditModal(true);
  };

  const handleCancelTender = () => {
    setShowCancelModal(true);
    setShowDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tender Management
          </h1>
          <p className="text-gray-600">
            Create, manage, and track your tender publications
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Tender
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
          <div
            key={tender.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getStatusIcon(tender.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tender.title}
                      </h3>
                      <span className={getStatusBadge(tender.status)}>
                        {tender.status === "evaluation"
                          ? "Evaluation"
                          : tender.status.charAt(0).toUpperCase() +
                            tender.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{tender.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      tender.daysLeft > 0 ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {tender.daysLeft > 0
                      ? `${tender.daysLeft} days left`
                      : `${Math.abs(tender.daysLeft)} days ago`}
                  </div>
                </div>
              </div>

              {/* Description and ID */}
              <p className="text-gray-700 mb-3">{tender.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>ID: {tender.id}</span>
                <span>•</span>
                <span>Est. Value: {tender.estimatedValue}</span>
                <span>•</span>
                <span>Bids: {tender.bidsReceived}</span>
                <span>•</span>
                <span>Published: {tender.publishedDate}</span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Deadline:</span>
                  <div className="font-semibold text-gray-900">
                    {tender.submissionDeadline}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Clarifications:</span>
                  <div className="font-semibold text-gray-900">
                    {tender.clarifications}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500">Created by:</span>
                  <div className="font-semibold text-gray-900">
                    {tender.createdBy}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  {tender.preBidMeeting && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      Pre-bid meeting scheduled
                    </div>
                  )}
                  {tender.linkedAccount && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Link className="w-4 h-4" />
                      Linked to main account
                    </div>
                  )}
                  {tender.awardedTo && (
                    <div className="flex items-center gap-2 text-purple-600 text-sm">
                      <Award className="w-4 h-4" />
                      Awarded to {tender.awardedTo}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewDetails(tender)}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditTenderClick(tender)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  {tender.status === "published" && (
                    <>
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                        <MessageCircle className="w-4 h-4" />
                        Manage Q&A
                      </button>
                      <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm">
                        <Edit className="w-4 h-4" />
                        Amend Tender
                      </button>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Start Evaluation
                      </button>
                    </>
                  )}

                  {tender.status === "evaluation" && (
                    <>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Evaluate Bids
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Award Tender
                      </button>
                    </>
                  )}
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
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tenders found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria"
              : activeTab === "all"
              ? "You haven't created any tenders yet"
              : `No tenders found in ${tabs
                  .find((t) => t.id === activeTab)
                  ?.label.toLowerCase()} status`}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Tender
          </button>
        </div>
      )}

      {/* Modals */}
      <TenderFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewTender}
      />

      <TenderDetailsModal
        show={showDetails}
        onClose={() => setShowDetails(false)}
        tender={selectedTender}
        onCancelTender={handleCancelTender}
      />

      <CancelTenderModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        tender={selectedTender}
      />

      <EditTenderModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        tender={selectedTender}
        onSave={handleEditTender}
      />
    </div>
  );
};

export default TenderManagement;
