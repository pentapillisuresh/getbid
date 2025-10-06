import React from 'react';
import { Award, Users, Calendar } from 'lucide-react';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Overview</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Experience</span>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">15+ Years</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Team Size</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">150+</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Established</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2008</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Company</h3>
          <p className="text-gray-700 leading-relaxed">
            Leading construction company specializing in infrastructure development, road construction, and civil engineering projects across South India.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Civil Construction</span>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Road Construction</span>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
