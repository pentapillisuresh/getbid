import React from "react";

const FinalCTA = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Ready to Start Your Tendering Journey?
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of successful vendors and clients who trust our
            platform for their tendering needs. Start today with a secure,
            efficient, and transparent digital experience.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-[#FD9A00] text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
              Register as Vendor
            </button>
            <button className="bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md">
              Register as Client
            </button>
            <button className="bg-white border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md">
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
