function PricingSection() {
  const plans = [
    {
      name: "Basic",
      price: "5,999",
      icon: "🎯",
      features: [
        "Access to curated up to 5 bids",
        "Bid tracking dashboard",
        "Email support",
        "Bid tracking dashboard",
        "Advanced analytics"
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      borderColor: "border-purple-200",
      popular: false
    },
    {
      name: "Standard Pack",
      price: "7,999",
      icon: "👑",
      features: [
        "Access to curated up to 10 bids",
        "Bid tracking dashboard",
        "Email & chat support",
        "Bid tracking dashboard",
        "Advanced analytics"
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      borderColor: "border-green-400",
      popular: true
    },
    {
      name: "Pro Pack",
      price: "13,999",
      icon: "💎",
      features: [
        "Unlimited bid access",
        "Bid tracking dashboard",
        "Priority 24/7 support",
        "Advanced bid analytics",
        "Advanced analytics"
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      borderColor: "border-purple-200",
      popular: false
    }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold mb-2">Choose Your Plan</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Vendor Subscription Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a plan that suits your business needs. All plans are for a subscription of one year. No hidden charges - cancel anytime!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${plan.borderColor} ${plan.popular ? 'relative' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                  POPULAR
                </div>
              )}
              <div className="text-4xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-gray-600">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-600">₹</span>
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                </div>
                <span className="text-gray-500 text-sm">per year</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`${plan.buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition w-full`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">💡</span>
            <h3 className="text-2xl font-bold text-gray-900">Why Choose Our Tender-Wise Plans?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-blue-500 mb-2">📝</div>
              <p className="text-gray-600">Pay only for what you use</p>
            </div>
            <div>
              <div className="text-green-500 mb-2">⭐</div>
              <p className="text-gray-600">Extended validity period</p>
            </div>
            <div>
              <div className="text-purple-500 mb-2">🎯</div>
              <p className="text-gray-600">Top-tier vendor packages</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Have custom needs and get tailored solutions?
          </p>
          <div className="flex justify-center gap-4">
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
