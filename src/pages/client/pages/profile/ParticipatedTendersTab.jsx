import React from 'react';
import { ChevronRight, Download } from 'lucide-react';

const ParticipatedTendersTab = () => {
  const tenders = [
    {
      id: 1,
      name: 'Metro Rail Construction Phase 3',
      department: 'Public Works',
      location: 'Bangalore',
      amount: '₹450 Crore',
      status: 'Active',
      statusColor: 'green',
      date: 'Jan 15, 2024'
    },
    {
      id: 2,
      name: 'Highway Construction Project',
      department: 'Road Development',
      location: 'Mysore',
      amount: '₹280 Crore',
      status: 'In Review',
      statusColor: 'blue',
      date: 'Feb 20, 2024'
    },
    {
      id: 3,
      name: 'TechBuild Construction Pvt Ltd',
      department: 'Construction',
      location: 'Karnataka',
      amount: '₹340 Crore',
      status: 'Ongoing',
      statusColor: 'green',
      date: 'Mar 10, 2024'
    },
    {
      id: 4,
      name: 'TechBuild Infrastructure Ltd',
      department: 'Infrastructure',
      location: 'Chennai',
      amount: '₹520 Crore',
      status: 'Closed',
      statusColor: 'gray',
      date: 'Jan 5, 2024'
    },
    {
      id: 5,
      name: 'Road & Concrete Solutions',
      department: 'Road Development',
      location: 'Hyderabad',
      amount: '₹180 Crore',
      status: 'In Progress',
      statusColor: 'orange',
      date: 'Feb 28, 2024'
    },
    {
      id: 6,
      name: 'Metro Connect Builders',
      department: 'Public Transport',
      location: 'Delhi',
      amount: '₹620 Crore',
      status: 'Active',
      statusColor: 'green',
      date: 'Mar 15, 2024'
    },
    {
      id: 7,
      name: 'Urban Build Consultancy',
      department: 'Construction',
      location: 'Mumbai',
      amount: '₹390 Crore',
      status: 'In Progress',
      statusColor: 'orange',
      date: 'Jan 22, 2024'
    },
    {
      id: 8,
      name: 'Highway Bridge Construction',
      department: 'Infrastructure',
      location: 'Pune',
      amount: '₹420 Crore',
      status: 'Completed',
      statusColor: 'green',
      date: 'Dec 10, 2023'
    },
    {
      id: 9,
      name: 'Water Treatment Plant Project',
      department: 'Public Works',
      location: 'Jaipur',
      amount: '₹280 Crore',
      status: 'Active',
      statusColor: 'green',
      date: 'Feb 5, 2024'
    },
    {
      id: 10,
      name: 'Green Energy Infrastructure',
      department: 'Energy',
      location: 'Gujarat',
      amount: '₹550 Crore',
      status: 'In Progress',
      statusColor: 'orange',
      date: 'Mar 1, 2024'
    }
  ];

  const getStatusColor = (color) => {
    const colors = {
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      orange: 'bg-orange-50 text-orange-600',
      gray: 'bg-gray-50 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Participated Tenders</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {tenders.map((tender) => (
            <div key={tender.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{tender.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tender.statusColor)}`}>
                      {tender.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Department</p>
                      <p className="text-sm text-gray-900 font-medium">{tender.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900 font-medium">{tender.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                      <p className="text-sm text-gray-900 font-medium">{tender.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                      <p className="text-sm text-gray-900 font-medium">{tender.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing 10 of 45 tenders</span>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            View All Tenders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipatedTendersTab;
