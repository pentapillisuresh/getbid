import React from 'react';
import { Building2, Globe, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="">
              {/* <Building2 className="w-6 h-6 text-white" /> */}
              <img src="/images/getbidlogo.jpeg" alt="Logo" className="w-20 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">eTender Portal</h1>
              <p className="text-sm text-gray-600">Secure Procurement Platform</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;