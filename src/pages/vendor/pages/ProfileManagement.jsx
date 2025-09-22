import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  FileText, 
  Shield, 
  Camera,
  Edit,
  Save,
  X,
  Check,
  Upload,
  Download,
  AlertCircle
} from 'lucide-react';

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: <Building2 className="w-5 h-5" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'verification', label: 'Verification Status', icon: <Shield className="w-5 h-5" /> }
  ];

  const companyProfile = {
    companyName: 'TechCorp Ltd.',
    registrationNumber: 'CIN123456789',
    gstNumber: '27AABCT1332L000',
    panNumber: 'AABCT1332L',
    establishedYear: '2015',
    employeeCount: '150-300',
    annualTurnover: '₹50-100 Crores',
    businessType: 'Private Limited',
    industry: 'Information Technology',
    address: {
      street: 'Tech Park, Plot No. 123',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'contact@techcorp.com',
      website: 'www.techcorp.com'
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '****5678',
      ifscCode: 'HDFC0001234',
      accountType: 'Current Account'
    }
  };

  const documents = [
    {
      type: 'Company Registration Certificate',
      status: 'verified',
      uploadedDate: '2024-01-15',
      expiryDate: 'N/A',
      fileName: 'company_registration.pdf'
    },
    {
      type: 'GST Registration Certificate',
      status: 'verified',
      uploadedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      fileName: 'gst_certificate.pdf'
    },
    {
      type: 'PAN Card',
      status: 'verified',
      uploadedDate: '2024-01-15',
      expiryDate: 'N/A',
      fileName: 'pan_card.pdf'
    },
    {
      type: 'Bank Account Statement',
      status: 'pending',
      uploadedDate: '2024-04-10',
      expiryDate: 'N/A',
      fileName: 'bank_statement.pdf'
    },
    {
      type: 'ISO Certification',
      status: 'verified',
      uploadedDate: '2024-01-20',
      expiryDate: '2025-12-31',
      fileName: 'iso_certificate.pdf'
    },
    {
      type: 'Experience Certificate',
      status: 'expired',
      uploadedDate: '2023-06-15',
      expiryDate: '2024-03-15',
      fileName: 'experience_cert.pdf'
    }
  ];

  const verificationStatus = {
    overall: 'verified',
    percentage: 85,
    items: [
      { name: 'Company Registration', status: 'verified', completedDate: '2024-01-20' },
      { name: 'GST Verification', status: 'verified', completedDate: '2024-01-22' },
      { name: 'Bank Account Verification', status: 'pending', completedDate: null },
      { name: 'Professional Credentials', status: 'verified', completedDate: '2024-01-25' },
      { name: 'Address Verification', status: 'verified', completedDate: '2024-01-18' }
    ]
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-600`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-600`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'expired':
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600">Manage your company profile and verification documents</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            verificationStatus.overall === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
            {getStatusIcon(verificationStatus.overall)}
            {verificationStatus.overall === 'verified' ? 'Verified Profile' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-primary-600" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{companyProfile.companyName}</h2>
            <p className="text-gray-600 mb-2">{companyProfile.industry}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Est. {companyProfile.establishedYear}</span>
              <span>•</span>
              <span>{companyProfile.employeeCount} employees</span>
              <span>•</span>
              <span>{companyProfile.annualTurnover} turnover</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Profile Completion</div>
            <div className="text-2xl font-bold text-primary-600">{verificationStatus.percentage}%</div>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${verificationStatus.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isEditing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.companyName}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.registrationNumber}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.gstNumber}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.panNumber}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Address Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.address.street}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      defaultValue={companyProfile.address.city}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      defaultValue={companyProfile.address.state}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      defaultValue={companyProfile.address.pincode}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      defaultValue={companyProfile.address.country}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.contact.phone}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={companyProfile.contact.email}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    defaultValue={companyProfile.contact.website}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Bank Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.bankDetails.bankName}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.bankDetails.accountNumber}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    defaultValue={companyProfile.bankDetails.ifscCode}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Document Management</h3>
            <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.type}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Uploaded: {doc.uploadedDate}</span>
                        {doc.expiryDate !== 'N/A' && (
                          <>
                            <span>•</span>
                            <span>Expires: {doc.expiryDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={getStatusBadge(doc.status)}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Status Overview</h3>
            
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-primary-600 mb-2">{verificationStatus.percentage}%</div>
              <div className="text-gray-600 mb-4">Profile Verification Complete</div>
              <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${verificationStatus.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              {verificationStatus.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.completedDate && (
                        <div className="text-sm text-gray-500">Completed: {item.completedDate}</div>
                      )}
                    </div>
                  </div>
                  
                  <span className={getStatusBadge(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            {verificationStatus.percentage < 100 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Pending Verification</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Complete your bank account verification to reach 100% profile completion and unlock all features.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;