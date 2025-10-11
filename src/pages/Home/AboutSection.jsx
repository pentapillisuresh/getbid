import React from "react";
import { Target, Eye, Diamond } from "lucide-react";

function AboutSection() {
  return (
    <section className="about">
      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-purple-600 font-semibold mb-2">About  <span className="bg-gradient-to-r from-purple-700 to-green-600 bg-clip-text text-transparent font-bold text-base sm:text-lg">Getbid</span> </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Trusted Partner in Tendering Success
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Getbid is dedicated to empowering businesses with cutting-edge tendering solutions. We help companies navigate the complex world of procurement with confidence and efficiency.
            </p>
          </div>

          {/* Image + Details */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Image */}
            <div>
              <img
                src="/images/about.jpg" // replace with your actual image
                alt="About Getbid"
                className="rounded-2xl w-full h-full object-cover shadow-lg"
              />
            </div>

            {/* Right Content */}
            <div>
              {/* Mission */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To democratize access to tendering opportunities by providing cutting-edge technology that simplifies the bidding process. We strive to level the playing field for businesses of all sizes, enabling them to compete effectively in the procurement marketplace.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become the leading tendering platform that transforms how businesses discover, bid, and win contracts. We envision a future where procurement is transparent, efficient, and accessible to all qualified vendors.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Diamond className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Values</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      <span>Transparency in every interaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      <span>Innovation driving our solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      <span>Customer success as our priority</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-purple-50 p-6 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">500+</div>
              <p className="text-gray-600 text-sm sm:text-base">Active Users</p>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">1000+</div>
              <p className="text-gray-600 text-sm sm:text-base">Tenders Posted</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2">₹50Cr+</div>
              <p className="text-gray-600 text-sm sm:text-base">Contracts Awarded</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-orange-700 mb-2">95%</div>
              <p className="text-gray-600 text-sm sm:text-base">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
