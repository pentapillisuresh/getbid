import React from 'react';
import {
  FileText,
  Clock,
  Award,
  Users,
  TrendingUp,
  Calendar,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download
} from 'lucide-react';

const ClientDashboardHome = () => {
  const stats = [
    {
      title: 'Active Tenders',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      description: 'Currently published and open for bidding'
    },
    {
      title: 'Under Evaluation',
      value: '8',
      change: '+3',
      changeType: 'positive',
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      description: 'Bids received and under review'
    },
    {
      title: 'Awarded This Month',
      value: '15',
      change: '+5',
      changeType: 'positive',
      icon: <Award className="w-8 h-8 text-green-600" />,
      description: 'Tenders successfully awarded'
    },
    {
      title: 'Total Vendors',
      value: '248',
      change: '+12',
      changeType: 'positive',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      description: 'Registered vendor database'
    }
  ];

  const recentActivity = [
    {
      type: 'new_tender',
      title: 'New tender published',
      description: 'Highway Construction Project Phase 2',
      time: '2 hours ago',
      icon: <FileText className="w-5 h-5 text-green-600" />
    },
    {
      type: 'bid_completed',
      title: 'Bid evaluation completed',
      description: 'School Building Construction',
      time: '4 hours ago',
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />
    },
    {
      type: 'meeting_scheduled',
      title: 'Pre-bid meeting scheduled',
      description: 'Water Treatment Plant Upgrade',
      time: '6 hours ago',
      icon: <Calendar className="w-5 h-5 text-orange-600" />
    },
    {
      type: 'clarification',
      title: 'Clarification published',
      description: 'Metro Rail Extension Project',
      time: '1 day ago',
      icon: <FileText className="w-5 h-5 text-purple-600" />
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'Bridge Construction Tender',
      type: 'Bid Submission',
      deadline: '15/04/2024',
      daysLeft: 3,
      priority: 'high'
    },
    {
      title: 'Road Maintenance Contract',
      type: 'Technical Evaluation',
      deadline: '20/04/2024',
      daysLeft: 8,
      priority: 'medium'
    },
    {
      title: 'Hospital Equipment Supply',
      type: 'Award Decision',
      deadline: '25/04/2024',
      daysLeft: 13,
      priority: 'low'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Tender',
      description: 'Publish a new tender',
      icon: <Plus className="w-6 h-6 text-green-600" />,
      color: 'green'
    },
    {
      title: 'Schedule Pre-bid Meeting',
      description: 'Organize vendor meeting',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Evaluate Bids',
      description: 'Review submitted bids',
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      color: 'purple'
    },
    {
      title: 'Manage Vendors',
      description: 'Vendor verification',
      icon: <Users className="w-6 h-6 text-orange-600" />,
      color: 'orange'
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      color: 'indigo'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-primary-100 mb-4">Manage your tenders and track bid submissions efficiently</p>
            <div className="text-sm text-primary-200">Last 30 days</div>
          </div>
          <div className="text-right">
            <select className="bg-white/20 backdrop-blur text-white border border-white/30 rounded-lg px-3 py-2 text-sm">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {stat.icon}
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
              {stat.change !== '0' && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 rounded-full bg-gray-50">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All Activities →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${item.priority === 'high' ? 'border-red-400 bg-red-50' :
                    item.priority === 'medium' ? 'border-blue-400 bg-blue-50' :
                      'border-blue-400 bg-blue-50'
                  }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.type}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {item.deadline}</p>
                    </div>
                    <span className={`text-xs font-medium ${item.priority === 'high' ? 'text-red-600' :
                        item.priority === 'medium' ? 'text-blue-600' :
                          'text-blue-600'
                      }`}>
                      {item.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contract Value</span>
                <span className="text-lg font-bold text-green-600">₹45.2Cr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Bid Response Rate</span>
                <span className="text-lg font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Time</span>
                <span className="text-lg font-bold text-orange-600">12 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-bold text-purple-600">94%</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">System Status</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">All Services</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Last Backup</span>
                <span className="text-green-600 font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Security Scan</span>
                <span className="text-green-600 font-medium">Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardHome;