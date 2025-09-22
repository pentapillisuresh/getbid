import React from 'react';

const SubscriptionForm = () => {
  return (
    <section className="min-h-screen bg-white flex items-center py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black mb-4">Get Your Vendor Subscription</h2>
            <p className="text-xl text-gray-600">Start your preferred plan and start submitting bids today</p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FD9A00] focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email *</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FD9A00] focus:border-transparent"
                  placeholder="Enter your business email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan *</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FD9A00] focus:border-transparent">
                <option>Select a plan</option>
                <option>Basic - ₹5,000</option>
                <option>Starter Pack - ₹7,000</option>
                <option>Pro Pack - ₹13,000</option>
              </select>
            </div>

            <div className="text-center">
              <button className="bg-[#FD9A00] text-white px-12 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105">
                📋 Subscribe Now
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              By subscribing you agree to our <a href="#" className="text-[#FD9A00] hover:underline">Terms and Privacy Policy</a>.
              We process your personal data for the subscription processes.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionForm;