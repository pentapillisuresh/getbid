import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  FileText,
  Award,
  Clock,
  Target,
  Filter,
  RefreshCw
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedReport, setSelectedReport] = useState('overview');

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview Dashboard' },
    { value: 'tender-performance', label: 'Tender Performance' },
    { value: 'vendor-analysis', label: 'Vendor Analysis' },
    { value: 'financial-summary', label: 'Financial Summary' },
    { value: 'compliance-report', label: 'Compliance Report' }
  ];

  const kpiCards = [
    {
      title: 'Total Tender Value',
      value: '₹72.5 Cr',
      change: '+15.2%',
      changeType: 'positive',
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      description: 'Total value of all published tenders'
    },
    {
      title: 'Active Tenders',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      description: 'Currently open for bidding'
    },
    {
      title: 'Vendor Participation',
      value: '78%',
      change: '+5.8%',
      changeType: 'positive',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      description: 'Average response rate'
    },
    {
      title: 'Avg Processing Time',
      value: '12 days',
      change: '-2 days',
      changeType: 'positive',
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      description: 'From publication to award'
    }
  ];

  const tenderPerformanceData = [
    { category: 'Construction', published: 8, awarded: 6, value: '₹45.2 Cr', avgBids: 24 },
    { category: 'IT Services', published: 5, awarded: 4, value: '₹12.8 Cr', avgBids: 18 },
    { category: 'Healthcare', published: 3, awarded: 3, value: '₹8.5 Cr', avgBids: 31 },
    { category: 'Infrastructure', published: 4, awarded: 2, value: '₹6.0 Cr', avgBids: 15 },
    { category: 'Supply', published: 5, awarded: 4, value: '₹3.2 Cr', avgBids: 12 }
  ];

  const vendorAnalytics = [
    { metric: 'Total Registered Vendors', value: '248', trend: '+12 this month' },
    { metric: 'Verified Vendors', value: '186', trend: '75% of total' },
    { metric: 'Active Vendors (30 days)', value: '142', trend: '57% participation' },
    { metric: 'Top Performing Vendors', value: '24', trend: '90%+ success rate' },
    { metric: 'New Registrations', value: '18', trend: 'This month' },
    { metric: 'Blacklisted Vendors', value: '3', trend: '1.2% of total' }
  ];

  const complianceMetrics = [
    { metric: 'Document Verification Rate', value: '94%', status: 'excellent' },
    { metric: 'Tender Process Compliance', value: '98%', status: 'excellent' },
    { metric: 'Vendor KYC Completion', value: '89%', status: 'good' },
    { metric: 'Audit Trail Completeness', value: '100%', status: 'excellent' },
    { metric: 'Regulatory Compliance', value: '96%', status: 'excellent' },
    { metric: 'Data Security Score', value: '92%', status: 'excellent' }
  ];

  const recentTrends = [
    {
      title: 'Tender Publication Trend',
      description: 'Monthly tender publications showing 15% increase',
      trend: 'up',
      data: '8 → 12 → 15 → 18 (last 4 months)'
    },
    {
      title: 'Vendor Response Rate',
      description: 'Average bids per tender improving consistently',
      trend: 'up',
      data: '18 → 22 → 24 → 26 (avg bids per tender)'
    },
    {
      title: 'Processing Efficiency',
      description: 'Time from publication to award decreasing',
      trend: 'up',
      data: '18 → 15 → 14 → 12 days (average)'
    },
    {
      title: 'Cost Savings',
      description: 'Competitive bidding resulting in cost optimization',
      trend: 'up',
      data: '8% → 12% → 15% → 18% (savings vs estimate)'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'average':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {reportTypes.map(report => (
                <option key={report.value} value={report.value}>
                  {report.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {kpi.icon}
                <div>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-sm text-gray-600">{kpi.title}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                kpi.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <span>{kpi.change}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tender Performance */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tender Performance by Category</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Details →
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Published</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Awarded</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Bids</th>
                  </tr>
                </thead>
                <tbody>
                  {tenderPerformanceData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{item.category}</span>
                      </td>
                      <td className="py-4 px-4 text-blue-600 font-medium">{item.published}</td>
                      <td className="py-4 px-4 text-green-600 font-medium">{item.awarded}</td>
                      <td className="py-4 px-4 text-purple-600 font-medium">{item.value}</td>
                      <td className="py-4 px-4 text-gray-900">{item.avgBids}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trends</h3>
            <div className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{trend.title}</h4>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{trend.data}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Analytics & Compliance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendor Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Vendor Analytics</h2>
          <div className="space-y-4">
            {vendorAnalytics.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.metric}</div>
                  <div className="text-sm text-gray-500">{item.trend}</div>
                </div>
                <div className="text-2xl font-bold text-primary-600">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Compliance Metrics</h2>
          <div className="space-y-4">
            {complianceMetrics.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.metric}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tender Activity Timeline</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Monthly</button>
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">Weekly</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Daily</button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Interactive chart showing tender activity over time</p>
            <p className="text-sm text-gray-400">Chart visualization would be implemented here</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Export Reports</h3>
            <p className="text-sm text-blue-700">Download detailed reports in various formats</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
              PDF Report
            </button>
            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
              Excel Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Custom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;