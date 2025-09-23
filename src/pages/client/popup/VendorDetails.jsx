import React from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Award,
  FileText,
  Download,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';

const VendorDetails = ({ vendor, onClose }) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-orange-600" />;
      case 'suspended':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'delayed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Details</h1>
              <p className="text-gray-600 mt-1">Comprehensive vendor information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Profile
            </button>
            <button className="flex items-center gap-2 bg-primary-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-4 bg-gray-100 rounded-full">
                  {getStatusIcon(vendor.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                    {vendor.status === 'verified' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Verified
                      </span>
                    )}
                    {vendor.status === 'suspended' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Suspended
                      </span>
                    )}
                    {vendor.status === 'pending' && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{vendor.category}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Contact Person</div>
                          <div className="font-medium">{vendor.contactPerson}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium">{vendor.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium">{vendor.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium">{vendor.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Experience</div>
                          <div className="font-medium">{vendor.experience}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Employees</div>
                          <div className="font-medium">{vendor.employees}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {vendor.suspensionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Suspension Reason</span>
                  </div>
                  <p className="text-red-700">{vendor.suspensionReason}</p>
                </div>
              )}

              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vendor.totalTendersParticipated}</div>
                  <div className="text-sm text-gray-600">Total Tenders Participated</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{vendor.tendersWon}</div>
                  <div className="text-sm text-gray-600">Tenders Won</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{vendor.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{vendor.annualTurnover}</div>
                  <div className="text-sm text-gray-600">Annual Turnover</div>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Ratings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Technical Rating</span>
                      <span className="text-sm text-gray-600">({vendor.technicalRating})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingStars(vendor.technicalRating)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Financial Rating</span>
                      <span className="text-sm text-gray-600">({vendor.financialRating})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingStars(vendor.financialRating)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Delivery Rating</span>
                      <span className="text-sm text-gray-600">({vendor.deliveryRating})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingStars(vendor.deliveryRating)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Overall Rating</span>
                      <span className="text-sm text-gray-600">({vendor.overallRating})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingStars(vendor.overallRating)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Projects</h3>
              <div className="space-y-4">
                {vendor.recentProjects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">Year: {project.year}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <span className="font-semibold text-gray-900">{project.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-2">
                {vendor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                {vendor.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {vendor.status === 'suspended' && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    Activate Vendor
                  </button>
                )}
                {vendor.status === 'verified' && (
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    Suspend Vendor
                  </button>
                )}
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                  Edit Vendor Info
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                  View Tender History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;