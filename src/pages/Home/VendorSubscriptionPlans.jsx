import React from "react";
import { Check } from "lucide-react";

const VendorSubscriptionPlans = () => {
  const primaryColor = "bg-[#FD9A00]";
  const hoverColor = "hover:bg-orange-600";

  const plans = [
    {
      name: "Basic (5 Tenders)",
      price: "₹5,000",
      validity: "Valid for 90 days",
      features: [
        "Submit up to 5 bids",
        "Full tender access & details",
        "Email & SMS notifications",
        "Document repository access",
      ],
    },
    {
      name: "Starter Pack (5 Tenders)",
      price: "₹7,000",
      validity: "Valid for 90 days",
      popular: true,
      features: [
        "Submit up to 5 bids",
        "Full tender access & details",
        "Priority email & SMS alerts",
        "Enhanced customer support",
        "Advanced document management",
      ],
    },
    {
      name: "Pro Pack (10 Tenders)",
      price: "₹13,000",
      validity: "Valid for 180 days",
      features: [
        "Submit up to 10 bids",
        "Full tender access & details",
        "Priority email & SMS alerts",
        "Advanced analytics & reporting",
        "Top up credits anytime",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-black mb-4">
            Vendor Subscription Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose a plan that suits your bidding needs. Pay only for the number
            of tenders you want to bid on.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 relative flex flex-col justify-between transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${
                plan.popular
                  ? "border-2 border-[#FD9A00]"
                  : "border border-gray-200"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FD9A00] text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-black mb-4">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-extrabold text-[#FD9A00] mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-500 mb-8">{plan.validity}</p>
                </div>

                {/* Features */}
                <ul className="text-left space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-[#FD9A00]">
                        <Check className="w-4 h-4" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button stays aligned at bottom */}
              <button
                className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${primaryColor} ${hoverColor} shadow-md mt-auto`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorSubscriptionPlans;
