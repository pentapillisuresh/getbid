import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import Header from '../components/shared/Header';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-primary-600" />,
      title: "Secure, Transparent Bidding",
      description: "Our platform ensures complete transparency in the bidding process with advanced security measures."
    },
    {
      icon: <Building2 className="w-12 h-12 text-green-600" />,
      title: "PAN India Tender Coverage",
      description: "Access tenders from across India with comprehensive government and private sector opportunities."
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Trusted by 1,000+ Vendors",
      description: "Join thousands of successful vendors who have trust our platform for their tendering needs."
    }
  ];

  const stats = [
    { value: "1,000+", label: "Registered Vendors" },
    { value: "₹500L+", label: "Contract Value" },
    { value: "500+", label: "Active Tenders" },
    { value: "98.5%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to E-Tendering Portal
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Your one-stop platform to explore, bid, and win tenders.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button 
              onClick={() => navigate('/choose-login-type')}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              🏢 Already a Vendor? Login
            </button>
            <button 
              onClick={() => navigate('/choose-login-type')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              🏛️ Already a Client? Login
            </button>
            <button 
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200"
            >
              📝 New to E-Tendering? Register Now
            </button>
          </div>

          <div className="text-center text-blue-100">
            <p>✅ Secure Platform • ⚡ 24x7 Support • 🎯 Expert Support</p>
          </div>
        </div>
      </div>

      {/* Vendor Subscription Plans */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vendor Subscription Plans</h2>
            <p className="text-xl text-gray-600">
              Choose a plan that suits your bidding needs. All plans are vendor-only pay for the number of tenders you want to bid on.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="card border-2 border-gray-200 hover:border-primary-300 transition-all duration-200">
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic (5 Tenders)</h3>
                <div className="text-3xl font-bold text-primary-600 mb-1">₹5,000</div>
                <p className="text-gray-500 mb-6">Valid for 90 Days</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Submit up to 5 bids</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Full tender access & details</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Email & SMS notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Document repository access</span>
                  </li>
                </ul>
                
                <button className="w-full btn-primary">Subscribe to Basic</button>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="card border-2 border-green-300 hover:border-green-400 transition-all duration-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter Pack (5 Tenders)</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">₹7,000</div>
                <p className="text-gray-500 mb-6">Valid for 90 days</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Submit up to 5 bids</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Full tender access & details</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Priority email & SMS alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Enhanced customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Advanced document management</span>
                  </li>
                </ul>
                
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Subscribe to Starter Pack
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card border-2 border-purple-300 hover:border-purple-400 transition-all duration-200">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Pack (10 Tenders)</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">₹13,000</div>
                <p className="text-gray-500 mb-6">Valid for 180 days</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Submit up to 10 bids</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Full tender access & details</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Priority email & SMS alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Top up credits anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Subscribe to Pro Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-primary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">🏆 Why Choose Us?</h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of successful vendors who trust our platform for secure and transparent bidding
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Start Your Tendering Journey?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of successful vendors and clients who trust our platform for their tendering needs. Start your journey today with a secure and efficient digital experience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200">
              📝 Register as New Vendor
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-200">
              🏛️ Register as New Client
            </button>
            <button 
              onClick={() => navigate('/choose-login-type')}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200"
            >
              🚀 Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;