function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-green-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-purple-600 font-semibold mb-4">Intelligent Bid Management</p>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Streamline Your Bidding Process with Smart Technology
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Revolutionize your procurement operations with our cutting-edge bidding platform. Leverage AI-driven insights, real-time analytics, and seamless collaboration tools to stay ahead in today's competitive marketplace. Our solution helps you make faster, smarter, and better-informed bidding decisions.
            </p>
            <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                Get Started
              </button>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition">
                Learn More
              </button>
            </div>
            <div className="flex gap-2 mt-8">
              <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-200 to-green-200 rounded-3xl p-8 shadow-xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-pink-100 h-24 rounded-lg"></div>
                  <div className="bg-blue-100 h-24 rounded-lg"></div>
                  <div className="bg-green-100 h-24 rounded-lg"></div>
                  <div className="bg-purple-100 h-24 rounded-lg"></div>
                </div>
                <div className="flex justify-around items-end mb-4">
                  <div className="w-12 bg-purple-400 h-20 rounded-t"></div>
                  <div className="w-12 bg-blue-400 h-32 rounded-t"></div>
                  <div className="w-12 bg-green-400 h-24 rounded-t"></div>
                  <div className="w-12 bg-pink-400 h-28 rounded-t"></div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 bg-purple-100 h-16 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-purple-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-blue-100 h-16 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-green-100 h-16 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-green-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
