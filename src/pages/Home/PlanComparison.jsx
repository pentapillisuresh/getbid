import React from "react";

const PlanComparison = () => {
  const comparisonData = [
    {
      plan: "Basic (5 Tenders)",
      access: "Access to submit up to 5 bids",
      price: "₹5,000",
      validity: "90 days",
    },
    {
      plan: "Starter Pack (5 Tenders)",
      access: "Submit up to 5 bids",
      price: "₹7,000",
      validity: "90 days",
    },
    {
      plan: "Pro Pack (10 Tenders)",
      access: "Submit up to 10 bids",
      price: "₹13,000",
      validity: "180 days",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Comparison
          </h2>
          <p className="text-lg text-gray-600">
            Compare our subscription plans and choose the one that best fits
            your bidding needs.
          </p>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Plan Name
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Validity
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.plan}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.access}</td>
                  <td className="px-6 py-4 text-[#FD9A00] font-bold">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.validity}</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#FD9A00] hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                      Subscribe Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PlanComparison;
