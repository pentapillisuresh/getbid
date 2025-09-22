import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'tender_created', label: 'Tender Created' },
    { value: 'tender_published', label: 'Tender Published' },
    { value: 'bid_received', label: 'Bid Received' },
    { value: 'evaluation_started', label: 'Evaluation Started' },
    { value: 'tender_awarded', label: 'Tender Awarded' },
    { value: 'user_login', label: 'User Login' },
    { value: 'document_uploaded', label: 'Document Uploaded' },
    { value: 'settings_changed', label: 'Settings Changed' }
  ];

  const users = [
    { value: 'all', label: 'All Users' },
    { value: 'dr_rajesh_kumar', label: 'Dr. Rajesh Kumar' },
    { value: 'priya_sharma', label: 'Priya Sharma' },
    { value: 'amit_patel', label: 'Amit Patel' },
    { value: 'system', label: 'System' }
  ];

  const auditLogs = [
    {
      id: 'AUD-2024-001',
      timestamp: '2024-04-14 15:30:25',
      user: 'Dr. Rajesh Kumar',
      userRole: 'Tender Administrator',
      action: 'tender_published',
      actionLabel: 'Tender Published',
      resource: 'Highway Construction Project Phase II',
      resourceId: 'TNR-2024-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Published tender for highway construction with estimated value ₹8.5 Cr',
      severity: 'info',
      category: 'Tender Management'
    },
    {
      id: 'AUD-2024-002',
      timestamp: '2024-04-14 14:20:15',
      user: 'Priya Sharma',
      userRole: 'Evaluation Officer',
      action: 'evaluation_started',
      actionLabel: 'Evaluation Started',
      resource: 'Medical Equipment Procurement',
      resourceId: 'TNR-2024-003',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Started technical evaluation for 31 received bids',
      severity: 'info',
      category: 'Bid Evaluation'
    },
    {
      id: 'AUD-2024-003',
      timestamp: '2024-04-14 13:45:30',
      user: 'System',
      userRole: 'System Process',
      action: 'bid_received',
      actionLabel: 'Bid Received',
      resource: 'Smart City Infrastructure Development',
      resourceId: 'TNR-2024-004',
      ipAddress: '10.0.0.1',
      userAgent: 'System Process',
      details: 'New bid received from Urban Solutions Pvt. Ltd. - Bid amount: ₹24.5 Cr',
      severity: 'info',
      category: 'Bid Management'
    },
    {
      id: 'AUD-2024-004',
      timestamp: '2024-04-14 12:15:45',
      user: 'Dr. Rajesh Kumar',
      userRole: 'Tender Administrator',
      action: 'tender_awarded',
      actionLabel: 'Tender Awarded',
      resource: 'School Building Construction',
      resourceId: 'TNR-2024-005',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Awarded tender to BuildRight Construction for ₹4.25 Cr',
      severity: 'high',
      category: 'Tender Management'
    },
    {
      id: 'AUD-2024-005',
      timestamp: '2024-04-14 11:30:20',
      user: 'Amit Patel',
      userRole: 'Document Reviewer',
      action: 'document_uploaded',
      actionLabel: 'Document Uploaded',
      resource: 'Vendor Verification Documents',
      resourceId: 'VND-001',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Uploaded compliance certificate for TechCorp Ltd.',
      severity: 'info',
      category: 'Document Management'
    },
    {
      id: 'AUD-2024-006',
      timestamp: '2024-04-14 10:45:10',
      user: 'System',
      userRole: 'System Process',
      action: 'user_login',
      actionLabel: 'User Login',
      resource: 'Authentication System',
      resourceId: 'AUTH-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Successful login by Dr. Rajesh Kumar',
      severity: 'info',
      category: 'Authentication'
    },
    {
      id: 'AUD-2024-007',
      timestamp: '2024-04-14 09:20:35',
      user: 'Priya Sharma',
      userRole: 'Evaluation Officer',
      action: 'settings_changed',
      actionLabel: 'Settings Changed',
      resource: 'Evaluation Criteria',
      resourceId: 'EVAL-001',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Updated technical evaluation weightage from 60% to 65%',
      severity: 'medium',
      category: 'System Configuration'
    },
    {
      id: 'AUD-2024-008',
      timestamp: '2024-04-13 16:55:20',
      user: 'Dr. Rajesh Kumar',
      userRole: 'Tender Administrator',
      action: 'tender_created',
      actionLabel: 'Tender Created',
      resource: 'Water Treatment Plant Upgrade',
      resourceId: 'TNR-2024-006',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Created new tender draft for water treatment plant upgrade',
      severity: 'info',
      category: 'Tender Management'
    }
  ];

  const getActionIcon = (action) => {
    switch (action) {
      case 'tender_created':
      case 'tender_published':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'bid_received':
        return <Plus className="w-5 h-5 text-green-600" />;
      case 'evaluation_started':
        return <Eye className="w-5 h-5 text-purple-600" />;
      case 'tender_awarded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'user_login':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'document_uploaded':
        return <Download className="w-5 h-5 text-orange-600" />;
      case 'settings_changed':
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = "inline-block px-2 py-1 rounded-full text-xs font-medium";
    
    switch (severity) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-600`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-600`;
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-600`;
      case 'low':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tender Management':
        return 'bg-blue-50 text-blue-600';
      case 'Bid Evaluation':
        return 'bg-purple-50 text-purple-600';
      case 'Bid Management':
        return 'bg-green-50 text-green-600';
      case 'Document Management':
        return 'bg-orange-50 text-orange-600';
      case 'Authentication':
        return 'bg-gray-50 text-gray-600';
      case 'System Configuration':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesUser = selectedUser === 'all' || log.user.toLowerCase().replace(/\s+/g, '_') === selectedUser;
    return matchesSearch && matchesAction && matchesUser;
  });

  const stats = [
    { label: 'Total Activities', value: '1,247', icon: <Shield className="w-6 h-6 text-blue-600" /> },
    { label: 'Today\'s Activities', value: '23', icon: <Clock className="w-6 h-6 text-green-600" /> },
    { label: 'Security Events', value: '5', icon: <AlertTriangle className="w-6 h-6 text-orange-600" /> },
    { label: 'System Changes', value: '12', icon: <Settings className="w-6 h-6 text-purple-600" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600">Complete system activity log and security monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
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

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {actionTypes.map(action => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {users.map(user => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="last-24-hours">Last 24 Hours</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div key={log.id} className="card border-l-4 border-primary-500 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-full bg-gray-50">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{log.actionLabel}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                    <span className={getSeverityBadge(log.severity)}>
                      {log.severity}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{log.details}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" />
                        <span><strong>User:</strong> {log.user} ({log.userRole})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4" />
                        <span><strong>Resource:</strong> {log.resource}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span><strong>Resource ID:</strong> {log.resourceId}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <span><strong>Timestamp:</strong> {log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span><strong>IP Address:</strong> {log.ipAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span><strong>Session ID:</strong> {log.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedAction !== 'all' || selectedUser !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'No audit activities recorded for the selected time period'}
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Security & Compliance</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• All system activities are automatically logged and monitored</p>
              <p>• Audit logs are retained for 7 years as per compliance requirements</p>
              <p>• Unauthorized access attempts are immediately flagged and investigated</p>
              <p>• Log integrity is protected using cryptographic signatures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;