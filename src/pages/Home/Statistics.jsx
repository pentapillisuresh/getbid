import React from "react";

const Statistics = () => {
  const stats = [
    { value: "1,000+", label: "Registered Vendors" },
    { value: "₹500L+", label: "Contract Value" },
    { value: "500+", label: "Active Tenders" },
    { value: "98.5%", label: "Success Rate" },
  ];

  return (
    <section className="relative bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 animate-fade-in-up">
          Our <span className="text-[#FD9A00]">Impact in Numbers</span>
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-[#FD9A00] mb-2 animate-pulse">
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
