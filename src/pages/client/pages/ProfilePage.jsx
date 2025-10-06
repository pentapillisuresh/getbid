import React, { useState } from 'react';
import { Building2, CreditCard as Edit } from 'lucide-react';
import ProfileSidebar from './profile/ProfileSidebar';
import OverviewTab from './profile/OverviewTab';
import ContactInfoTab from './profile/ContactInfoTab';
import BusinessDetailsTab from './profile/BusinessDetailsTab';
import ParticipatedTendersTab from './profile/ParticipatedTendersTab';
import DocumentsTab from './profile/DocumentsTab';
import SecurityTab from './profile/SecurityTab';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'contact':
        return <ContactInfoTab />;
      case 'business':
        return <BusinessDetailsTab />;
      case 'tenders':
        return <ParticipatedTendersTab />;
      case 'documents':
        return <DocumentsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-sm text-gray-600">Manage your account information</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="flex max-w-screen-2xl mx-auto">
        <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
