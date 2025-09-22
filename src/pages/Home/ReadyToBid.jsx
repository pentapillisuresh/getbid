import React from "react";

const ReadyToBid = () => {
  return (
    <section className="min-h-[50vh] flex items-center py-16 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Bidding?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose your subscription plan and start participating in tenders today.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-[#FD9A00] text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
              Get Starter Pack - ₹7,000
            </button>
            <button className="border-2 border-[#FD9A00] text-[#FD9A00] px-8 py-4 rounded-xl font-semibold hover:bg-[#FD9A00] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md">
              Call for Custom Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToBid;
