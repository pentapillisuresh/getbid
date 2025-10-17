import React, { useState, useEffect } from "react";
import { Star, Crown, Target } from "lucide-react";
import api from "../../services/apiService";

function PricingSection() {
  // fallback plans (used while loading or if API returns empty)
  const fallbackPlans = [];

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/v1/plans", {
          queryParams: { page: 1, limit: 10 },
          showToasts: false,
        });
        // API shape: { success, message, data: [...], totalCount, ... }
        if (!mounted) return;
        const data = res && res.data ? res.data : [];
        setPlans(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load plans");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPlans();

    return () => {
      mounted = false;
    };
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-purple-600 font-semibold mb-2 uppercase">
            Choose Your Plan
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vendor Subscription Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a plan that suits your bidding needs. All plans are
            tender-wise – pay only for the number of tenders you want to bid on!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {(loading ? fallbackPlans : plans).map((plan, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 p-8 flex flex-col items-center text-center ${
                  plan.isPopular
                    ? "border-green-500"
                    : "border-gray-200 hover:border-purple-400"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-md">
                    POPULAR
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-4 p-4 rounded-full ${
                    plan.isPopular ? "bg-green-100" : "bg-purple-100"
                  } transition-all duration-300 ${
                    isHovered ? "scale-110 shadow-md" : ""
                  }`}
                >
                  {/* pick icon: allow API-provided icon key or fallback to Target */}
                  {plan.icon ? (
                    // if icon is a React element (fallbackPlans), clone it
                    React.isValidElement(plan.icon) ? (
                      React.cloneElement(plan.icon, {
                        className: `w-10 h-10 ${
                          plan.isPopular ? "text-green-600" : "text-purple-600"
                        } transition-all duration-300`,
                      })
                    ) : typeof plan.icon === "string" ? (
                      // map string keys to imported lucide-react icons
                      React.createElement(
                        { Star, Crown, Target }[plan.icon] || Target,
                        {
                          className: `w-10 h-10 ${
                            plan.isPopular
                              ? "text-green-600"
                              : "text-purple-600"
                          } transition-all duration-300`,
                        }
                      )
                    ) : (
                      // render a default icon when API provides an icon string
                      <Target
                        className={`w-10 h-10 ${
                          isHovered ? "text-purple-700" : "text-purple-600"
                        } transition-colors duration-300`}
                      />
                    )
                  ) : (
                    <Target
                      className={`w-10 h-10 ${
                        isHovered ? "text-purple-700" : "text-purple-600"
                      } transition-colors duration-300`}
                    />
                  )}
                </div>

                {/* Name & Price */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {plan.tendersLimit
                    ? `${plan.tendersLimit} Tender Submissions`
                    : plan.submissions}
                </p>
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  ₹
                  {typeof plan.price === "number"
                    ? plan.price.toLocaleString()
                    : plan.price}
                </div>
                <p
                  className={`text-sm font-medium mb-6 ${
                    plan.color === "green"
                      ? "text-green-600"
                      : "text-purple-600"
                  }`}
                >
                  ⏳{" "}
                  {plan.validDays
                    ? `Valid for ${plan.validDays} days`
                    : plan.duration}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-2 text-left w-full">
                  {(plan.included || plan.features || []).map(
                    (feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="text-green-500 mr-2 sm:mr-3 text-lg">
                          ✔
                        </span>
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>

                <ul className="space-y-3 mb-8 text-left w-full">
                  {(plan.excluded || []).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <span className="text-red-500 text-xl mr-2 sm:mr-3">
                        ✖
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`text-white px-6 py-3 rounded-lg font-semibold transition w-full ${
                    plan.color === "green"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                  onClick={() => (window.location.href = "/register")}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>

        {/* Why Choose Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">💡</span>
            <h3 className="text-2xl font-bold text-gray-900">
              Why Choose Our Tender-Wise Plans?
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-blue-500 mb-2 text-2xl">📝</div>
              <p className="text-gray-600">Pay only for what you use</p>
            </div>
            <div>
              <div className="text-green-500 mb-2 text-2xl">⭐</div>
              <p className="text-gray-600">Extended validity period</p>
            </div>
            <div>
              <div className="text-purple-500 mb-2 text-2xl">🎯</div>
              <p className="text-gray-600">Top-tier vendor packages</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Have custom needs and want tailored solutions?
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              ⭐ Start For Free Today
            </button>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition">
              📞 Get Custom Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingSection;
