function AboutSection() {
  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold mb-2">About GenMall</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Trusted Partner in Tendering Success</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            GenMall is dedicated to empowering businesses with cutting-edge tendering solutions. We help companies navigate the complex world of procurement with confidence and efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gray-200 rounded-2xl h-80"></div>
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize access to tendering opportunities by providing cutting-edge technology that simplifies the bidding process. We strive to level the playing field for businesses of all sizes, enabling them to compete effectively in the procurement marketplace.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-400 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                👁️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading tendering platform that transforms how businesses discover, bid, and win contracts. We envision a future where procurement is transparent, efficient, and accessible to all qualified vendors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-400 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Values</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Transparency in every interaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Innovation driving our solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Customer success as our priority</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
            <p className="text-gray-600">Tenders Posted</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">₹50Cr+</div>
            <p className="text-gray-600">Contracts Awarded</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
