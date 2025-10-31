import React, { useState, useEffect } from "react";
import { 
  Star, 
  Crown, 
  Target, 
  Check, 
  X, 
  Lightbulb,
  FileText,
  Award,
  Zap,
  Calendar,
  IndianRupee,
  Phone,
  Sparkles
} from "lucide-react";
import api from "../../services/apiService";

function PricingSection() {
  const fallbackPlans = [
    {
      name: "Basic",
      price: 2999,
      tendersLimit: 5,
      validDays: 30,
      icon: "Target",
      features: ["5 Tender Submissions", "Basic Support", "Standard Features"],
      excluded: ["Priority Support", "Advanced Analytics"],
      color: "purple"
    },
    {
      name: "Professional",
      price: 7999,
      tendersLimit: 20,
      validDays: 60,
      icon: "Crown",
      features: ["20 Tender Submissions", "Priority Support", "Advanced Features"],
      excluded: ["Dedicated Manager"],
      isPopular: true,
      color: "green"
    },
    {
      name: "Enterprise",
      price: 19999,
      tendersLimit: 50,
      validDays: 90,
      icon: "Star",
      features: ["50 Tender Submissions", "Dedicated Manager", "All Features Included"],
      excluded: [],
      color: "purple"
    }
  ];

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
        if (!mounted) return;
        const data = res && res.data ? res.data : [];
        setPlans(data.length > 0 ? data : fallbackPlans);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load plans");
        setPlans(fallbackPlans);
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

  const iconMap = {
    Star: Star,
    Crown: Crown,
    Target: Target,
    Zap: Zap,
    Award: Award
  };

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Target;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Flexible Tender Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose a plan that grows with your business. Pay only for the tenders you bid on 
            with our transparent, usage-based pricing model.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {(loading ? [] : plans).map((plan, index) => {
            const isHovered = hoveredIndex === index;
            const IconComponent = iconMap[plan.icon] || Target;

            return (
              <div
                key={plan.id || index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative bg-white rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 p-8 flex flex-col h-full ${
                  plan.isPopular
                    ? "border-green-500 shadow-lg ring-2 ring-green-500 ring-opacity-20"
                    : "border-gray-200 hover:border-blue-300"
                } ${loading ? "animate-pulse" : ""}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                )}

                {/* Loading Skeleton */}
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Icon */}
                    <div className={`mb-6 p-4 rounded-2xl ${
                      plan.isPopular 
                        ? "bg-green-50 text-green-600" 
                        : "bg-blue-50 text-blue-600"
                    } transition-all duration-300 ${
                      isHovered ? "scale-110 shadow-lg" : ""
                    } self-center`}>
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Name & Description */}
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-center text-sm mb-4">
                      {plan.tendersLimit
                        ? `${plan.tendersLimit} Tender Submissions`
                        : plan.submissions}
                    </p>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-1">
                        <IndianRupee className="w-8 h-8 text-gray-700" />
                        <span className="text-4xl font-bold text-gray-900">
                          {typeof plan.price === "number"
                            ? plan.price.toLocaleString()
                            : plan.price}
                        </span>
                      </div>
                      <div className={`flex items-center justify-center gap-2 text-sm font-medium mt-2 ${
                        plan.isPopular ? "text-green-600" : "text-blue-600"
                      }`}>
                        <Calendar className="w-4 h-4" />
                        <span>
                          {plan.validDays
                            ? `Valid for ${plan.validDays} days`
                            : plan.duration}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-4 mb-8">
                      {/* Included Features */}
                      <div className="space-y-3">
                        {(plan.included || plan.features || []).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Excluded Features */}
                      {(plan.excluded || []).length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-gray-100">
                          {plan.excluded.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-400 text-sm line-through">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                      }`}
                      onClick={() => (window.location.href = "/register")}
                    >
                      <Zap className="w-5 h-5" />
                      Get Started
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl mb-12 border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Lightbulb className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              Why Choose Our Plans?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Pay Per Use</h4>
              <p className="text-gray-600 leading-relaxed">
                Only pay for the tenders you actually bid on. No hidden costs or monthly commitments.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:bg-green-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Extended Validity</h4>
              <p className="text-gray-600 leading-relaxed">
                Generous validity periods giving you ample time to find the right tenders.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:bg-purple-50 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Premium Features</h4>
              <p className="text-gray-600 leading-relaxed">
                Access top-tier vendor tools and features to enhance your bidding success rate.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Bidding Process?
          </h3>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of vendors who have increased their success rate with our targeted solutions.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Sparkles className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Talk to Sales
            </button>
          </div>
          
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricingSection;